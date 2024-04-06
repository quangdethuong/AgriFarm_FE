import React, { useState } from 'react';
import { Button, Col, Drawer, Modal, Space, Tag } from 'antd';
import {
  ActivityResponse,
  Addition
} from '@/services/Admin/Activities/Payload/response/activityResponse';
import dayjs from 'dayjs';
// import { additionsData } from '../FakeData/fakeDatesData';
import { Link } from '@/navigation';
import AdditionSection from '../activityAdditions/AdditionSection/additionSection';
import UseAxiosAuth from '@/utils/axiosClient';
import { doneScheduleService } from '@/services/Admin/Activities/scheduleService';

interface EventModalProps {
  activity: ActivityResponse; // Assuming you have CustomEvent type defined
  onClose: () => void;
}

// const addData = additionsData[0];

const ActivityDetail: React.FC<EventModalProps> = ({ activity, onClose }) => {
  const [open, setOpen] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [additionDetail, setAdditionDetail] = useState<Addition | null>(null);
  const http = UseAxiosAuth();

  const showModal = () => {
    console.log('ok');
    //setOpen(true);
  };
  const handleOk = () => {
    //setOpen(false);
  };

  const handleCancel = () => {
    //setOpen(false);
    onClose();
  };

  const handleDone = async (activityId: string) => {
    console.log('id: ', activityId);
    const rs = await doneScheduleService(http, activityId);

    console.log('done, ', rs);
  };

  return <></>;
};

export default ActivityDetail;
/*
<Drawer
  open={open}
  title={'Activity Detail'}
  onClose={handleCancel}
  width={'40vw'}
>
  <div style={{ height: '80vh' }}>
    <div>
      <h2>Title: {activity.title}</h2>
    </div>
    <p>Start: {dayjs(activity.start).format('HH:mm DD/MM/YYYY')}</p>
    <p>End: {dayjs(activity.end).format('HH:mm DD/MM/YYYY')}</p>
    <br />
    <h3>--Detail Information--</h3>
    <div>
      Land: <a href={`/${activity.location?.id}`}>{activity.location?.name}</a>
    </div>
    <div>
      Season: <a href={`/${activity.season?.id}`}>{activity.season?.title}</a>
    </div>
    <div>
      Inspectors:{' '}
      {activity.inspectors.map((ins, index) => (
        <Tag
          color='blue'
          key={index}
        >
          <a href={`/${ins.id}`}>@{ins.name}</a>
        </Tag>
      ))}
    </div>
    <div>
      Participants:{' '}
      {activity.workers.map((wok, index) => (
        <Tag
          color='cyan'
          key={index}
        >
          @{wok.name}
        </Tag>
      ))}
    </div>
    <p>Status: {activity.isCompleted ? 'Completed' : 'Not yet'}</p>
    <div>
      More Information:{' '}
      {activity.descriptions.map((des, index) => {
        return (
          <div key={index}>
            {' '}
            {'-'} {des.name}: {des.value}
          </div>
        );
      })}
    </div>
    <br />
    <h3>--Advance Detail--</h3>
    Detail:{' '}
    {activity.addition && (
      <AdditionSection
        activityId={activity.id}
        addition={activity.addition}
      />
    )}
    
    <Col style={{ marginTop: 20 }}>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button
        style={{ marginLeft: 10 }}
        type='primary'
        onClick={() => handleDone(activity.id)}
      >
        Mark as Done
      </Button>
    </Col>
  </div>
</Drawer>;
*/
