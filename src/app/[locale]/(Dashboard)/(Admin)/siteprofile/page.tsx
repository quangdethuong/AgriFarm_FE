'use client';
import * as React from 'react';
import { useState, useCallback } from 'react';
import BreadcrumbArgiFarm from '@/components/Breadcrumb/breadCrumb';
import { usePathname } from '@/navigation';
import { AWS_PATH_GET, SITE_MAP_PATH } from '@/constants/routes';
import { Content } from 'antd/es/layout/layout';
import {
  Button,
  Col,
  ConfigProvider,
  Form,
  FormInstance,
  Input,
  Row,
  Upload,
  message,
  notification
} from 'antd';

import Map, {
  FullscreenControl,
  GeolocateControl,
  Marker,
  NavigationControl,
  ScaleControl
} from 'react-map-gl';
import type { MarkerDragEvent, LngLat } from 'react-map-gl';
import GeocoderControl from '@/components/MapBox/geocoder-controll';
import { MAPBOX_TOKEN } from '@/constants/mapbox_token';
import TitleLabelFormItem from '@/components/TitleLabel/TitleLabelFormItem';

import styles from './sitepro.module.scss';
import classNames from 'classnames/bind';
import Pin from '@/components/MapBox/pin';
import { AxiosInstance } from 'axios';
import { Position, Sites } from '@/services/SuperAdmin/Site/payload/response/sites';
import { STATUS_CREATED, STATUS_OK } from '@/constants/https';
import { getSitesService } from '@/services/SuperAdmin/Site/getSiteService';
import UseAxiosAuth from '@/utils/axiosClient';
import MapBoxAgriFarm from '@/components/MapBox/mapBoxReact';

import { addPositionService } from '@/services/SuperAdmin/Site/addPositionService';
import useGeolocation from '@/utils/getlocaiton';
import { updateSiteService } from '@/services/SuperAdmin/Site/updateInforService';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { MAP_BOX_SATELLITE } from '@/constants/MapBoxStyles';
import { useSession } from 'next-auth/react';
import { UploadOutlined } from '@ant-design/icons';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import UploadImgAgri from '@/components/Upload/uploadAvatar';
import ImgCrop from 'antd-img-crop';
import { UploadFileApi } from '@/services/Admin/Media/uploadFileApi';
import { formItemLayoutSite } from './components/FormItemLayout/formItemSite';

