import HttpResponseCommon from '@/types/response';
import { AxiosInstance, AxiosResponse } from 'axios';
import {
  ActivityByMonthResponse,
  ActivityResponse
} from '@/services/Admin/Activities/Payload/response/activityResponse';
import { CreateActivityRequest, EditActivityRequest } from './Payload/request/activityRequest';

const basePath = '/cult/activities';

export const getActivitiesService: (
  seasonId: string,
  http?: AxiosInstance | null,
  id?: string | null
) => Promise<HttpResponseCommon<ActivityResponse[]>> = async (seasonId, http, id) => {
  const res = await http?.get(`${basePath}/get`, {
    params: {
      seasonId: seasonId
    }
    // headers: {
    //   pageSize: 4,
    //   pageNumber: 1
    // }
  });
  //console.log('response staffsService: ', res);
  return res?.data;
};

export const getActivityHistoryService: (
  http?: AxiosInstance | null,
  pageNumber?: number,
  pageSize?: number
) => Promise<AxiosResponse<HttpResponseCommon<ActivityResponse[]>>> = async (
  http,
  pageNumber = 1,
  pageSize = 10
) => {
  const res = await http?.get(`${basePath}/history`, {
    // params: {
    //   seasonId: seasonId
    // }
    headers: {
      pageSize: pageSize,
      pageNumber: pageNumber
    }
  });
  //console.log('response staffsService: ', res);
  return res as AxiosResponse<HttpResponseCommon<ActivityResponse[]>>;
};

export const getActivityByIdService: (
  http?: AxiosInstance | null,
  id?: string | null
) => Promise<HttpResponseCommon<ActivityResponse>> = async (http, id) => {
  const res = await http?.get(`${basePath}/get`, {
    params: {
      id: id
    }
  });
  return res?.data;
};

export const getActivitiesByMonthService: (
  http?: AxiosInstance | null,
  month?: number,
  year?: number
) => Promise<HttpResponseCommon<ActivityByMonthResponse[]>> = async (
  http,
  month,
  year
) => {
  const res = await http?.get(`${basePath}/by-month`, {
    params: {
      month: month,
      year: year
    }
  });

  return res?.data as HttpResponseCommon<ActivityByMonthResponse[]>;
};

export const getActivitiesByDateService: (
  http?: AxiosInstance | null,
  date?: Date
) => Promise<HttpResponseCommon<ActivityResponse[]>> = async (http, date) => {
  const res = await http?.get(`${basePath}/by-date`, {
    params: {
      date: date
    }
  });

  return res?.data as HttpResponseCommon<ActivityResponse[]>;
};

export const postActivitiesService: (
  http: AxiosInstance,
  payLoad: CreateActivityRequest
) => Promise<HttpResponseCommon<ActivityResponse>> = async (http, payLoad) => {
  const res = await http.post(`${basePath}/post`, payLoad);
  return res?.data as HttpResponseCommon<ActivityResponse>;
};

export const deleteActivitiesService: (
  http: AxiosInstance,
  id: string
) => Promise<boolean> = async (http, id) => {
  const res = await http.delete(`${basePath}/delete`, {
    params: {
      id: id
    }
  });
  return res?.status === 204;
};

export const putActivitiesService: (
  http: AxiosInstance,
  id: string,
  payLoad: EditActivityRequest
) => Promise<boolean> = async (http,id, payLoad) => {
  const res = await http.put(`${basePath}/put`, payLoad,{
    params:{
      id:id
    }
  });
  return res?.status === 204;
};

export const checkInviteActivitiesService: (
  http: AxiosInstance,
  id: string,
  accept: boolean
) => Promise<boolean> = async (http, id, accept) => {
  const res = await http.put(
    `${basePath}/invitation`,
    {},
    {
      params: {
        accept: accept,
        id: id
      }
    }
  );
  return res?.status === 202;
};

export const completeActivitiesService: (
  http: AxiosInstance,
  activityId: string
) => Promise<boolean> = async (http, activityId) => {
  const res = await http.post(
    `${basePath}/done`,
    {},
    {
      params: {
        activityId: activityId
      }
    }
  );
  return res?.status === 204;
};
