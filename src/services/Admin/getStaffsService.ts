import { STATUS_OK } from '@/constants/https';
import HttpResponseCommon from '@/types/response';
import Staffs from '@/types/staffs';
import { StaffsDetails } from '@/types/staffs-detail';
import { FormInstance } from 'antd';

import { AxiosInstance } from 'axios';

// import { http } from '@/utils/config';
export interface Pagination {
  CurrentPage: number;
  PageSize: number;
  TotalCount: number;
  TotalPages: number;
}

export const getStaffsService: (
  siteId?: string | null,
  http?: AxiosInstance | null,
  userId?: string | null
) => Promise<HttpResponseCommon<Staffs[]>> = async (siteId, http, userId) => {
  const res = await http?.get(`/user/staffs/get`, {
    params: {
      siteId: siteId,
      userId: userId
    }
    // headers: {
    //   pageSize: 4,
    //   pageNumber: 1
    // }
  });
  console.log('response staffsService: ', res);
  return res?.data;
};

export const getStaffsServiceDetails: (
  siteId?: string | null,
  http?: AxiosInstance | null,
  userId?: string | null
) => Promise<HttpResponseCommon<StaffsDetails | []>> = async (siteId, http, userId) => {
  const res = await http?.get(`/user/staffs/get`, {
    params: {
      siteId: siteId,
      userId: userId
    }
    // headers: {
    //   pageSize: 4,
    //   pageNumber: 1
    // }
  });

  console.log('response getStaffsServiceDetails: ', res);
  return res?.data;
};
