'use client'
import { Content } from 'antd/es/layout/layout';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import styles from './disease.module.scss';
import SearchConditionForm from './component/SearchCondition/searchConditionForm';
import { Breadcrumb, Button, ConfigProvider, Flex, TablePaginationConfig } from 'antd';
import { PlusOutlined, ExportOutlined, HomeOutlined } from '@ant-design/icons';
import TableComponent from './component/Table/table';
import { diseaseModel } from './model/disease-model';
import { fetchDiseaseDataForExport } from '@/services/Disease/exportDiseaseDiagnosesApi';
import { fetchDiseaseData } from '@/services/Disease/diseaseDiagnosesApi';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import UseAxiosAuth from '@/utils/axiosClient';
import { AxiosInstance } from 'axios';
import Link from 'next/link';

interface TableParams {
    pagination?: TablePaginationConfig;
}
const cx = classNames.bind(styles);
const DiseaseDiagnostic = () => {
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [apiData, setApiData] = useState<diseaseModel[]>([]);
    const t = useTranslations('Disease');
    const tCom = useTranslations('common');
    const router = useRouter();
    const http = UseAxiosAuth();
    const { data: session, status } = useSession();
    const [tableParams, setTableParams] = useState<TableParams>({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });

    useEffect(() => {
        const getData = async (http: AxiosInstance | null) => {
            try {
                setLoading(true);
                const pagination: TablePaginationConfig = {
                    pageSize: 10,
                    current: 1
                }
                const responseData = await fetchDiseaseData(http,"","","", pagination.pageSize, pagination.current);
                const normalizedData: diseaseModel[] = responseData['data'].map(
                    (item: any, index: number) => ({
                        key : item.id,
                        no: index + 1,
                        predictResult: item.plantDisease.diseaseName,
                        description: item.description,
                        feedback: item.feedback,
                        date: item.createdDate,
                    })
                );
                setApiData(normalizedData);
                setTableParams({
                    ...pagination,
                    pagination: {
                      ...pagination,
                      total: responseData.pagination.totalRecord,
                    },
                  });
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
        getData(http);
    },[http]);

    const searchAction = async (pagination: TablePaginationConfig) => {
        try {
            setLoading(true);
            const responseData = await fetchDiseaseData(http, keyword, dateFrom, dateTo, pagination.pageSize, pagination.current);
            const normalizedData: diseaseModel[] = responseData['data'].map(
                (item: any, index: number) => ({
                    key : item.id,
                    no: index + 1 + (pagination.pageSize ?? 10) * ((pagination.current ?? 1) - 1),
                    predictResult: item.plantDisease.diseaseName,
                    description: item.description,
                    feedback: item.feedback,
                    date: item.createdDate,
                })
            );
            setApiData(normalizedData);
            setTableParams({
                ...pagination,
                pagination: {
                  ...pagination,
                  total: responseData.pagination.totalRecord,
                },
              });
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
            const responseData = await fetchDiseaseDataForExport(http, keyword, dateFrom, dateTo);
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
    const handleDiagnoses = () => {
        router.push("/sa/diagnostic/add");
    }
    const handleKeyword = (e : any) => {
        setKeyword(e.target.value);
    };
    const handleDate = (dates: any, dateStrings: any)  => {
        setDateFrom(dateStrings[0]);
        setDateTo(dateStrings[1]);
    };
    const breadCrumb = [
        {
            title: <Link href={`/`}>{tCom('home')}</Link>
        },
        {
            title: t('disease_diagnostic')
        }
    ];
    return (
        <>
            <ConfigProvider
            theme={{
                components: {
                Button: {
                    contentFontSizeLG: 24,
                    fontWeight: 700,
                    groupBorderColor: 'transparent',
                    onlyIconSizeLG: 24,
                    paddingBlockLG: 0,
                    defaultBorderColor: 'transparent',
                    defaultBg: 'transparent',
                    defaultShadow: 'none',
                    primaryShadow: 'none',
                    linkHoverBg: 'transparent',
                    paddingInlineLG: 24,
                    defaultGhostBorderColor: 'transparent'
                }
            }
        }}
        >
        {' '}
        <Button
            className={cx('home-btn')}
            href='#'
            size={'large'}
        >
            <HomeOutlined />
            {tCom('home')}
        </Button>
        </ConfigProvider>
        <Content style={{ padding: '20px 48px' }}>
            <h3 className={cx('disease__title')}>{t('diagnostic')}</h3>
            <Breadcrumb style={{ margin: '0px 24px 24px 24px' }} items={breadCrumb} />
            {/* Search condition */}
            <ColoredLine text={t('search_condition')}/> 
            <div>
                <SearchConditionForm 
                    handleDate={handleDate}
                    handleKeyword={handleKeyword}
                    searchAction={searchAction}
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
                    onClick={handleDiagnoses}
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
            <TableComponent data={apiData} loading={loading} searchAction={searchAction} tablePag={tableParams}/>
        </Content>
    </>
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
export default DiseaseDiagnostic;
