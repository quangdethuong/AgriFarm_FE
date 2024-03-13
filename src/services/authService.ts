import Admin from '@/types/admin';
import FormRegisterValues from '@/types/register';
import HttpResponseCommon from '@/types/response';
import { http } from '@/utils/config';

export const register: (
  payload: FormRegisterValues
) => Promise<HttpResponseCommon<Admin | [] | undefined>> = async payload => {
  try {
    const res = await http.post('register/Registry/Post', payload);
    // console.log('response authService outututu: ', res);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
