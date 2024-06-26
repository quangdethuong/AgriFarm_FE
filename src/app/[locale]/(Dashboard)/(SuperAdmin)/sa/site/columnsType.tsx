import {
  Dropdown,
  MenuProps,
  Modal,
  Image,
  Space,
  Button,
  Tag,
  TableColumnsType
} from 'antd';
import {
  CheckOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import { Sites } from '@/services/SuperAdmin/Site/payload/response/sites';
import { AWS_PATH_GET } from '@/constants/routes';

export const sitesTableColumns: TableColumnsType<Sites> = [
  // {
  //   title: 'ID',
  //   dataIndex: 'id',
  //   width: 'max-content',
  //   fixed: 'left'
  // },
  {
    title: 'Mã số',
    dataIndex: 'siteCode',

    width: 'max-content',
    fixed: 'left'
  },

  {
    title: 'Tên nông trại',
    dataIndex: 'name',
    width: 'max-content'
  },
  {
    title: 'Ảnh',
    dataIndex: 'avatar',
    render: (_, item) => {
      return (
        <>
          <Image
            alt='avatar'
            // style={{ borderRadius: '10%' }}
            height={40}
            src={
              item?.avatar
                ? `${AWS_PATH_GET}` + item?.avatar
                : `${AWS_PATH_GET}drafts/d1f1b219-6aa1_638488953544034389.png`
            }
          />
        </>
      );
    },
    align: 'center',
    width: 'max-content'
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    width: 'max-content'
  },
  {
    title: 'Trạng thái',
    dataIndex: 'isLockout',

    // filterMode: 'tree',
    // onFilter: (value: boolean, record)=> record.is_active.,
    render: (_, { isActive }) => {
      let color = isActive == true ? 'green' : 'red';
      let key = isActive == false ? 'Vô hiệu hóa' : 'Hoạt động';
      return (
        <Tag
          color={color}
          key={key}
        >
          {key}
        </Tag>
      );
    },
    width: 'max-content'
  },
  {
    width: 'max-content',
    title: '',
    key: 'actions',
    fixed: 'right',
    align: 'right' as const,
    render: (_, sitesItem) => {
      const renderItems = (id: string, onDetailsUser: () => void): MenuProps['items'] => {
        return [
          {
            label: (
              <a
                onClick={() => {
                  Modal.confirm({
                    title: 'Bạn có muốn vô hiệu hóa nông trại này?',
                    centered: true,
                    width: '400px',
                    onOk: () => {
                      onDetailsUser();
                    },
                    okText: 'Có',
                    cancelText: 'Hủy',
                    footer: (_, { OkBtn, CancelBtn }) => (
                      <>
                        <CancelBtn />
                        <OkBtn />
                      </>
                    )
                  });
                }}
              >
                <Space>
                  <CheckOutlined /> Vô hiệu hóa
                </Space>
              </a>
            ),
            key: '0'
          }
        ];
      };
      return (
        <Dropdown
          menu={{
            items: renderItems(sitesItem.id!, sitesItem.onDetails!)
          }}
        >
          <a onClick={e => e.preventDefault()}>
            <Space>
              <Button
                type='text'
                icon={<EllipsisOutlined />}
              ></Button>
            </Space>
          </a>
        </Dropdown>
      );
    }
  }
];
