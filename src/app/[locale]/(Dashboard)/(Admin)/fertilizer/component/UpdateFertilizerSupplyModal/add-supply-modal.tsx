/* eslint-disable react-hooks/exhaustive-deps */
import UseAxiosAuth from '@/utils/axiosClient';
import {
  Button,
  ConfigProvider,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  SelectProps,
  Typography,
  notification
} from 'antd';
import {
  BorderlessTableOutlined,
  CloseOutlined,
  DownCircleOutlined,
  FormOutlined,
  FileOutlined,
  BarsOutlined
} from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { SupplierResponse } from '../../../(supply)/models/supplier-models';
import getSuppliersApi from '@/services/Admin/Supply/getSuppliersApi';
import { AxiosInstance } from 'axios';
import stylesFertilizerManagement from '../../fertilizerStyle.module.scss';
import classNames from 'classnames/bind';
import getSupplierDetailApi from '@/services/Admin/Supply/getSupplierDetails';
import { CreateSupplierMapper } from '../../models/fertilizer-models';
import { createSupplyInfoApi } from '@/services/Admin/Fertilizer/createSuppyInfoApi';

const AddFertilizerSupplyModal = ({
  params
}: {
  params: {
    fertilizerId: string | undefined;
    visible: boolean;
    onCancel: () => void;
  };
}) => {
  const styleFertilizerManagement = classNames.bind(stylesFertilizerManagement);

  const { data: session } = useSession();
  const siteId = session?.user.userInfo.siteId;
  const http = UseAxiosAuth();
  const tM = useTranslations('Message');
  const t = useTranslations('Common');
  const f = useTranslations('Fertilizer');
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
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

  const initialFormValues = {
    quantity: 0,
    unitPrice: 0,
    measureUnit: 'kg',
    content: '',
    supplierId: '', // Default value for supplierId field
    supplierName: '',
    address: '',
  };

  //Set selection supplier
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');

  const onSelectSupplier = async (value: string) => {
    setSelectedSupplierId(value);
    try {
      await getSupplierDetailApi(value, http).then(res => {
        let selected = res?.data as SupplierResponse
        form.setFieldValue('supplierName', selected?.name);
        form.setFieldValue('address', selected?.address);
      });
    } catch (error) {
      console.error('Error occurred while get details supplier:', error);
    }
  };

  useEffect(() => {
    getListSupplier(http);
  }, [http]);

  //get list suppliers
  const getListSupplier = async (http: AxiosInstance) => {
    try {
      await getSuppliersApi(http).then(res => {
        console.log('supplier: ', res?.data);
        setSupplierOptions(res?.data as SupplierResponse[]);
      });
    } catch (error) {
      console.error('Error occurred while get list supplier:', error);
    }
  };

  const setSupplierOptions = (suppliers: SupplierResponse[] | undefined) => {
    const updatedOptions: SelectProps['options'] = [];
    suppliers?.map((item, idx) => {
      updatedOptions?.push({
        value: item.id,
        label: item.name
      });
    });
    setOptions(updatedOptions);
    console.log('Options: ', options);
  };

  const onSubmit = async (value: CreateSupplierMapper) => {
    try {
      await createSupplyInfoApi(params.fertilizerId, http, {
        quantity: value.quantity,
        unitPrice: value.unitPrice,
        measureUnit: value.measureUnit,
        content: value.content,
        supplier: {
          id: value.supplierId,
          name: value.supplierName,
          address: value.address
        }
      }).then(resSupplier => {
        if (resSupplier.data) {
          openNotification('top', t('Create_successfully'), 'success');
          console.log('create staff success', resSupplier.status);
          form.resetFields();
        } else {
          openNotification('top', t('Create_fail'), 'error');
          console.log('create staff fail', resSupplier.status);
        }
      });
      params.onCancel();
    } catch (error) {
      console.error('Error occurred while updating season:', error);
    }
  };

  return (
    <>
      {contextHolder}
      <ConfigProvider
        theme={{
          components: {
            Table: {
              cellPaddingBlock: 8,
              headerSortHoverBg: '#F2F3F5',
              borderColor: '#F2F3F5',
              headerBg: '#F2F3F5',
              rowHoverBg: '#F2F3F5'
            }
          }
        }}
      >
        <Modal
          title={f('Add_more_fertilizer')}
          open={params.visible}
          onCancel={params.onCancel}
          cancelText={t('Cancel')}
          centered={true}
          width={'50%'}
          footer={null}
          className= {styleFertilizerManagement('add-supply-modal')}
        >
          <Form
            form={form}
            colon={false}
            onFinish={onSubmit}
            layout={'horizontal'}
            labelCol={{ span: 10 }}
            labelWrap
            wrapperCol={{ span: 18 }}
            initialValues={initialFormValues}
          >
            <Form.Item
              name='quantity'
              style={{
                maxWidth: '100%',
                margin: '0px 0px 8px 0px',
                padding: '0px 0px'
              }}
              label={
                <>
                  <BorderlessTableOutlined style={{ marginRight: '0.5rem' }} /> {t('Quantity')} 
                </>
              }
            >
              <InputNumber placeholder={t('Quantity')} />
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
              <InputNumber placeholder={t('Unit_Price')} />
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
              size='middle'
              placeholder= {t('Select_value')}
                options={[
                  {
                    value: 'kg',
                    label: 'kg'
                  }
                ]}
              ></Select>
            </Form.Item>
            <Form.Item
              name='content'
              style={{
                maxWidth: '100%',
                margin: '0px 0px 8px 0px',
                padding: '0px 0px'
              }}
              label={
                <>
                  <FormOutlined style={{ marginRight: '0.5rem' }} /> {t('Content')} 
                </>
              }
            >
              <TextArea
              autoSize={{ minRows: 1, maxRows: 6 }}
              placeholder={t('Type_data')}
            />
            </Form.Item>
            <Form.Item
              name='supplierId'
              style={{
                maxWidth: '100%',
                margin: '0px 0px 8px 0px',
                padding: '0px 0px'
              }}
              label={
                <>
                  <DownCircleOutlined style={{ marginRight: '0.5rem' }} /> {t('Supplier')} 
                </>
              }
            >
              <Select
              onChange={onSelectSupplier}
              showSearch
              optionFilterProp='label'
              filterOption={(input, option) =>
                (option?.label?.toString().toLowerCase() ?? '').includes(
                  input.toLowerCase()
                )
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label?.toString() ?? '')
                  .toLowerCase()
                  .localeCompare(
                    (optionB?.label?.toString().toLowerCase() ?? '').toLowerCase()
                  )
              }
              placeholder= {t('Select_value')}
              optionLabelProp='label'
              options={options}
              value={selectedSupplierId}
              size={'middle'}
            ></Select>
            </Form.Item>
            <Form.Item
              name='supplierName'
              style={{
                maxWidth: '100%',
                margin: '0px 0px 8px 0px',
                padding: '0px 0px'
              }}
              label={
                <>
                  <FormOutlined style={{ marginRight: '0.5rem' }} /> {t('Supplier_Name')} 
                </>
              }
            >
              <Input placeholder={t('Type_data')} />
            </Form.Item>
            <Form.Item
              name='address'
              style={{
                maxWidth: '100%',
                margin: '0px 0px 8px 0px',
                padding: '0px 0px'
              }}
              label={
                <>
                  <FormOutlined style={{ marginRight: '0.5rem' }} /> {t('Address')} 
                </>
              }
            >
              <Input placeholder={t('Type_data')} />
            </Form.Item>
            <Flex
            style={{ width: '100%' }}
            justify='end'
          >
            <Button
              htmlType='submit'
              type='primary'
              icon={<FileOutlined />}
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
                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item> */}
          </Form>
        </Modal>
      </ConfigProvider>
    </>
  );
};
export default AddFertilizerSupplyModal;