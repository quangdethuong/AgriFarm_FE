'use client'
import { Content } from "antd/es/layout/layout";
import classNames from "classnames/bind";
import styles from './disease.module.scss';
import { useTranslations } from "next-intl";
import { WarningDiseaseDef, diseaseDiagnosticDef, landDef, plantDiseaseDef, siteDef } from "./model/diseaseDiagnosticModel";
import { useEffect, useState } from "react";
import { getListLandApi } from "@/services/Disease/getListLandApi";
import { Breadcrumb, Button, Col, ConfigProvider, Empty, Row, Select, Spin, Tabs, TabsProps } from "antd";
import { Input } from 'antd';
import diseaseDiagnosesAddApi from "@/services/Disease/diseaseDiagnosesAddApi";
import ModalComponent from "./component/modal/modal";
import { STATUS_OK } from "@/constants/https";
import plantDiseaseInfoApi from "@/services/Disease/plantDiseaseInfoApi";
import diseaseDiagnosesUpdateFbApi from "@/services/Disease/diseaseDiagnosesUpdateFbApi";
import UseAxiosAuth from '@/utils/axiosClient';
import { AxiosInstance } from 'axios';
import { useSession } from "next-auth/react";
import axios from 'axios';
import Link from "next/link";
import { HomeOutlined } from "@ant-design/icons";
import notiSiteApi from "@/services/Disease/notiSiteApi";
import { getListSiteDistanceApi } from "@/services/Disease/getListSiteDistanceApi";

