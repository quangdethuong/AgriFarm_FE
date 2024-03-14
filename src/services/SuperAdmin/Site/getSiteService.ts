import HttpResponseCommon from '@/types/response';
import { AxiosInstance } from 'axios';

import { Sites } from './payload/response/sites';

export const getSitesService: (
  http: AxiosInstance | null,
  siteId?: string
) => Promise<HttpResponseCommon<Sites | [] | undefined>> = async (http, siteId) => {
  try {
    const res = await http?.get(`/farm/sites/get`, {
      params: {
        siteId: siteId
      },
      headers: {
        
      }
    });
    console.log('/farm/sites/get ', res);
    return res?.data;
  } catch (error) {
    console.log('error ', error);
  }
};
