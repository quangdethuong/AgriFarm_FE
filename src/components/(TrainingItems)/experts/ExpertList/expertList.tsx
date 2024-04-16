'use client';

import VirtualList from 'rc-virtual-list';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Expert } from '@/services/Admin/Training/response/training.response';
import {
  DeleteTwoTone,
  EditOutlined,
  EditTwoTone,
  EllipsisOutlined,
  HomeOutlined,
  PlusOutlined,
  SettingOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  ConfigProvider,
  Descriptions,
  Divider,
  Flex,
  Image,
  Input,
  List,
  Popconfirm,
  Row,
  Skeleton,
  Space,
  Table,
  TableProps,
  Typography
} from 'antd';
import { useEffect, useState } from 'react';
import ExpertDetail from '../ExpertDetail/expertDetail';
import AddExpert from '../CreateExpert/addExpert';
import UpdateExpert from '../UpdateExpert/updateExpert';
import AgriImage from '@/components/(ImageItem)/AgriImage/agriImage';
import { AxiosInstance } from 'axios';
import UseAxiosAuth from '@/utils/axiosClient';
import { getExpertsService } from '@/services/Admin/Training/expertService';
import Meta from 'antd/es/card/Meta';
import { PaginationResponse } from '@/types/pagination';
import { useRouter } from '@/navigation';
import { Span } from 'next/dist/trace';
import Search from 'antd/es/transfer/search';
import { Content } from 'antd/es/layout/layout';

interface IProps {
  list?: Expert[] | [];
  isFetching?: boolean;
  setIsFetching?: (val: boolean) => void;
  setHasChanged?: (value: boolean) => void;
}