interface positionDef {
    lat: string;
    long: string;
}
const DiseaseDiagnosticAdd = () => {
    const { TextArea } = Input;
    const cx = classNames.bind(styles);
    const t = useTranslations('Disease');
    const tCom = useTranslations('common');
    const [listLand, setListLand] = useState<Array<landDef>>([]);
    const [posiontionsLand, setPositionsLand] = useState<positionDef>();
    const [loadings, setLoadings] = useState<boolean>(false);
    const [selLand, setSelLand] = useState("");
    const [description, setDescription] = useState("");
    const [displayModalAdd, setDisplayModalAdd] = useState(false);
    const [msgAdd, setMsgAdd] = useState("");
    const [diagnosticRs, setDiagnosticRs] = useState(false);
    const [diagnoeseId, setDiagnoeseId] = useState("");
    const [plantDisease, setPlantDisease] = useState<plantDiseaseDef | null>(null);
    const [feedback, setFeedback] = useState("");
    const http = UseAxiosAuth();
    const { data: session } = useSession();
    const [itemsDisease, setItemsDisease] = useState<TabsProps["items"]>();
    const [defaultActiveKey, setDefaultActiveKey] = useState<string>("");
    const rhumbDistance = require('@turf/rhumb-distance').default;

    useEffect(() => {
        getListLand(http, session?.user?.userInfo.siteId as string);
    },[http, session?.user?.userInfo.siteId]);
    // get list land
    const getListLand = async (http: AxiosInstance | null, siteId : string) => {
        try {
            const res = await getListLandApi(http, siteId);
            setListLand(res);
        } catch (error) {
            console.log(error)
        }
    }

     //call api notification
     const warningDisease = async (siteId : any, distance : any, diseaseName : any) => {
        console.log("Thông báo bệnh")
        const warningDisease: WarningDiseaseDef = {
            siteId: siteId,
            distance: distance,
            diseaseName: diseaseName,
        };
        const responseData = await notiSiteApi(http, warningDisease);
    };

    //Hàm tính khoảng cách giữa 2 điểm
    const calculateDistance = (point1 : any, point2 : any) => {
        const distanceInMeters = rhumbDistance(point1, point2);
        const distanceInKilometers = distanceInMeters / 1000; 
        return distanceInKilometers;
    };
    

    //Hàm xử lí thống báo, nhận vào vị trí land, tên bệnh
    const notifyAction = async (location : any, diseaseName : any) => {
        //Gọi APi lấy thông tin site , SiteId, Position, NotiDistance
        // const getListSiteDistanceData: any = getListSiteDistance(http);
        const responseData = await getListSiteDistanceApi(http);

        const landLocation = [parseFloat(location.lat as string), parseFloat(location.long as string)];
        console.log(responseData);
        //Tính khoảng cách từ từng Site -> Land bệnh, Nếu khoảng cách < NotiDistance -> goi API noti
        responseData.data.forEach((site: any) => {
            if (site.positions.length != 0) {
                const siteLocation = [parseFloat(site.positions[0].lat), parseFloat(site.positions[0].long)];
                const distance = calculateDistance(siteLocation, landLocation);
                console.log(`Khoảng cách đến ${site.id}: ${distance}`);
    
                if (distance < site.NotiDistance) {
                    warningDisease(site.id, distance, diseaseName)
                }
            }
        });
    }
   
    // Call api AI disease
    const submitAction = async () => {
        try {
            if (description.length < 50) {
                setMsgAdd(t('min_length'));
                setDisplayModalAdd(true);
                return;
            }
            setLoadings(true);
            const url = `${process.env.NEXT_PUBLIC_AI_API}/get_disease`;
            axios.post(url, {
                Description: description
            })
                .then(async (response : any) => {
                    console.log(response.data);
                    const diseaseId = response.data.result;
                    if (diseaseId.length == 0) {
                        setMsgAdd(t('disease_diagnostic_fail'));
                        setDisplayModalAdd(true);
                    } else {
                        let isForEachComplete = false; // Khởi tạo biến cờ
                        let listDisease: TabsProps['items'] = [];
                        diseaseId.forEach(async (element: string, index: number) => {
                            const diseaseDiagnostic : diseaseDiagnosticDef = {
                                plantDiseaseId: element,
                                description: description,
                                feedback: "",
                                location: `${posiontionsLand?.lat},${posiontionsLand?.long}`,
                                createBy: session?.user?.userInfo.id as string,
                                landId: selLand,
                            };
                            const res = await diseaseDiagnosesAddApi(http, diseaseDiagnostic);
                            if (res.statusCode != STATUS_OK) {
                                setMsgAdd(t('disease_diagnostic_fail'));
                                setDisplayModalAdd(true);
                                return;
                            } else {
                                setDiagnoeseId(res.data.id);
                                const responseData = await plantDiseaseInfoApi(http, element);
                                if (responseData.statusCode == STATUS_OK) {
                                    if (element == "b23294ba-d83a-4a96-8697-edb5dad34c03" &&
                                        (description.includes("chín") ||
                                        description.includes("chính") ||
                                        description.includes("chin") ||
                                        description.includes("chinh"))
                                    ) {
                                    } else {
                                        const items = {
                                            key: element,
                                            label: responseData.data.diseaseName
                                        };
                                        if (index == 0) {
                                            setDefaultActiveKey(element);
                                            setPlantDisease(responseData.data);
                                        }
                                        listDisease?.push(items);
                                        
                                        // Gọi hàm xử lí thông báo
                                        notifyAction(posiontionsLand, responseData.data.diseaseName);


                                        //console.log(posiontionsLand);
                                        //var locationTest = {lat: '9.283725056753724', long: '105.73845326030607'};
                                        // var positionTest = {lat :'9.991505110856679',long:'105.66594148483802'};

                                        // const landLocation = [parseFloat(posiontionsLand?.lat as string), parseFloat(posiontionsLand?.long as string)];
                                        // const stationLocation = [parseFloat(positionTest.lat), parseFloat(positionTest.long)];
                                        // const distance = calculateDistance(stationLocation, landLocation);
                                        // console.log(`Khoảng cách: ${distance}`);

                                    }
                                }
                                setMsgAdd("");
                                setDiagnosticRs(true);
                            }
                            // Kiểm tra xem đã chạy hết vòng lặp chưa
                            if (index === diseaseId.length - 1) {
                                isForEachComplete = true;
                            }
                        });
                        // Sau khi vòng lặp kết thúc, kiểm tra và thực hiện đoạn mã
                        const checkCompletionInterval = setInterval(() => {
                            if (isForEachComplete) {
                                clearInterval(checkCompletionInterval); // Dừng interval
                                if (listDisease == undefined || listDisease.length == 0) {
                                    setMsgAdd(t('disease_diagnostic_fail'));
                                    setDisplayModalAdd(true);
                                    setPlantDisease(null);
                                }
                            }
                        }, 100); // Kiểm tra mỗi 100ms
                        setItemsDisease(listDisease);
                    }
                    
                })
                .catch((error : any) => {
                    throw new Error(error);
            });
        } catch (error) {
            console.log(error);
            setMsgAdd(t('disease_diagnostic_fail'));
            setDisplayModalAdd(true);
        } finally {
            setLoadings(false);
        }
    }
    const resetComponent = () => {
        setDisplayModalAdd(false);
        setMsgAdd("");
        setLoadings(false);
        setDiagnosticRs(false);
        setDescription("");
        setSelLand("");
    }
    const sendFeedback = async () => {
        try {
            setLoadings(true);
            const res = await diseaseDiagnosesUpdateFbApi(http, diagnoeseId, feedback);
            console.log(res);
        } catch (error) {
            console.log(error);
        } finally {
            resetComponent();
        }
    }
    const handleInputDescription = (e : any) => {
        setDescription(e.target.value);
    }
    const handleSelectLand = (value: string) => {
        const arrVal = value.split(",");
        setSelLand(arrVal[0]);
        setPositionsLand(
            {
                lat: arrVal[1],
                long: arrVal[2]
            }
        );
    }
    const handleClose = () => {
        setDisplayModalAdd(false);
    };
    const handleFeedback = (e : any) => {
        setFeedback(e.target.value);
    }
    
    const breadCrumb = [
        {
            title: <Link href={`/`}>{tCom('home')}</Link>
        },
        {
            title: t('disease_diagnostic')
        }
    ];

    const onChange = async (key: string) => {
        try {
            setLoadings(true);
            const responseData = await plantDiseaseInfoApi(http, key);
            if (responseData.statusCode == STATUS_OK) {
                setPlantDisease(responseData.data);
            }
            setMsgAdd("");
            setDiagnosticRs(true);
        } catch (error) {
            console.log(error);
            setMsgAdd("Error!!!!!");
            setDisplayModalAdd(true);
        } finally {
            setLoadings(false);
        }
    };

    const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
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
                {session?.user?.userInfo.siteName}
            </Button>
            </ConfigProvider>
            <Content style={{ padding: '20px 48px' }}>
                <h3 className={cx('disease__title')}>{t('disease_diagnostic')}</h3>
                <Breadcrumb style={{ margin: '0px 24px 24px 24px' }} items={breadCrumb} />
                {diagnosticRs == true && msgAdd == "" ? (
                    <>
                        {plantDisease && (
                            <>
                                <div className={cx('dd')}>
                                    <Row>
                                        <label className={cx('dd__label')}>{t('lbl_description')}</label>
                                    </Row>
                                    <Row className={cx('dd__row')}>
                                        <p className={cx('dd__content')}>{description}</p>
                                    </Row>
                                    <Spin spinning={loadings}>
                                    <div className={cx('dd__result')}>
                                        <h3 className={cx('dd__result--label')}>{t('diagnostic_result')}</h3>
                                        
                                        <Row className={cx('dd__row')}>
                                            <Tabs defaultActiveKey={defaultActiveKey} items={itemsDisease} onChange={onChange} />
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <Col span={2}>
                                                <label className={cx('dd__label')}>{t('lbl_disease_name')}</label>
                                            </Col>
                                            <Col span={12}>
                                                <p className={cx('dd__content')}>{plantDisease.diseaseName}</p>
                                            </Col>
                                            <Col span={8}></Col>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <label className={cx('dd__label')}>{t('lbl_symptoms')}</label>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <div className="ck-content" dangerouslySetInnerHTML={{__html: plantDisease.symptoms}}></div>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <label className={cx('dd__label')}>{t('lbl_cause')}</label>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <div className="ck-content" dangerouslySetInnerHTML={{__html: plantDisease.cause}}></div>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <label className={cx('dd__label')}>{t('lbl_preventive_measures')}</label>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <div className="ck-content" dangerouslySetInnerHTML={{__html: plantDisease.preventiveMeasures}}></div>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <label className={cx('dd__label')}>{t('lbl_suggest')}</label>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <div className="ck-content" dangerouslySetInnerHTML={{__html: plantDisease.suggest}}></div>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <label className={cx('dd__label')}>{t('lbl_feedback')}</label>
                                        </Row>
                                        <Row className={cx('dd__row')}>
                                            <TextArea onChange={handleFeedback} className={cx('dd__content')} rows={3} placeholder={t('lbl_feedback')} style={{width: "100%"}}/>
                                        </Row>
                                        <Row className={cx('dd__row')} style={{flexDirection: "row-reverse"}}>
                                            <Button
                                                    type="primary"
                                                    htmlType="submit"
                                                    size="large"
                                                    className={`${cx('disease__btn')} ${cx('disease__btn--save')}`}
                                                    onClick={sendFeedback}
                                                    loading={loadings}
                                                >   
                                                {t('send_feedback')}
                                            </Button>
                                        </Row>
                                    </div>
                                    </Spin>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <>
                        <Spin spinning={loadings}>
                            <div className={cx('dd')}>
                                <Row className={cx('dd__row')}>
                                    <label className={cx('dd__label')}>{t('land_name')}</label>
                                </Row>
                                <Row>
                                    <Select 
                                        disabled={loadings}
                                        showSearch
                                        placeholder={t('select_land')}
                                        filterOption={filterOption}
                                        options={listLand}
                                        optionFilterProp="children"
                                        style={{width: "40%"}}
                                        onChange={handleSelectLand}
                                        notFoundContent= {<Empty description={tCom('no_data')}/>}
                                    />
                                </Row>
                                <Row className={cx('dd__row')}>
                                    <label className={cx('dd__label')}>{t('enter_description_disease')}</label>
                                </Row>
                                <Row>
                                    <TextArea onChange={handleInputDescription} disabled={loadings} rows={6} cols={7} placeholder={t('enter_description_disease')} style={{width: "70%"}}/>
                                </Row>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className={`${cx('disease__btn')} ${cx('disease__btn--save')}`}
                                    onClick={submitAction}
                                >   
                                {t('save_btn')}
                                </Button>
                            </div>
                        </Spin>
                    </>
                )}
            </Content>
            {displayModalAdd && msgAdd && (
                <ModalComponent title={t('disease_diagnostic')} body={msgAdd} open={displayModalAdd} handleClose={handleClose}/>
            )}
        </>
    );
}

export default DiseaseDiagnosticAdd;