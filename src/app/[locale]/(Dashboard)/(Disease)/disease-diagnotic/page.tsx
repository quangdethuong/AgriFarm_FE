'use client'
import { Content } from 'antd/es/layout/layout';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import styles from '../disease.module.scss';
import SearchConditionForm from './component/SearchCondition/searchConditionForm';
import { Button, Flex } from 'antd';
import { PlusOutlined, ExportOutlined } from '@ant-design/icons';
import TableComponent from './component/Table/table';
import { diseaseModel } from './model/disease-model';
import fetchDiseaseDataForExport from '@/services/Disease/exportDiseaseDiagnosesApi';
import fetchDiseaseData from '@/services/Disease/diseaseDiagnosesApi';

const cx = classNames.bind(styles);
const DiseaseDiagnotic = () => {
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [apiData, setApiData] = useState<diseaseModel[]>([]);
    const t = useTranslations('Disease');
    
    useEffect(() => {
        // Lấy dữ liệu từ localStorage khi component được render
        const conditionSearch = localStorage.getItem('conditionSearch');
        if (conditionSearch) {
            const condition = JSON.parse(conditionSearch);
            setKeyword(condition[0]);
            setDateFrom(condition[1]);
            setDateTo(condition[2]);
            returnSearchAction(keyword, dateFrom, dateTo);
        }
    }, [keyword, dateFrom, dateTo]);
    
    const handleKeyword = (e : any) => {
        setKeyword(e.target.value);
    };
    const handleDate = (dates: any, dateStrings: any)  => {
        setDateFrom(dateStrings[0]);
        setDateTo(dateStrings[1]);
    };
    const returnSearchAction = async (keyword : string , dateFrom : string , dateTo : string ) => {
        try {
            setLoading(true);
            const responseData = await fetchDiseaseData(keyword, dateFrom, dateTo);
            setApiData(responseData);
            localStorage.setItem('conditionSearch', JSON.stringify([keyword, dateFrom, dateTo]));
            console.log('API Response:', responseData);
        } catch (error: unknown) {
            // Assert the type of error to be an instance of Error
            if (error instanceof Error) {
                throw new Error(`Error calling API: ${error.message}`);
            } else {
                throw new Error(`Unknown error occurred: ${error}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const searchAction = async () => {
        try {
            setLoading(true);
            const responseData = await fetchDiseaseData(keyword, dateFrom, dateTo);
            setApiData(responseData);
            localStorage.setItem('conditionSearch', JSON.stringify([keyword, dateFrom, dateTo]));
            console.log('API Response:', responseData);
        } catch (error: unknown) {
            // Assert the type of error to be an instance of Error
            if (error instanceof Error) {
                throw new Error(`Error calling API: ${error.message}`);
            } else {
                throw new Error(`Unknown error occurred: ${error}`);
            }
        } finally {
            setLoading(false);
        }
    };
    const exportExcel = async () => {
        try {
            const responseData = await fetchDiseaseDataForExport(keyword, dateFrom, dateTo);
            const binaryString = window.atob(responseData.data);
            const uint8Array = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                uint8Array[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([uint8Array], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

            // Tạo và kích hoạt liên kết tải về
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.download = "Diagnostic.xlsx";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            // Thực hiện các hành động với dữ liệu từ API
            console.log('API Response:', responseData);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    };
    return (
    <Content style={{ padding: '30px 48px' }}>
        <h1 className={cx('disease__title')}>{t('diagnostic')}</h1>
        {/* Search condition */}
        <ColoredLine text={t('search_condition')}/> 
        <div>
            <SearchConditionForm 
                handleDate={handleDate}
                handleKeyword={handleKeyword}
                searchAction={searchAction} 
                keyword={keyword} dateFrom={dateFrom} dateTo={dateTo}
            />
        </div>
        {/* Search result */}
        <ColoredLine text={t('search_result')}/>
        <Flex gap="small" wrap="wrap">
            <Button
                type='primary'
                htmlType='submit'
                icon={<PlusOutlined />} 
                size='large'
                className={cx('disease__btn')}
            >
                {t('add_diagnosis')}
            </Button>
            <Button
                type='primary'
                htmlType='submit'
                size='large'
                icon= {<ExportOutlined />}
                className={cx('disease__btn')}
                disabled = {apiData.length == 0}
                onClick={exportExcel}
            >
                {t('export_excel')}
            </Button>
        </Flex>
        <TableComponent data={apiData} loading={loading} />
    </Content>
    );
};
interface ColoredLineProps {
    text: string;
}
const ColoredLine: React.FC<ColoredLineProps> = ({ text }) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className={cx('disease__line')} style={{flex: 1}}/>
        <span style={{ marginLeft: 5, marginRight: 5}}>{text}</span>
        <div className={cx('disease__line')} style={{flex: 12}}/>
    </div>
);
export default DiseaseDiagnotic;