export default function ExpertList(props: IProps) {
  const [experts, setExperts] = useState<Expert[] | []>();
  const [isFetching, setIsFetching] = useState(false);
  const [hasChanged, setHasChanged] = useState(true);
  const [page, setPage] = useState<PaginationResponse>({
    CurrentPage: 1,
    PageSize: 0,
    TotalCount: 0,
    TotalPages: 1
  });

  const farmRouter = useRouter();
  const http = UseAxiosAuth();

  const fetchExperts = async (http: AxiosInstance) => {
    try {
      console.log('Fetching data..');
      const responseData = await getExpertsService(http);
      console.log('Data here: ', responseData);
      setExperts(responseData?.data.data as Expert[]);
      setIsFetching(false);
    } catch (error) {
      console.error('Error calling API training content:', error);
    }
  };

  // useEffect(() => {
  //   fetchExperts(http);
  // }, [http, hasChanged]);

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);

  useEffect(() => {
    const exps: Expert[] = [];
    for (let index = 0; index < 10; index++) {
      exps.push({
        id: 'sdasdads-q243-asd412-dasd' + index,
        fullName: `Expert ${index}`,
        description: 'very good technical',
        expertField: 'Math'
      });
    }
    setExperts(exps);
    setPage({
      CurrentPage: 1,
      PageSize: 10,
      TotalCount: 12,
      TotalPages: 2
    });
  }, [hasChanged]);

  const renderHeader = () => {
    return (
      <>
        <Flex
          vertical
          gap={20}
          justify='space-between'
          style={{
            // margin: '1rem',
            width: '100%'
          }}
        >
          <Flex
            style={{
              //marginLeft: '5%',
              width: '100%'
            }}
            justify='center'
            align='center'
          >
            <Col span={22}>
              <Input type='text' />
            </Col>
            <Col span={2}>
              <Button type='primary'>Search</Button>
            </Col>
          </Flex>

          <Flex
            style={{ paddingRight: '5vw', marginBottom: 30 }}
            justify='end'
            align='right'
          >
            <Button
              icon={<PlusOutlined />}
              type='primary'
              onClick={() => farmRouter.push('experts/add')}
            >
              Add Expert
            </Button>
          </Flex>
        </Flex>
      </>
    );
  };

  const handleDelete = async (content: Expert) => {
    //await handleDeleteActivityAction({ id: user.id })
  };

  const handleDetailClick = (content: Expert) => {
    setSelectedExpert(content);
    //setDetailOpen(true);
    farmRouter.push('experts/sdas-dads-q243-asd412-das1');
  };

  const renderDetail = () => {
    console.log('appear popup');
    return (
      <ExpertDetail
        detail={selectedExpert ?? ({} as Expert)}
        onClose={() => setDetailOpen(false)}
      />
    );
  };

  const loadMoreData = () => {
    console.log('Page: ', page);
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    console.log('Start Fetching');
    getExpertsService(http)
      .then(res => res.data)
      .then(body => {
        console.log('body ', body);
        setExperts([...(experts as Expert[]), ...(body.data as Expert[])]);
        setIsFetching(false);
      })
      .catch(() => {
        setIsFetching(false);
      });
  };

  const renderListSection = () => {
    return (
      <div
        id='scrollableDiv'
        style={{
          height: '80vh',
          width: '100%',
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)'
        }}
      >
        <InfiniteScroll
          dataLength={page.PageSize}
          next={loadMoreData}
          hasMore={!!experts && experts?.length < page.TotalCount}
          loader={
            <Skeleton
              avatar
              paragraph={{ rows: 1 }}
              active
            />
          }
          endMessage={
            page.TotalCount > 0 ? (
              <Divider plain>It is all, nothing more</Divider>
            ) : (
              <Divider>No thing to display! Please add more.</Divider>
            )
          }
          scrollableTarget='scrollableDiv'
        >
          <List
            itemLayout='horizontal'
            dataSource={experts}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                style={{ minHeight: 100 }}
              >
                <Card
                  style={{
                    width: '100%',
                    //width: 500,
                    //height: 200,
                    marginTop: 16
                  }}
                  loading={isFetching}
                  bordered={true}
                >
                  <Flex justify='space-between'>
                    <Flex
                      justify='start'
                      gap={30}
                    >
                      <Avatar
                        alt='avatar'
                        src='#'
                        style={{ width: 100, height: 100, display: 'block' }}
                      />
                      <Flex
                        vertical
                        align='space-between'
                        justify='center'
                        //style={{ padding: 10 }}
                      >
                        <Typography.Title level={5}>
                          <a onClick={() => handleDetailClick(item)}>{item.fullName}</a>
                        </Typography.Title>
                        <Typography.Paragraph>
                          <div
                            style={{
                              height: 50
                            }}
                          >
                            {item?.description?.length ?? 0 > 30
                              ? `${item.description?.substring(0, 30)}...`
                              : item.description ?? 'No thing to display'}
                          </div>
                        </Typography.Paragraph>
                      </Flex>
                    </Flex>

                    <Flex
                      vertical
                      style={{ width: '5%' }}
                      align='center'
                      justify='space-between'
                    >
                      <SettingOutlined key='setting' />
                      <EditOutlined key='edit' />
                      <EllipsisOutlined key='ellipsis' />
                    </Flex>
                  </Flex>
                </Card>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    );
  };

  const columns: TableProps<Expert>['columns'] = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      // width:'40vw',
      render: (_, e) => (
        <Space onClick={() => handleDetailClick(e)}>
          <Avatar
            shape='square'
            size={100}
          />
          {e.fullName}
        </Space>
      )
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'age',
      key: 'age',
      render: (_, e) => (
        <Space onClick={() => handleDetailClick(e)}>{e.expertField}</Space>
      )
    },
    {
      title: 'Mô tả',
      dataIndex: 'address',
      key: 'address',
      render: (_, e) => <Space>{e.description?.substring(0, 20)}</Space>
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, e) => (
        <Button
          type='link'
          onClick={() => handleDetailClick(e)}
        >
          Chi tiết
        </Button>
      )
    }
  ];

  return (
    <>
      <Content style={{ padding: '20px 0px' }}>
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
            //className={cx('home-btn')}
            href='#'
            size={'large'}
          >
            <HomeOutlined style={{ color: 'green' }} />
            Hoa Mai
          </Button>
        </ConfigProvider>
        <Breadcrumb style={{ margin: '0px 24px' }}>
          <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>Thông tin chuyên gia</Breadcrumb.Item>
        </Breadcrumb>
        <Divider orientation='left'>
          <Typography.Title level={3}>Thông tin chuyên gia</Typography.Title>
        </Divider>
        <div style={{ marginLeft: 50, width: '70vw' }}>
          <Flex style={{ marginBottom: 50 }}>
            <Search />
          </Flex>
          <Table
            dataSource={experts}
            columns={columns}
          ></Table>
        </div>

        {/* {detailOpen && selectedExpert && (
        <ExpertDetail
          detail={selectedExpert ?? ({} as Expert)}
          onClose={() => {
            setDetailOpen(false);
            setHasChanged(false);
          }}
        />
      )} */}

        {updateOpen && (
          <UpdateExpert
            onClose={() => {
              setUpdateOpen(false);
            }}
            detail={selectedExpert ?? ({} as Expert)}
          />
        )}
      </Content>
    </>
  );
}

{
  /* <div>
        <AgriImage
          height={200}
          width={200}
          path='123/41347038-ecc3_bg.png'
          alt='ok'
        />
      </div> */
}
