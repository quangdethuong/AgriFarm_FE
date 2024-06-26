import {
  Affix,
  Button,
  Col,
  Descriptions,
  Divider,
  Flex,
  message,
  Modal,
  Row,
  Segmented,
  Space,
  Tag,
  theme,
  Typography
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import {
  AppstoreTwoTone,
  CheckSquareTwoTone,
  CloseSquareTwoTone,
  EditTwoTone,
  EnvironmentTwoTone,
  FireTwoTone,
  HourglassTwoTone,
  PaperClipOutlined,
  RightSquareFilled,
  RightSquareTwoTone
} from '@ant-design/icons';
import ActivityParticipantSection from '../ActivityParticipant/activityParticipantSection';
import ActivityLocationSection from '../ActivityLocation/activityLocationSection';
import ActivityMaterialSection from '../ActivityMaterial/activityMaterialSection';
import ActivityTaskAdditionSection from '../activityAdditions/activityTaskAdditionSection';
import ActivityInviteWaitingSection from './activityInviteWaitingSection';
import { usePathname, useRouter } from '@/navigation';
import {
  completeActivitiesService,
  deleteActivitiesService,
  getActivityByIdService
} from '@/services/Admin/Activities/activityService';
import {
  ActivityLocation,
  ActivityParticipant,
  ActivityResponse
} from '@/services/Admin/Activities/Payload/response/activityResponse';
import UseAxiosAuth from '@/utils/axiosClient';
import EditActivityInfoModal from './editActivityModal';
import {
  ActivityDetailBoundary,
  useActivityBoundary
} from '../DetailBoundary/actvityDetailBoundary';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { renderPath } from '@/app/[locale]/(Auth)/login/loginform';

interface IProps {
  item: ActivityResponse;
}

export default function ActivityFullDetail(props: IProps) {
  const { item } = props;
  const {
    activity,
    setActivity,
    setAddition,
    setLocation: setLoaction,
    location,
    setActive,
    active
  } = useActivityBoundary();

  //console.log('Data: ', item);

  const viewDate = new Date();
  const farmRouter = useRouter();
  const [value, setValue] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [comOpen, setComOpen] = useState(false);
  const [isWaiting, setIsWaiting] = useState(item.isWaiting);
  const [isComplete, setIsComplete] = useState(item.isCompleted);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();
  const { token } = theme.useToken();
  const http = UseAxiosAuth();
  const { data: session } = useSession();
  const role = session?.user.userInfo.role as string;

  useEffect(() => {
    setActivity(item);
    setAddition(item.addition ?? null);
    setLoaction(item.location ?? null);
    setActive(item.active ?? false);
    setActivity(item);
  }, [item]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      var rs = await deleteActivitiesService(http, item.id);
      if (rs) {
        console.log('ok');
        message.success('Đã xóa');
        farmRouter.push('/activities');
      }
    } catch {
      message.error('Xóa thất bại');
    } finally {
      setIsLoading(false);
      setDelOpen(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      var rs = await completeActivitiesService(http, item.id);
      if (rs) {
        console.log('ok');
        message.success('Đã hoàn thành');
        // farmRouter.push('/activities');
        // farmRouter.push('/activities/'+item.id);
        setIsComplete(true);
      }
    } catch {
      message.error('Thất bại');
    } finally {
      setIsLoading(false);
      setComOpen(false);
    }
  };

  const deleteConfirmModal = () => {
    return (
      <>
        <Modal
          title={'Bạn có chắc muốn xóa hoạt động này?'}
          centered
          open
          onCancel={() => setDelOpen(false)}
          onOk={() => handleDelete()}
          okText={'Xác nhận'}
          okType='danger'
          okButtonProps={{ type: 'primary' }}
          cancelText='Quay lại'
        >
          <Typography.Text
            type='secondary'
            italic
          >
            Bằng cách xác nhận hành động này, mọi thông tin liên quan hoạt động này sẽ bị
            xóa đi vĩnh viễn
          </Typography.Text>
        </Modal>
      </>
    );
  };

  const completeConfirmModal = () => {
    return (
      <>
        <Modal
          title={'Bạn có chắc muốn hoàn thành hoạt động này?'}
          centered
          open
          onCancel={() => setComOpen(false)}
          onOk={() => handleComplete()}
          okText={'Xác nhận'}
          okType='primary'
          okButtonProps={{ type: 'primary' }}
          cancelText='Quay lại'
        >
          <Typography.Text
            type='secondary'
            italic
          ></Typography.Text>
        </Modal>
      </>
    );
  };

  return (
    <>
      <Divider orientation='left'>
        <Typography.Title level={3}>
          {/* Hoạt động: Xới đất */}
          Hoạt động: {activity?.title ?? item.title}
        </Typography.Title>
      </Divider>
      <Flex
        style={{
          width: '70vw',
          minWidth: 800,
          marginLeft: '5vw',
          // border: '1px solid black',
          borderRadius: 10,
          padding: 10,
          minHeight: '100vh',
          height: 'auto'
        }}
        vertical
      >
        <Row
          gutter={[16, 32]}
          style={{
            width: '100%',
            minHeight: 200,
            paddingInline: 20,
            overflow: 'auto'
          }}
        >
          <Col span={24}>
            <Row>
              <Col span={4}>
                <Descriptions title='Thông tin chung' />
              </Col>
              <Col span={3}>
                {item.editAble && (
                  <Button
                    type='link'
                    onClick={() => setEditOpen(true)}
                  >
                    <EditTwoTone
                      twoToneColor={'#3660C1'}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                  </Button>
                )}
              </Col>
            </Row>
            <Flex
              vertical
              style={{
                maxHeight: '30vh',
                overflow: 'auto',
                paddingLeft: 10
              }}
            >
              {activity &&
                activity.descriptions &&
                activity.descriptions.map(e => {
                  return (
                    <div key={e.name}>
                      <Typography.Text strong>{e.name}:</Typography.Text>
                      <p>{e.value}</p>
                    </div>
                  );
                })}
            </Flex>
          </Col>

          {/* <Col span={24}>
            <Descriptions title='Tag' />
            <Space>
              <Tag color='green-inverse'>abc</Tag>
              <Tag color='green-inverse'>ax1</Tag>
              <Tag color='green-inverse'>sda2</Tag>
              <Tag color='green-inverse'>342wz</Tag>
            </Space>
          </Col> */}
          <Col span={8}>
            {/* <Descriptions title='Start time' /> */}
            <Descriptions title='Thời gian bắt đầu' />
            <RightSquareTwoTone
              twoToneColor={'#00ce07'}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{' '}
            {dayjs(item.start)
              //.add(-3, 'y')
              .format('HH:mm DD/MM/YYYY')}
          </Col>
          <Col span={10}>
            {/* <Descriptions title='Estimated end' /> */}
            <Descriptions title='Thời gian kết thúc dự kiến' />
            <HourglassTwoTone
              twoToneColor={'#edbf33'}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{' '}
            {dayjs(item.end)
              //.add(-3, 'y')
              .format('HH:mm DD/MM/YYYY')}
          </Col>
          <Col span={6}>
            <Descriptions title='Thời gian kết thúc' />
            <FireTwoTone
              twoToneColor={'#ea4f44'}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />{' '}
            {/* {!item.isCompleted
              ? 'Chưa kết thúc'
              : dayjs('2019-04-05 04:00', 'YYYY-MM-DD HH:mm').format('HH:mm DD/MM/YYYY')} */}
            {item.end < new Date() ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
            {/* {dayjs(item.end).add(-3, 'y').format('HH:mm DD/MM/YYYY')} */}
          </Col>
        </Row>
        <Divider></Divider>
        <ActivityParticipantSection
          editable={item.editAble ?? false}
          activityId={item.id}
          participants={item.participants ?? []}
        />
        <Divider></Divider>

        <Flex
          vertical
          style={{
            width: '100%',
            //minHeight: 400,
            height: 500,
            //minHeight: 400,
            padding: 20
          }}
        >
          <Segmented
            style={{
              //border: '1px solid black',
              height: '20%',
              minHeight: 30,
              marginBottom: 20
            }}
            defaultValue={1}
            options={[
              {
                value: 1,
                label: (
                  <div>
                    <AppstoreTwoTone
                      twoToneColor={'#e84d60'}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    {/* Material */}
                    Vật liệu sử dụng
                  </div>
                )
              },
              {
                value: 2,
                label: (
                  <div>
                    <EnvironmentTwoTone
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    {/* Location */}
                    Vị trí thực hiện
                  </div>
                )
              },
              {
                value: 3,
                label: (
                  <div>
                    <PaperClipOutlined
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    />
                    {/* Addition Request */}
                    Hành động yêu cầu
                  </div>
                )
              }
            ]}
            onChange={val => setValue(val.valueOf() as number)}
            block
          />

          <Col span={24}>
            <Flex
              vertical
              align='center'
              justify='center'
              style={{
                height: '80%'
              }}
            >
              {value === 1 && (
                <ActivityMaterialSection
                  editable={item.editAble ?? false}
                  activityId={item.id}
                  details={item.materials}
                />
              )}
              {value === 2 && (
                <ActivityLocationSection
                  editable={item.editAble ?? false}
                  activityId={item.id}
                  detail={item.location as ActivityLocation}
                  setDetail={data => {
                    item.location = data;
                  }}
                />
              )}
              {value === 3 && (
                <ActivityTaskAdditionSection
                // curLocationId={item.location?.id ?? null}
                // editable={item.editAble ?? false}
                // activity={item}
                />
              )}
            </Flex>
          </Col>
        </Flex>
      </Flex>
      <Flex
        gap={10}
        style={{ width: '100%', paddingBlock: 50, paddingInlineEnd: '12vw' }}
        justify='end'
      >
        <Button
          //size='large'
          //type='primary'
          onClick={() => farmRouter.push(renderPath(role))}
        >
          {/* Back to list */}
          Quay lại
        </Button>
        {item.editAble && (
          <>
            <Button
              //size='large'
              danger
              type='primary'
              onClick={() => setDelOpen(true)}
            >
              {/* Delete */}
              Xóa
            </Button>
          </>
        )}
        <Button
          //size='large'
          // disabled={item.isCompleted  || !item.completable && isComplete}
          disabled={!item.completable || !active}
          type='primary'
          onClick={() => {
            setComOpen(true);
          }}
        >
          {/* Mark Complete */}
          Hoàn thành
        </Button>
      </Flex>
      {delOpen && deleteConfirmModal()}
      {comOpen && completeConfirmModal()}
      {editOpen && (
        <EditActivityInfoModal
          detail={item}
          onClose={() => setEditOpen(false)}
          onOk={data => {
            setActivity({ ...item, title: data.title, descriptions: data.descriptions });
            setEditOpen(false);
          }}
        />
      )}
      {isWaiting && (
        <ActivityInviteWaitingSection
          activityId={item.id}
          onAccept={() => {
            console.log('Accept task');
            setIsWaiting(false);
          }}
          onReject={() => {
            console.log('Reject task');
            farmRouter.push(renderPath(role));
          }}
        />
      )}
    </>
  );
}
