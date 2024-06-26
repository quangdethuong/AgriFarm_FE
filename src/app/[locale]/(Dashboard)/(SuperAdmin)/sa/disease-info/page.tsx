'use client'
import Link from "next/link";
import styles from './disease.module.scss';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import { Content } from "antd/es/layout/layout";
import { Breadcrumb, Button, Divider, Select, Space, App, ConfigProvider } from "antd";
import { useEffect, useState } from "react";
import diseaseInfoDetailApi from "@/services/Disease/diseaseInfoDetailApi";
import DetailComponent from "./component/detail/detail";
import { useRouter } from 'next/navigation';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import diseaseInfoListApi from "@/services/Disease/diseaseInfoListApi";
import diseaseInfoDeleteApi from "@/services/Disease/diseaseInfoDeleteApi";
import { STATUS_OK } from "@/constants/https";
import UseAxiosAuth from '@/utils/axiosClient';
import { AxiosInstance } from 'axios';
import { DASH_BOARD_PATH } from "@/constants/routes";

interface DiseaseInfo {
    id: string;
    diseaseName: string;
    symptoms: string;
    cause: string;
    preventiveMeasures: string;
    suggest: string;
}
interface SelectDiseaseName {
    value: string;
    label: string;
}
const DetailPage = () => {
    const { modal , message} = App.useApp();
    const router = useRouter();
    const cx = classNames.bind(styles);
    const t = useTranslations('Disease');
    const tCom = useTranslations('Common');
    const [diseaseInfoDetail, setDiseaseInfoDetail] = useState<DiseaseInfo | null>(null);
    const [diseaseId, setDiseaseId] = useState("");
    const [optionDiseaseName, setOptionDiseaseName] = useState<Array<SelectDiseaseName>>([]);
    const http = UseAxiosAuth();

    useEffect(() => {
        getDiseaseInfoList(http).catch(console.error);
    },[http]);

    const getDiseaseInfoList = async (http: AxiosInstance | null,) => {
        const responseData = await diseaseInfoListApi(http);
        const options : SelectDiseaseName[] = responseData.data.map((item : DiseaseInfo) => {
            return {
                value: item.id,
                label: item.diseaseName
            }
        });
        setOptionDiseaseName(options);
    }
    const getDiseaseInfo = async (id : string) => {
        try {
            const responseData = await diseaseInfoDetailApi(http, id);
            setDiseaseInfoDetail(responseData.data);
            console.log(responseData);
        } catch (error) {
            console.error('Error calling API:', error);
        }
    }
    const breadCrumb = [
        {
            title: <Link href={`/`}>{tCom('home')}</Link>
        },
        {
            title: t('disease_info_detail')
        }
    ];
    const editAction = () => {
        console.log("Edit action.....");
        router.push(`/sa/disease-info/update/${diseaseId}`);
    };
    const deleteAction = async () => {
        console.log("Delete action.....");
        try {
            const responseData = await diseaseInfoDeleteApi(http, diseaseId);
            if (responseData.statusCode == STATUS_OK) {
                showMessageSuccess();
                setDiseaseInfoDetail(null);
                getDiseaseInfoList(http).catch(console.error);
            } else {
                showMessageError();
            }
        } catch (error) {
            console.error(error);
            showMessageError();
        }
    };

    const addItem = () => {
        router.push(`/sa/disease-info/add`);
    }
    const selectDiseaseName = (value : string) => {
        console.log(value);
        setDiseaseId(value);
        getDiseaseInfo(value);
    }

    const deleteConfirm = () => {
        modal.confirm({
            title: t('delete_title'),
            content: `${t('msg_confirm_delete')} "${diseaseInfoDetail?.diseaseName}"?`,
            okText: t('delete_btn'),
            okButtonProps: {
                className: cx('disease__btn--delete')
            },
            cancelText: t('cancel_btn'),
            cancelButtonProps: {
                className: cx('disease__btn--cancel')
            },
            onOk() {
                console.log('OK');
                deleteAction();
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    
    const showMessageSuccess = () => {
        message.success('Success!');
    };
    const showMessageError = () => {
        message.error('Error!');
    };
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
            href={DASH_BOARD_PATH}
            size={'large'}
        >
            <HomeOutlined />
            {tCom('home')}
        </Button>
        </ConfigProvider>
        <Content style={{ padding: '20px 48px' }}>
            <h3 className={cx('disease__title')}>{t('disease_info_detail')}</h3>
            <Breadcrumb style={{ margin: '0px 24px 24px 24px' }} items={breadCrumb} />
            {optionDiseaseName && (
                <Select
                    style={{ width: 300 }}
                    placeholder={t('select_disease_name')}
                    dropdownRender={(menu) => (
                        <>
                            {menu}
                            <Divider style={{ margin: '8px 0' }} />
                            <Space style={{ padding: '0 8px 4px' }}>
                                <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                    {t('add_btn')}
                                </Button>
                            </Space>
                        </>
                    )}
                    onChange={selectDiseaseName}
                    options={optionDiseaseName}
                />
            )}
            {diseaseInfoDetail && (
                <>
                    <DetailComponent data={diseaseInfoDetail}/>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className={`${cx('disease__btn')} ${cx('disease__btn--save')}`}
                        onClick={editAction}
                    >   
                    {t('edit_btn')}
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className={`${cx('disease__btn')} ${cx('disease__btn--delete')}`}
                        onClick={deleteConfirm}
                    >   
                    {t('delete_btn')}
                    </Button>
                </>
            )}
        </Content>
        </>
    );
}

const DiseaseInfoDetail: React.FC = () => (
    <App>
      <DetailPage />
    </App>
);
export default DiseaseInfoDetail;
