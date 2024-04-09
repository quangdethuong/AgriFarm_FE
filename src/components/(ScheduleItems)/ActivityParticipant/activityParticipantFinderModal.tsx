import {
  getActivityParticipantService,
  setLocationService
} from '@/services/Admin/Activities/activitySubService';
import { ActivityParticipant } from '@/services/Admin/Activities/Payload/response/activityResponse';
import { PaginationResponse } from '@/types/pagination';
import UseAxiosAuth from '@/utils/axiosClient';
import { useDebounceSearch } from '@/utils/debounceSearch';
import { getPaginationResponse } from '@/utils/paginationHelper';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Divider,
  Flex,
  Input,
  message,
  Modal,
  Row,
  Space,
  Typography
} from 'antd';
import { useState } from 'react';

interface IProps {
  type: number;
  onSelected: (location: ActivityParticipant) => void;
  onClose: () => void;
  init: ActivityParticipant[];
}

export default function ActivityParticipantFinderModal(props: IProps) {
  const { onClose, onSelected, type, init } = props;

  const [selectedItem, setSelectedItem] = useState<ActivityParticipant | null>(null);
  const [list, setList] = useState<ActivityParticipant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const http = UseAxiosAuth();
  const [page, setPage] = useState<PaginationResponse>({
    CurrentPage: 1,
    PageSize: 0,
    TotalCount: 1,
    TotalPages: 1
  });

  const handleSelect = async (data: ActivityParticipant) => {
    setSelectedItem(data);
  };

  const handleSearch = async (val: string) => {
    // console.log('key: ', val);
    if (val && val.trim().length > 0) {
      setIsLoading(true);
      const res = await getActivityParticipantService(http, val);
      console.log('body ', res);
      if (res.status === 200) {
        const body = res.data.data as ActivityParticipant[];
        // console.log('page ', getPaginationResponse(res));
        
        if (body.length > 0) {
          console.log('init ', init);
          setPage(getPaginationResponse(res));
          const newList = body.filter(e => !init.find(x=>x.id===e.id));
          console.log('List ', newList);
          setList([...list, ...newList]);
        }
      }

      setIsLoading(false);
    }
  };
  const [onSearch] = useDebounceSearch(handleSearch, 1000);
  const handleConfirm = () => {
    if (selectedItem) onSelected(selectedItem);
  };

  return (
    <>
      <Modal
        open
        width={'60vw'}
        style={{
          minWidth: 700
        }}
        centered
        onCancel={() => onClose()}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Button onClick={() => handleConfirm()}>Confirm</Button>
          </>
        )}
      >
        <Flex
          vertical
          style={{
            minHeight: 500,
            height: '50vh',
            padding: 20
          }}
        >
          <Flex
            style={{
              width: '100%',
              height: '10%'
            }}
            //gap={15}
            align='center'
            justify='center'
          >
            <Col span={2}>
              <Typography.Text
                strong
                underline
              >
                Search
              </Typography.Text>
            </Col>
            <Col span={19}>
              <Input
                placeholder={'Find user name'}
                type='text'
                //onClick={e => onSearch(e.currentTarget.value)}
                onChange={e => onSearch(e.target.value)}
              />
            </Col>
          </Flex>
          <Flex
            vertical
            align='center'
            justify='center'
            style={{
              width: '100%',
              height: '50%'
            }}
          >
            <Flex
              vertical
              align='center'
              justify='center'
              style={{
                width: '90%',
                height: '100%',
                border: '1px solid',
                borderRadius: 10,
                margin: 20
              }}
            >
              {!isLoading && list.length === 0 && (
                <Typography.Text type='secondary'>No land available!</Typography.Text>
              )}
              {!isLoading && list.length > 0 && (
                <Flex
                  wrap='wrap'
                  align='flex-start'
                  justify='center'
                  style={{
                    width: '100%',
                    height: '100%',
                    //border: '1px solid',
                    //borderRadius: 10,
                    overflow: 'auto',
                    margin: 20
                  }}
                  gap={10}
                >
                  {list.map((e, i) => {
                    return (
                      <>
                        <Flex
                          key={e.id}
                          style={{
                            minWidth: 300,
                            width: '80%',
                            height: 100,
                            border: '1px solid',
                            borderRadius: 10,
                            padding: 10
                          }}
                          align='center'
                          justify='space-around'
                        >
                          <Avatar
                            alt=''
                            shape='square'
                            size={80}
                          />
                          <Typography.Text strong>{e.name}</Typography.Text>
                          <Button onClick={() => handleSelect(e)}>Select</Button>
                        </Flex>
                      </>
                    );
                  })}
                </Flex>
              )}
              {isLoading && <p>...</p>}
            </Flex>
          </Flex>
          <Divider></Divider>
          <Col offset={1}>
            <Descriptions title={'Your selected land:'} />
          </Col>
          <Flex
            vertical
            align='center'
            justify='center'
            style={{
              width: '100%',
              height: '20%'
            }}
          >
            {selectedItem ? (
              <Flex
                justify='space-around'
                style={{
                  minWidth: 250,
                  minHeight: 100,
                  border: '1px solid',
                  padding: 20
                }}
              >
                <div>
                  <Avatar
                    shape='square'
                    size={100}
                  />
                </div>
                <div>
                  <Typography.Text>{selectedItem.name}</Typography.Text>
                </div>
              </Flex>
            ) : (
              <Typography typeof='secondary'>You did not select any land.</Typography>
            )}
          </Flex>
        </Flex>
      </Modal>
    </>
  );
}
