/* eslint-disable jsx-a11y/alt-text */
import UseAxiosAuth from '@/utils/axiosClient';
import {
  Form,
  FormInstance,
  Input,
  InputNumber,
  Spin,
  Space,
  Button,
  Typography,
  notification,
  Tooltip,
  Select,
  Flex,
  Image
} from 'antd';
import {
  BorderlessTableOutlined,
  CloseOutlined,
  DownCircleOutlined,
  FormOutlined,
  FileOutlined,
  BarsOutlined,
  PlusOutlined,
  HomeOutlined
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { constants } from 'buffer';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Axios, AxiosInstance } from 'axios';
import { STATUS_OK } from '@/constants/https';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { SegmentedLabeledOption } from 'antd/es/segmented';
import classNames from 'classnames/bind';
import styles from '../../../adminStyle.module.scss';
import { Fertilizer } from '../../models/fertilizer-models';
import getFertilizerDetailApi from '@/services/Admin/Fertilizer/getFertilizerDetailApi';
import {
  updateFertilizerApi,
  updateFertilizerPropertyApi
} from '@/services/Admin/Fertilizer/updateFertilizerApi';
import AddFertilizerSupplyModal from '../UpdateFertilizerSupplyModal/add-supply-modal';

const UpdateFertilizerFormDrawer = ({
  params
}: {
  params: {
    fertilizerId: string;
  };
}) => {
  const cx = classNames.bind(styles);

  const t = useTranslations('Common');
  const f = useTranslations('Fertilizer');
  const tM = useTranslations('Message');

  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [componentDisabled, setComponentDisabled] = useState<boolean>(true);
  const [formInfoCommon] = Form.useForm();
  const http = UseAxiosAuth();
  const [fertilizerDetail, setFertilizerDetail] = useState<Fertilizer>();

  const getFertilizerDetailData = async (
    http: AxiosInstance,
    fertilizerId?: string,
    formInfoCommon?: FormInstance
  ) => {
    try {
      const responseData = await getFertilizerDetailApi(fertilizerId, http);
      if (responseData?.status === STATUS_OK) {
        setFertilizerDetail(responseData?.data as Fertilizer);
        console.log('Data', fertilizerDetail);
        formInfoCommon?.setFieldsValue({
          ...responseData?.data
        });
        console.log(formInfoCommon?.getFieldsValue);
      }
      setIsFetching(false);
    } catch (error) {
      console.log('Error: :  ', error);
    }
  };

  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    status: string,
    type: 'success' | 'error'
  ) => {
    api[type]({
      message: `Admin ${status}`,
      placement,
      duration: 2
    });
  };

  const onFinish = async (props: Fertilizer) => {
    console.log(props);
    setIsFetching(true);
    try {
      await updateFertilizerApi(params.fertilizerId, http, {
        name: props.name,
        description: props.description,
        notes: props.notes
      }).then(async res => {
        await updateFertilizerPropertyApi(params.fertilizerId, http, props.properties)
          .then(resProps => {
            if (resProps.data && res.data) {
              openNotification('top', `${tM('update_susses')}`, 'success');
              setIsFetching(false);
              console.log('update staff success', resProps.status);
            } else {
              openNotification('top', `${tM('update_error')}`, 'error');
              setIsFetching(false);
              console.log('update staff fail', resProps.status);
            }
          })
          .finally(() => {});
      });
    } catch (error) {
      console.log('Error: :  ', error);
    }
  };

  //handle update supply
  const [showAddSupply, setShowAddSupply] = useState(false);
  const showAddSupplyModal = () => {
    setShowAddSupply(true);
  };

  useEffect(() => {
    getFertilizerDetailData(http, params.fertilizerId, formInfoCommon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [http, params.fertilizerId, formInfoCommon, showAddSupply]);

  return (
    <>
      {contextHolder}
      <Spin spinning={isFetching}>
        <Tooltip title='Nhập thêm phân bón'>
          <Button
            size='middle'
            className={cx('bg-btn')}
            icon={<PlusOutlined />}
            onClick={showAddSupplyModal}
          >
            Nhập thêm phân bón
          </Button>
        </Tooltip>
        <AddFertilizerSupplyModal
          params={{
            fertilizerId: params.fertilizerId,
            visible: showAddSupply,
            onCancel: () => {
              setShowAddSupply(false);
            }
          }}
        ></AddFertilizerSupplyModal>
        <Form
          disabled={!componentDisabled}
          form={formInfoCommon}
          colon={false}
          layout={'horizontal'}
          labelCol={{ span: 10 }}
          labelWrap
          wrapperCol={{ span: 18 }}
          onFinish={onFinish}
          style={{ paddingTop: '1rem' }}
          size='middle'
        >
          <Flex
            gap={16}
            style={{ width: '100%' }}
          >
            <Flex
              vertical
              style={{ width: '70%' }}
            >
              <Form.Item
                name='name'
                style={{
                  maxWidth: '100%',
                  margin: '0px 0px 8px 0px',
                  padding: '0px 0px'
                }}
                label={
                  <>
                    <FormOutlined style={{ marginRight: '0.5rem' }} /> {t('Name')}
                  </>
                }
              >
                <Input placeholder={t('Type_data')} />
              </Form.Item>
              <Form.Item
                name='stock'
                style={{
                  maxWidth: '100%',
                  margin: '0px 0px 8px 0px',
                  padding: '0px 0px'
                }}
                label={
                  <>
                    <HomeOutlined style={{ marginRight: '0.5rem' }} /> {t('Stock')}
                  </>
                }
              >
                <InputNumber
                  className='stock-input'
                  addonAfter='kg'
                ></InputNumber>
              </Form.Item>

              <Form.Item
                name='measureUnit'
                style={{
                  maxWidth: '100%',
                  margin: '0px 0px 8px 0px',
                  padding: '0px 0px'
                }}
                label={
                  <>
                    <DownCircleOutlined style={{ marginRight: '0.5rem' }} /> {t('Measure_Unit')}
                  </>
                }
              >
                <Select
                  size={'middle'}
                  options={[
                    {
                      value: 'kg',
                      label: 'kg'
                    }
                  ]}
                  placeholder={t('Select_value')}
                ></Select>
              </Form.Item>
              <Form.Item
            name='unitPrice'
            style={{
              maxWidth: '100%',
              margin: '0px 0px 8px 0px',
              padding: '0px 0px'
            }}
            label={
              <>
                <BorderlessTableOutlined style={{ marginRight: '0.5rem' }} /> {t('Unit_Price')}
              </>
            }
          >
            <InputNumber addonAfter='VND'></InputNumber>
          </Form.Item>
            </Flex>
            <Flex style={{ width: '30%' }}>
            <Image
              style={{ borderRadius: '10px' }}
              src={fertilizerDetail?.notes ? 'http://ec2-3-109-154-96.ap-south-1.compute.amazonaws.com/api/v1/files/get?path='+ fertilizerDetail?.notes : 'http://ec2-3-109-154-96.ap-south-1.compute.amazonaws.com/api/v1/files/get?path=drafts/d1f1b219-6aa1_638488953544034389.png'}
            />
            </Flex>
            
          </Flex>

          <Form.Item
            name='description'
            style={{
              maxWidth: '100%',
              margin: '0px 0px 8px 0px',
              padding: '0px 0px'
            }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 19 }}
            label={
              <>
                <FormOutlined style={{ marginRight: '0.5rem' }} /> {t('Description')}{' '}
              </>
            }
          >
            <TextArea
              autoSize={{ minRows: 1, maxRows: 6 }}
              placeholder={t('Type_data')}
            />
          </Form.Item>
          <Form.Item
            hidden
            name='notes'
            style={{
              maxWidth: '100%',
              margin: '0px 0px 8px 0px',
              padding: '0px 0px'
            }}
            labelCol={{ span: 7 }}
            wrapperCol={{ span: 19 }}
            label={
              <>
                <FormOutlined style={{ marginRight: '0.5rem' }} /> {t('Notes')}
              </>
            }
          >
            <TextArea
              autoSize={{ minRows: 1, maxRows: 6 }}
              placeholder={t('Type_data')}
            />
          </Form.Item>

          
          <Flex
            gap={'0.5rem'}
            vertical
            style={{ paddingBottom: '1rem' }}
          >
            <label>
              <BarsOutlined style={{ marginRight: '0.5rem' }} />
              {t('Properties')}
            </label>
            <Form.List name='properties'>
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(field => (
                    <Space
                      key={field.key}
                      style={{ display: 'flex', marginBottom: '4px' }}
                      align='baseline'
                      title={t('Properties')}
                    >
                      <Form.Item name={[field.name, 'name']}>
                        <Input placeholder={t('Name')} />
                      </Form.Item>
                      <Form.Item name={[field.name, 'value']}>
                        <InputNumber placeholder={t('Value')} />
                      </Form.Item>
                      <Form.Item name={[field.name, 'unit']}>
                        <Input placeholder={t('Unit')} />
                      </Form.Item>
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    </Space>
                  ))}
                  <Button
                    size='middle'
                    type='dashed'
                    onClick={() => add()}
                    block
                  >
                    {t('add_new_property')}
                  </Button>
                </div>
              )}
            </Form.List>
          </Flex>
          <Flex
            style={{ width: '100%' }}
            justify='end'
          >
            <Button
              htmlType='submit'
              type='primary'
              loading={isFetching}
              icon={<FileOutlined />}
              className='bg-btn'
            >
              {t('Save')}
            </Button>
          </Flex>
          {/* <Form.Item
            noStyle
            shouldUpdate
          >
            {() => (
              <Typography>
                <pre>{JSON.stringify(formInfoCommon.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item> */}
        </Form>
      </Spin>
    </>
  );
};
export default UpdateFertilizerFormDrawer;
