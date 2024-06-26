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
  WarningOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

import { useTranslations } from 'next-intl';
import { Seed } from '../../models/seed-models';

 export function SeedTableColumns() {
  const t = useTranslations('Common');
  const s = useTranslations('Seed');



  const seedTableColumn: TableColumnsType<Seed> = [
    {
      title: t('Name'),
      dataIndex: 'name',
      width: 'max-content',
    },
    {
      title: t('Stock'),
      align: 'end',
      dataIndex: 'stock',
      width: 'max-content',
      render: (_,seedItem) => `${seedItem.stock} ${seedItem.measureUnit}`
    },
    {
        title: t('Unit_Price'),
        align: 'end',
        dataIndex: 'unitPrice',
        width: 'max-content',
        render: (_,seedItem) => `${seedItem.unitPrice.toLocaleString()} VND`
      },
    {
      width: 'max-content',
      title: '',
      key: 'actions',
      fixed: 'right',
      align: 'right' as const,
      render: (_, seedItem) => {
        const renderItems = (
          id: string,
          onDetailsSeed: () => void,
          onViewHistory: () => void,
          onRemoveSeed: () => void,
        ): MenuProps['items'] => {
          return [
            {
              label: (
                <a
                  onClick={() => {
                    onDetailsSeed();
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
                    onViewHistory();
                  } }
                >
                  <Space>
                    <ClockCircleOutlined /> {t('View_history')}
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
                      title: s('Do_you_want_to_delete_this_seeds'),
                      centered: true,
                      width: '40%',
                      icon: <WarningOutlined style={{ color: 'red' }} />,
                      closable: true,
                      cancelText: t('Cancel'),
                      okText: t('Yes'),
                      okButtonProps: { type: 'primary', danger: true },
                      onOk: () => {
                        onRemoveSeed();
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
              key: '1'
            }
          ];
        };
        return (
          <Dropdown
            menu={{
              items: renderItems(
                seedItem.id!,
                seedItem.onDetails!,
                seedItem.onViewHistory!,
                seedItem.onDelete!
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
  return seedTableColumn;
}
