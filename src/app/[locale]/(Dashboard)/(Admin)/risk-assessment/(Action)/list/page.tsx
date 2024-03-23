'use client'
import { Content } from "antd/es/layout/layout";
import styles from "../../components/risk-assessment-style.module.scss";
import classNames from 'classnames/bind';
import { useTranslations } from "next-intl";
import { App, Button, Dropdown, Form, Input, MenuProps, Radio, RadioChangeEvent, Space, Tag, message } from "antd";
import { useEffect, useState } from "react";
import UseAxiosAuth from "@/utils/axiosClient";
import { AxiosInstance } from "axios";
import { RiskMasterListDef, SearchConditionDef } from "../../interface";
import riskAssessmentListMasterApi from "@/services/RiskAssessment/riskAssessmentListMasterApi";
import Table, { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";
import {
  DeleteOutlined,
  EllipsisOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  WarningOutlined,
  PushpinTwoTone,
  DeleteTwoTone,
  PlusOutlined
} from '@ant-design/icons';
import { useRouter } from "next/navigation";
import riskAssessmentDeleteApi from "@/services/RiskAssessment/riskAssessmentDeleteApi";
import { STATUS_OK } from "@/constants/https";

interface ColoredLineProps {
    text: string;
}

interface TableParams {
    pagination?: TablePaginationConfig;
}

const List = () => {
    const tCom = useTranslations('common');
    const tLbl = useTranslations('Services.RiskAsm.label');
    const tMsg = useTranslations('Services.RiskAsm.message');
    const cx = classNames.bind(styles);
    const [keyword, setKeyword] = useState<string>("");
    const [isDraft, setIsDraft] = useState<boolean>();
    const http = UseAxiosAuth();
    const [data, setData] = useState<RiskMasterListDef[]>();
    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState<TableParams>({
      pagination: {
        current: 1,
        pageSize: 10,
      },
    });
    const router = useRouter();
    const { modal , message } = App.useApp();

    useEffect(() => {
        const getData = async (http: AxiosInstance | null) => {
            try {
                setLoading(true);
                const searchCondition: SearchConditionDef = {
                    perPage: 10,
                    pageId: 1
                };
                const responseData = await riskAssessmentListMasterApi(http, searchCondition);
                const normalizedData: RiskMasterListDef[] = responseData['data'].map(
                    (item: RiskMasterListDef, index: number) => ({
                        key : item.id,
                        no: index + 1,
                        riskName: item.riskName,
                        riskDescription: item.riskDescription,
                        isDraft: item.isDraft,
                        createdDate: item.createdDate
                    })
                );
                setData(normalizedData);
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
    }, [http]);

    const ColoredLine: React.FC<ColoredLineProps> = ({ text }) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={cx('risk__line')} style={{flex: 1}}/>
            <span style={{ marginLeft: 5, marginRight: 5}}>{text}</span>
            <div className={cx('risk__line')} style={{flex: 12}}/>
        </div>
    );

    const buttonItemLayout = {
        wrapperCol: { span: 8, offset: 8 },
    };
    const handleKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
    }
    const handleOnchecked = (e: RadioChangeEvent) => {
        // console.log('checked = ', checkedValues);
        if (e.target.value != "all") {
            setIsDraft(e.target.value);
        } else {
            setIsDraft(undefined);
        }
    };
    const searchAction = async (pagination: TablePaginationConfig) => {
        const searchCondition: SearchConditionDef = {
            keyword: keyword,
            isDraft: isDraft,
            perPage: pagination?.pageSize,
            pageId: pagination?.current
        };
        try {
            setLoading(true);
            const responseData = await riskAssessmentListMasterApi(http, searchCondition);
            const normalizedData: RiskMasterListDef[] = responseData['data'].map(
                (item: RiskMasterListDef, index: number) => ({
                    key : item.id,
                    no: index + 1,
                    riskName: item.riskName,
                    riskDescription: item.riskDescription,
                    isDraft: item.isDraft,
                    createdDate: item.createdDate
                })
            );
            setData(normalizedData);
            setTableParams({
                ...pagination,
                pagination: {
                  ...pagination,
                  total: responseData.pagination.totalRecord,
                },
              });
        } catch (error) {
            console.error('Error calling API:', error);
        } finally {
            setLoading(false);
        }
    }
    const handleDeleteAction = async (riskId: string) => {
        console.log("Delete action.....");
        try {
            setLoading(true);
            const responseData = await riskAssessmentDeleteApi(http, riskId);
            if (responseData.statusCode == STATUS_OK) {
                searchAction(tableParams.pagination!);
                message.success(tMsg('msg_delete_success'));
            } else {
                message.error(tMsg('msg_delete_fail'));
            }
        } catch (error) {
            console.error(error);
            message.error(tMsg('msg_delete_fail'));
        } finally {
            setLoading(false);
        }
    }
    const columns: ColumnsType<RiskMasterListDef> = [
        {
            title: '#',
            dataIndex: 'no',
            width: '5%',
        },
        {
            title: 'Risk Name',
            dataIndex: 'riskName',
            width: '20%',
        },
        {
            title: 'Risk Description',
            dataIndex: 'riskDescription',
        },
        {
            title: 'Is Draft',
            dataIndex: 'isDraft',
            width: '10%',
            render: (_,riskMaster) => {
                if (!riskMaster.isDraft) {
                    return (<Tag icon={<PushpinTwoTone />} color="success">{tLbl('publish')}</Tag>)
                } else {
                    return (<Tag icon={<DeleteTwoTone  style={{color: '#E53835'}}/>} color="success">{tLbl('draft')}</Tag>)
                }
            }
        },
        {
            title: 'Created Date',
            dataIndex: 'createdDate',
            width: '20%',
        },
        {
            title: '',
            dataIndex: 'action',
            width: '5%',
            render: (_,riskMaster) => {
                const renderItems = (
                    id: string,
                    riskName: string
                ): MenuProps['items'] => {
                    return [
                        {
                            label: (
                                <a
                                    onClick={() => {
                                        router.push(`/risk-assessment/detail?id=${id}`);
                                    }}
                                >
                                    <Space>
                                    <ExclamationCircleOutlined /> {tCom('btn_detail')}
                                    </Space>
                                </a>
                            ),
                            key: '0'
                        },
                        {
                            type: 'divider'
                        },
                        {
                            label: (
                                <a
                                onClick={() => {
                                    router.push(`/risk-assessment/edit?id=${id}`);
                                }}
                                >
                                <Space>
                                    <EditOutlined /> {tCom('btn_edit')}
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
                                        modal.confirm({
                                        title: tMsg('msg_confirm_delete').replace('%ITEM%', riskName),
                                        centered: true,
                                        width: '40%',
                                        icon: <WarningOutlined style={{ color: 'red' }} />,
                                        closable: true,
                                        cancelText: tCom('btn_cancel'),
                                        okText: tCom('btn_yes'),
                                        okButtonProps: { type: 'primary', danger: true },
                                        onOk: () => {
                                            handleDeleteAction(id);
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
                                        <DeleteOutlined /> {tCom('btn_delete')}
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
                            riskMaster.key!,
                            riskMaster.riskName!
                        )
                        }}
                        key={riskMaster.id}
                    >
                        <a onClick={e => e.preventDefault()} key={riskMaster.id}>
                            <Space>
                            <Button
                                type='text'
                                icon={<EllipsisOutlined />}
                            ></Button>
                            </Space>
                        </a>
                    </Dropdown>
                )
            }
        }
    ];
    const handleTableChange: TableProps['onChange'] = (pagination) => {
        setTableParams({
          pagination
        });
        searchAction(pagination);
        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
          setData([]);
        }
      };
    const handleCreateNewRisk = () => {
        router.push('/risk-assessment/add');
    }
    return (
        <>
            <Content style={{ padding: '30px 48px' }}>
                <h2>{tLbl('risk_assessment')}</h2>
                <ColoredLine text={tLbl('search_condition')}/>
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 8 }}
                        layout="horizontal"
                    >
                        <Form.Item label={tLbl('search_by_keyword')}>
                            <Input
                            onChange={handleKeyword}
                            placeholder={tLbl('keyword_text_placeholder')}
                            />
                        </Form.Item>
                        <Form.Item label={tLbl('risk_is_draft')}>
                            <Radio.Group onChange={handleOnchecked} defaultValue="all">
                                <Radio value="all">All</Radio>
                                <Radio value={true}>{tLbl('draft')}</Radio>
                                <Radio value={false}>{tLbl('publish')}</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item {...buttonItemLayout}>
                            <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className={cx('disease__searchBtn')}
                            onClick={() => {
                                const page: TablePaginationConfig = {
                                    pageSize: 10,
                                    current: 1
                                }
                                searchAction(page);
                            }}
                            >
                            {tCom('btn_search')}
                            </Button>
                        </Form.Item>
                    </Form>
                <ColoredLine text={tLbl('search_result')}/>
                <Button
                    type='primary'
                    htmlType='submit'
                    icon={<PlusOutlined />} 
                    size='large'
                    className={cx('risk__btn')}
                    onClick={handleCreateNewRisk}
                >
                    {tCom('btn_add')}
                </Button>
                <Table
                    columns={columns}
                    rowKey={(record) => record.key}
                    dataSource={data}
                    pagination={
                        {
                            ...tableParams.pagination,
                            showTotal: total => `Total ${total} Items`,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30']
                        }
                    }
                    loading={loading}
                    onChange={handleTableChange}
                />
                {/* <TableComponent data={apiData} loading={loadings} /> */}
            </Content>
        </>
    )
};

const ListApp: React.FC = () => (
    <App>
      <List />
    </App>
  );
export default ListApp;
