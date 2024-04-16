'use client'
import {
  TableColumnsType,
  Dropdown,
  MenuProps,
  Modal,
  Space,
  Button,
} from 'antd';
import {
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';

import { useTranslations } from 'next-intl';
import { DocumentResponse } from '../models/document-models';
import Link from 'next/link';
import dayjs from 'dayjs';


 export function DocumentTableColumns() {
  const t = useTranslations('Common');
  const dateFormat = 'DD/MM/YYYY';


  const documentTableColumn: TableColumnsType<DocumentResponse> = [
    {
      title: '#',
      dataIndex: 'index',
      width: 'max-content',
      render: (_, item, idx) => `${idx + 1}`
    },
    {
      title: t('Name'),
      dataIndex: 'title',
      width: 'max-content',
    },
    {
      title: 'Link File',
      dataIndex: 'fileLink',
      width: 'max-content',
      render: (_, item) => {
        return <Link download href={'http://ec2-3-109-154-96.ap-south-1.compute.amazonaws.com/api/v1/files/get?path='+item.url}>{item.url}</Link>;
      }
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'createdDate',
        width: 'max-content',
        render: (_, documentItem) => `${dayjs(documentItem.createdDate).format(dateFormat)}`
      },
    {
      width: 'max-content',
      title: '',
      key: 'actions',
      fixed: 'right',
      align: 'right' as const,
      render: (_, documentItem) => {
        const renderItems = (
          id: string,
          onDetailsDocument: () => void,
          onRemoveDocument: () => void,
          onDownloadDocument: () => void,
        ): MenuProps['items'] => {
          return [
            {
              label: (
                <a
                  onClick={() => {
                    onDetailsDocument();
                  } }
                >
                  <Space>
                    <ExclamationCircleOutlined /> {t('Details')}
                  </Space>
                </a>
              ),
              key: '0'
            },
            {
              label: (
                <a
                  onClick={() => {
                    onDownloadDocument();
                  } }
                >
                  <Space>
                    <ExclamationCircleOutlined /> Tải xuống
                  </Space>
                </a>
              ),
              key: '1'
            },
            {
              type: 'divider'
            },
            {
              label: (
                <a
                  onClick={() => {
                    Modal.confirm({
                      title:'Do you want to delete this Documents',
                      centered: true,
                      width: '40%',
                      icon: <WarningOutlined style={{ color: 'red' }} />,
                      closable: true,
                      cancelText: t('Cancel'),
                      okText: t('Yes'),
                      okButtonProps: { type: 'primary', danger: true },
                      onOk: () => {
                        onRemoveDocument();
                      },
                      footer: (_, { OkBtn, CancelBtn }) => (
                        <>
                          <CancelBtn />
                          <OkBtn />
                        </>
                      )
                    });
                  } }
                >
                  <Space>
                    <DeleteOutlined /> {t('Delete')}
                  </Space>
                </a>
              ),
              key: '2'
            }
          ];
        };
        return (
          <Dropdown
            menu={{
              items: renderItems(
                documentItem.id!,
                documentItem.onDetails!,
                documentItem.onDownload!,
                documentItem.onDelete!
              )
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
  return documentTableColumn;
}