const cx = classNames.bind(styles);
type Props = {};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
const UpdateSitePageForUser = () => {
  const path = usePathname();
  const { data: session } = useSession();
  const [form] = Form.useForm();
  const [sitesDetail, setSitesDetail] = useState<Sites | undefined>();
  const siteId = session?.user.userInfo.siteId || '';

  const [previewImage, setPreviewImage] = useState<string>('');
  const [loadingMap, setLoading] = useState<boolean>(true);
  const [displayMarker, setDisplayMarker] = useState<boolean>(true);
  const [stateBtnConfirm, setStateBtnConfirm] = useState<boolean>(true);
  const handleMapLoading = () => setLoading(false);
  const [isFetching, setIsFetching] = useState<boolean | undefined>();
  const { latitude, longitude, error } = useGeolocation();
  const tM = useTranslations('Message');
  const router = useRouter();
  const http = UseAxiosAuth();
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    status: string,
    type: 'success' | 'error'
  ) => {
    api[type]({
      message: `Sites ${status}`,
      placement,
      duration: 2
    });
  };
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const fetchSitesDetails = async (
    http: AxiosInstance,
    siteId?: string,
    form?: FormInstance
    // sitesDetail?: Sites | undefined
    // fileList?: any
  ) => {
    try {
      const responseData = await getSitesService(http, siteId);
      if (responseData.status === STATUS_OK) {
        //  console.log('status ok: ', responseData?.data);
        setSitesDetail(responseData?.data as Sites);

        // console.log('fetchSitesDetails: ', responseData?.data);
        const defaultImagePath: string = 'drafts/d1f1b219-6aa1_638488953544034389.png';
        const ava: string = `${AWS_PATH_GET}${form?.getFieldValue('avatar')}`;
        const avaInit: string = `${AWS_PATH_GET}${defaultImagePath}`;
        console.log('avaInit', avaInit);

        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: form?.getFieldValue('avatar') ? ava : avaInit
          }
        ]);

        form?.setFieldsValue({
          ...responseData?.data
        });
      }
      setIsFetching(false);
    } catch (error) {
      // console.error('Error calling API Staffs:', error);
    }
  };
  React.useEffect(() => {
    fetchSitesDetails(http, siteId, form);
  }, [form, http, siteId, router]);

  const [marker, setMarker] = useState<any>();

  const [events, logEvents] = useState<Record<string, LngLat>>({});
  const onMarkerDragStart = useCallback((event: MarkerDragEvent) => {
    logEvents(_events => ({ ..._events, onDragStart: event.lngLat as LngLat }));
    //  setStateBtnConfirm(false);
  }, []);

  const onMarkerDrag = useCallback((event: MarkerDragEvent) => {
    logEvents(_events => ({ ..._events, onDrag: event.lngLat as LngLat }));

    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat
    });
    // setStateBtnConfirm(false);
  }, []);
  const onMarkerDragEnd = useCallback((event: MarkerDragEvent) => {
    //logEvents(_events => ({ ..._events, onDragEnd: event.lngLat }));
    logEvents(_events => ({
      ..._events,
      onDragEnd: event.lngLat as LngLat
    }));
    setStateBtnConfirm(false);
  }, []);
  const getFile = (e: any) => {
    console.log('Upload event:', e.file);

    if (Array.isArray(e)) {
      return e;
    }
    return e && e.file;
  };
  // logic update + upload file image
  var bearer = 'Bearer ' + session?.user.accessToken;
  const handleForm = async (values: any) => {
    console.log('value form: ', values);
    //let count: number = 0;
    const formData = new FormData();
    // formData.append('file', fileList[0].fileName as FileType);
    // fileList?.forEach(file => {
    //   console.log('value file: ', file);
    // });

    formData?.append('file', fileList[0]?.originFileObj as FileType);
    console.log('formData', formData);

    // You can use any AJAX library you like

    // setIsFetching(true);
    const resUpload = await UploadFileApi(http, formData);
    console.log('resUpload: ', resUpload.data);
    const editValues: any = {
      ...values,
      avatarImg: resUpload.data
    };
    const res = await updateSiteService(http, siteId, editValues);
    if (res.data && res.status === STATUS_OK) {
      setIsFetching(false);
      openNotification('top', `${tM('update_susses')}`, 'success');

      console.log('update site success', res.status);
    } else {
      openNotification('top', `${tM('update_error')}`, 'error');
      console.log('update site fail', res.status);
    }
  };

  const props: UploadProps | UploadProps['onChange'] = {
    // onRemove: file => {
    //   const index = fileList.indexOf(file);
    //   const newFileList = fileList.slice();
    //   newFileList.splice(index, 1);
    //   setFileList(newFileList);
    // },

    onChange: ({ fileList: newFile }) => {
      setFileList(newFile);
    },

    onPreview: async (file: UploadFile) => {
      let src = file.url as string;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as FileType);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    }

    // beforeUpload: file => {
    //   setFileList(()=>{
    //     ...fileList,
    //     file
    //   });

    //   return false;
    // },
  };
  const handleConfirmPosition = async () => {
    const payLoadAddPos: Position[] = [
      { lat: events?.onDragEnd?.lat, long: events?.onDragEnd?.lng }
    ];
    const res = await addPositionService(http, siteId, payLoadAddPos);
    if (res?.status === STATUS_CREATED) {
      console.log('thanh cong');
      message.success('Upload new position successfully.');
      setStateBtnConfirm(true);
      setDisplayMarker(false);
      // router.refresh();

      fetchSitesDetails(http, siteId, form);
    }

    // console.log('res click, ', res);
    // console.log('payLoadAddPos, ', payLoadAddPos);
  };
  //  console.log('fileList out return: ', fileList);

  // console.log('fileList all: ', fileList[0]?.name);
  // const onChange: UploadProps['onChange'] = ({ fileList: newFile }) => {
  //   setFileList(newFile);
  // };

  return (
    <>
      {contextHolder}

      <Content>
        <BreadcrumbArgiFarm
          subPath={SITE_MAP_PATH}
          subPath2='Update'
        />
        <Row>
          <Col
            xs={24}
            lg={14}
          >
            <MapBoxAgriFarm
              onLoaded={handleMapLoading}
              loadingMap={loadingMap}
              latInit={sitesDetail?.positions[0]?.lat || (latitude as number)}
              lngInit={sitesDetail?.positions[0]?.long || (longitude as number)}
              zoom={7}
              style={{ width: '100%', height: 530, margin: '25px 0' }}
              mapStyle={MAP_BOX_SATELLITE}
            >
              {sitesDetail?.positions[0] ? (
                <Marker
                  latitude={sitesDetail?.positions[0]?.lat || 0}
                  longitude={sitesDetail?.positions[0]?.long || 0}
                  anchor='bottom'
                >
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Pin />{' '}
                      <span className='red'>
                        {sitesDetail?.name ? sitesDetail?.name : ''}
                      </span>
                    </div>
                  </>
                </Marker>
              ) : (
                ''
              )}
              <GeocoderControl
                mapboxAccessToken={MAPBOX_TOKEN}
                position='top-right'
                marker={true}
                displayMarker={displayMarker}
                latFromUpdate={sitesDetail?.positions[0]?.lat || 0}
                lngFromUpdate={sitesDetail?.positions[0]?.long || 0}
                onMarkerDragStart={onMarkerDragStart}
                onMarkerDrag={onMarkerDrag}
                onMarkerDragEnd={onMarkerDragEnd}
              />
              <GeolocateControl position='top-left' />
              <FullscreenControl position='top-left' />
              <NavigationControl position='top-left' />
              <ScaleControl />
              <button
                type='submit'
                className={cx('btn-pos', 'primary-btn')}
                hidden={stateBtnConfirm}
                onClick={handleConfirmPosition}
              >
                Confirm New Position
              </button>
            </MapBoxAgriFarm>
            {/* <ControlPanel events={events} /> */}
          </Col>

          <Col
            xs={24}
            lg={10}
            className={cx('mt_auto', 'pad_col')}
          >
            <ConfigProvider
              theme={{
                components: {
                  Form: {
                    itemMarginBottom: 15,
                    verticalLabelPadding: '0 0 0',
                    labelFontSize: 15,
                    labelColor: 'rgb(133, 133, 133)'
                  }
                }
              }}
            >
              <Form
                // labelCol={{ span: 4 }}
                form={form}
                // wrapperCol={{ span: 19 }}
                {...formItemLayoutSite}
                onFinish={handleForm}
                layout='vertical'
              >
                <Form.Item
                  name='avatarImg'
                  label={<TitleLabelFormItem name='Ảnh đại diện'></TitleLabelFormItem>}
                  valuePropName='fileList'
                  getValueFromEvent={getFile}
                >
                  {/* action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188' */}
                  {/* <UploadImgAgri
                    // customRequest={(i: any) => {
                    //   setFileList([i.file]);
                    // }}
                    //  fileList={fileList}
                    onChange={onChange}
                    onPreview={onPreview}
                    beforeUpload={file => {
                      setFileList(file);

                      return false;
                    }}
                  /> */}

                  <ImgCrop
                    rotationSlider
                    // beforeCrop={file => {
                    //   setFileList([...fileList, file]);

                    //   return true;
                    // }}
                  >
                    <Upload
                      {...props}
                      //  action={action}
                      //action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
                      listType='picture-card'
                      maxCount={1}
                      fileList={fileList}
                      // showUploadList={false}
                      //    onChange={onChange}
                      //  onPreview={onPreview}
                      //  customRequest={customRequest}
                    >
                      {/* {fileList.length < 5 && '+ Upload'} */}
                      +Chọn ảnh
                      {/* <Button icon={<UploadOutlined />}>Upload your Image</Button> */}
                    </Upload>
                  </ImgCrop>
                  {/* <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload> */}
                </Form.Item>
                <Form.Item
                  name='siteCode'
                  label={<TitleLabelFormItem name='Mã số nông trại'></TitleLabelFormItem>}
                >
                  <Input
                    disabled
                    size='large'
                  />
                </Form.Item>

                <Form.Item
                  name='name'
                  label={<TitleLabelFormItem name='Tên nông trại'></TitleLabelFormItem>}
                >
                  <Input size='large' />
                </Form.Item>
                <Form.Item
                  name='description'
                  label={<TitleLabelFormItem name='Mô tả'></TitleLabelFormItem>}
                >
                  <Input size='large' />
                </Form.Item>

                <Form.Item className={cx('mt-30', 'd-flex', 'jus-center')}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    loading={isFetching}
                    size='middle'
                  >
                    Lưu thay đổi
                  </Button>
                </Form.Item>
              </Form>
            </ConfigProvider>
          </Col>
        </Row>
      </Content>
    </>
  );
};

export default UpdateSitePageForUser;
