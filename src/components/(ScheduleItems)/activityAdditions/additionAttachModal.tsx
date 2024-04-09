import {
  USING_ADDITION,
  TRAINING_ADDITION,
  ASSESSMENT_ADDITION,
  TREATMENT_ADDITION,
  HARVEST_ADDITION
} from '@/constants/additionType';
import {
  ActivityResponse,
  Addition
} from '@/services/Admin/Activities/Payload/response/activityResponse';
import UseAxiosAuth from '@/utils/axiosClient';
import { useDebounceSearch } from '@/utils/debounceSearch';
import { getPaginationResponse } from '@/utils/paginationHelper';
import {
  Modal,
  Button,
  Flex,
  Col,
  Typography,
  Input,
  Avatar,
  Divider,
  Descriptions,
  Form,
  Row,
  Select,
  Space,
  Radio
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import { useState } from 'react';

interface IProps {
  curActivity: ActivityResponse;
  // addition: Addition;
  onSelected: (addition: Addition) => void;
  onClose: () => void;
}

export default function AdditionAttachModal(props: IProps) {
  const {
    onClose,
    onSelected,
    curActivity
    //addition
  } = props;
  const [type, setType] = useState<string>(ASSESSMENT_ADDITION);
  const [experts, setExperts] = useState([
    {
      label: 'None',
      value: 'none'
    },
    {
      label: 'Expert 02',
      value: '7a7a8916-c767-4ad6-b98c-10775ba4a86c'
    },
    {
      label: 'Expert 01',
      value: 'b7119c1e-f585-4a9c-b22d-f8441d350963'
    }
  ]);
  const [items, setItems] = useState([
    {
      label: 'Seed 01',
      value: '559ac487-62ff-493f-8898-9d23c18c8718'
    },
    {
      label: '01',
      value: '01'
    },
    {
      label: '02',
      value: '02'
    },
    {
      label: '03',
      value: '03'
    }
  ]);
  const [chooseAble, setChooseAble] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Addition | null>(null);
  const [confirmable, setConfirmable] = useState(true);
  const [list, setList] = useState<Addition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const http = UseAxiosAuth();
  const form = useForm();
  // const [page, setPage] = useState<PaginationResponse>({
  //   CurrentPage: 1,
  //   PageSize: 0,
  //   TotalCount: 1,
  //   TotalPages: 1
  // });

  const handleCreateHarvest = () => {};

  const handleSelect = async (data: Addition) => {
    switch (type) {
    }

    setSelectedItem(data);
  };

  const handleSearch = async (val: string) => {
    // console.log('key: ', val);
    //     if (val && val.trim().length > 0) {
    //       setIsLoading(true);
    //       const res = await getAdditionService(http, val);
    //       console.log('body ', res);
    //       if (res.status === 200) {
    //         const body = res.data.data as Addition[];
    //         // console.log('page ', getPaginationResponse(res));
    //         console.log('List ', body);
    //         if (body.length > 0) {
    //         //   setPage(getPaginationResponse(res));
    //           setList([...list, ...body]);
    //         }
    //       }
    //       setIsLoading(false);
    //     }
    //   };
    //   const [onSearch] = useDebounceSearch(handleSearch, 1000);
    //   const handleConfirm = () => {
    //     if (selectedItem) onSelected(selectedItem);
  };

  const hanldeChooseItem = async (value: string) => {
    console.log('>U have choose item: ', value);
    //const data = (await onFetchItems(value)) as any[];
    //console.log(">and data item: ", data);
    // setItems(
    //   data.map((i) => {
    //     return {
    //       label: i.name,
    //       value: i.id,
    //     };
    //   })
    // );

    // if (data) {
    //   if (data.length === 0) {
    //     console.log("Item: empty");
    //   }
    //   setChooseAble(true);
    // }
  };

  const handleConfirm = () => {};

  const renderByType = () => {
    switch (type) {
      case TRAINING_ADDITION:
        return (
          <>
            <Flex
            vertical>
              <Descriptions title='Training Content'></Descriptions>
              <Form.Item
                //label=''
                name={['addition', 'content']}
                //rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <TextArea
                  placeholder={'Content here'}
                  rows={4}
                  maxLength={500}
                  showCount
                  style={{ resize: 'none' }}
                ></TextArea>
              </Form.Item>
              <Descriptions title='Trainer Expert'></Descriptions>
              <Form.Item
                name={['addition', 'expert']}
                //rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Select
                  //value={}
                  //onChange={hanldeChooseItem}
                  placeholder='Select item type'
                  options={experts}
                ></Select>
              </Form.Item>
            </Flex>
          </>
        );
      case ASSESSMENT_ADDITION:
        return (
          <>
          <Descriptions title='Risk Checklist'></Descriptions>
            <Form.Item
              // label=''
              name={['addition', 'checkList']}
              //rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Select
                //value={}
                onChange={hanldeChooseItem}
                placeholder='Select item type'
                //options={checklists}
              ></Select>
            </Form.Item>
          </>
        );
      case HARVEST_ADDITION:
        return (
          <>
            <Flex>
              {curActivity.location ? (
                <Flex vertical>
                  You choose harvest action for this location:
                  <Typography.Title level={3}>
                    {curActivity.location?.name}
                  </Typography.Title>
                </Flex>
              ) : (
                <Space>
                  <Typography.Text type='secondary'>
                    You must choose a land to harvest
                  </Typography.Text>
                </Space>
              )}
            </Flex>
          </>
        );
      case TREATMENT_ADDITION:
        return (
          <>
            <Descriptions title='Treatment Target'></Descriptions>
            <Form.Item
              label=''
              name={['addition', 'treatmentItem']}
              //rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <Select
                //value={}
                onChange={hanldeChooseItem}
                placeholder='Select item'
                disabled={!chooseAble}
                options={items}
                dropdownRender={menu => (
                  <>
                    {menu}
                    {items.length == 0 && (
                      <Space style={{ padding: '0 8px 4px' }}>
                        <Button>Click here to Add more</Button>
                      </Space>
                    )}
                  </>
                )}
              ></Select>
            </Form.Item>
            <Descriptions title='Treatment Method'></Descriptions>
            <FormItem
              name={['addition', 'method']}
            >
              <TextArea
                  placeholder={'Content here'}
                  rows={4}
                  maxLength={500}
                  showCount
                  style={{ resize: 'none' }}
                ></TextArea>
            </FormItem>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Modal
        open
        width={700}
        style={{
          minWidth: 500
        }}
        centered
        onCancel={() => onClose()}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              disabled={!confirmable}
              type='primary'
              onClick={() => handleConfirm()}
            >
              Confirm
            </Button>
          </>
        )}
      >
        <Flex
          vertical
          align='center'
          // justify=''
          style={{
            width: 600,
            minHeight: 500,
            height: '40vh',
            padding: 20
          }}
        >
          <Flex
            vertical
            align='center'
            justify='center'
            style={{
              width: '100%',
              height: '100%',
              border: '1px solid',
              borderRadius: 10
            }}
          >
            <Col
              style={{
                marginTop:50,
                height:'60%',
                width: '80%'
              }}
              span={24}
            >
              <Form.Item
                label='Type'
                name='type'
                style={{ width: '100%' }}
                //rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <Select
                  // name='type'
                  value={type}
                  // buttonStyle='solid'
                  onChange={e => {
                    //form.setFieldValue('addition', null);
                    if (e === HARVEST_ADDITION && !curActivity.location) {
                      setConfirmable(false);
                    }
                    setType(e);
                  }}
                  defaultValue={type}
                  style={{ width: '100%' }}
                >
                  <Select.Option
                    checked={true}
                    value={ASSESSMENT_ADDITION}
                  >
                    Assessment
                  </Select.Option>
                  <Radio.Button value={HARVEST_ADDITION}>Harvest</Radio.Button>
                  <Radio.Button value={TRAINING_ADDITION}>Training</Radio.Button>
                  <Radio.Button value={TREATMENT_ADDITION}>Treatment</Radio.Button>
                </Select>
              </Form.Item>
              <Flex
                vertical
                // justify='center'
                // align='center'
                style={{
                  width: 400,
                  height: 500
                }}
              >
                {renderByType()}
              </Flex>
            </Col>
          </Flex>
          <Divider></Divider>
        </Flex>
      </Modal>
    </>
  );
}
