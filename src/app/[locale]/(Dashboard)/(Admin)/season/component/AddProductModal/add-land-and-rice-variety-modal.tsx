'use client';
/* eslint-disable react-hooks/rules-of-hooks */
import ModalCustom from '@/components/ModalCustom/ModalCustom';
import { LandColumn } from './land-table-column';
import { Land, LandProd, RiceVariety, SeedPro } from '../../models/season-model';
import React, { useEffect, useState } from 'react';
import fetchListLandData from '@/services/Admin/Land/getLandsApi';
import { ConfigProvider, Form, Input, Modal, Table, notification } from 'antd';
import { RiceVarietyColumns } from './rice-variety-table-column';
import classNames from 'classnames';
import styles from '../../../../(SuperAdmin)/sa/management-page.module.scss';
import { SearchProps } from 'antd/es/input/Search';
import { useSession } from 'next-auth/react';
import { AxiosInstance } from 'axios';
import UseAxiosAuth from '@/utils/axiosClient';
import {
  CreateProductDto,
  createProductApi
} from '@/services/Admin/Product/postProductApi';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import {
  ProductProvider,
  useProductContext
} from '@/services/Admin/Product/serviceProductsData';
import { STATUS_CREATED } from '@/constants/https';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setProductsAction } from '@/redux/features/season-slice';
import { useSelector } from 'react-redux';
import getSeedsApi from '@/services/Admin/Seed/getSeedsApi';
import { Seed } from '../../../seed/models/seed-models';

// interface Properties {

// }

const AddProductSeason = ({
  params
}: {
  params: {
    seasonId: string | undefined;
    visible: boolean;
    onCancel: () => void;
    isUpdate: boolean;
  };
}) => {
  const { data: session } = useSession();
  const siteId = session?.user.userInfo.siteId;
  const http = UseAxiosAuth();
  const tM = useTranslations('Message');
  const t = useTranslations('Common');
  const tSeason = useTranslations('Season');

  const dispatch = useAppDispatch();

  // Get land list data
  const [lands, setLands] = useState<Land[]>([]);
  const [loadingLandData, setLoadingLandData] = useState(true);

  const getLandData = async (http: AxiosInstance, siteId?: string) => {
    try {
      const res = await fetchListLandData(siteId, http);
      setLands(res.data as Land[]);
      setLoadingLandData(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLandData(http, siteId);
  }, [http, siteId]);
  // Done get land list data

  // Get rice variety list data
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loadingSeedData, setLoadingSeedData] = useState(true);
  useEffect(() => {
    getRiceVarietyData(http, siteId);
  }, [http, siteId]);

  const getRiceVarietyData = async (http: AxiosInstance, siteId?: string) => {
    try {
      const res = await getSeedsApi(siteId, http);
      setSeeds(res.data as Seed[]);
      setLoadingSeedData(false);
    } catch (error) {
      console.log(error);
    }
  };
  // Done get rice variety list data

  //handle modal
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    params.visible = false;
  };
  const handleOk = () => {
    params.visible = false;
  };

  //  handle search
  const cx = classNames.bind(styles);
  const { Search } = Input;
  const onSearchLand: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  const onSearchRiceVariety: SearchProps['onSearch'] = (value, _e, info) =>
    console.log(info?.source, value);

  //list products of season
  const [products, setProducts] = useState<CreateProductDto[] | undefined>([]);
  const [selectedLands, setSelectedLands] = useState<LandProd[] | undefined>();
  const [selectedSeed, setSelectedSeed] = useState<SeedPro | null>();

  const productGlobal = useAppSelector(state => state.productsReducer.productGlobal);

  //handle row selection
  const landRowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: LandProd[]) => {
      setSelectedLands(selectedRows);
    }
  };

  const seedRowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: SeedPro[]) => {
      selectedRows.forEach(function (value) {
        setSelectedSeed(value);
      });
    }
  };

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

  //Handle OK action

  const onHandleOK = () => {
    setProducts([]);
    selectedLands?.forEach(function (value) {
      products?.push({
        land: {
          id: value?.id,
          name: value?.name
        },
        seed: {
          id: selectedSeed?.id,
          name: selectedSeed?.name
        }
      });
    });
    dispatch(setProductsAction(products));
    console.log('Product current: ', productGlobal);
    if (params.isUpdate) {
      try {
        products?.map(async (item, idx) => {
          const res = await createProductApi(http, params.seasonId, item);
          if (res?.data || res?.status === STATUS_CREATED) {
            params.onCancel();
            console.log('update staff success', res.status);
          } else {
            openNotification('top', `${tM('update_error')}`, 'error');
            params.onCancel();
            console.log('update staff fail', res.status);
          }
        });
        openNotification('top', `${tM('update_susses')}`, 'success');
      } catch (error) {
        console.error('Error occurred while updating season:', error);
      }
    } else {
      params.onCancel();
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
          title={tSeason('Add_new_product')}
          open={params.visible}
          onCancel={params.onCancel}
          onOk={onHandleOK}
          okText={t('Add')}
          cancelText={t('Cancel')}
          centered={true}
          width={'fit-content'}
        >
          <Search
            placeholder={t('Input_search_text')}
            onSearch={onSearchRiceVariety}
            style={{ width: '50%', marginBottom: '1rem' }}
            enterButton
            className={cx('search-btn-box')}
          />
          <Table
            dataSource={seeds}
            columns={RiceVarietyColumns()}
            loading={loadingSeedData}
            rowSelection={{
              type: 'radio',
              ...seedRowSelection
            }}
            pagination={{
              defaultPageSize: 5,
              pageSize: 5
            }}
            rowKey='id'
            style={{ width: '100%' }}
          ></Table>
          <br />
          <Search
            placeholder={t('Input_search_text')}
            onSearch={onSearchRiceVariety}
            style={{ width: '50%', marginBottom: '1rem' }}
            enterButton
            className={cx('search-btn-box')}
          />
          <Table
            dataSource={lands}
            columns={LandColumn()}
            loading={loadingLandData}
            rowSelection={{
              type: 'checkbox',
              ...landRowSelection
            }}
            pagination={{
              defaultPageSize: 5,
              pageSize: 5
            }}
            rowKey='id'
            style={{ width: '100%' }}
          ></Table>
        </Modal>
      </ConfigProvider>
    </>
  );
};
export default AddProductSeason;
