import { ACCESS_TOKEN, http } from '@/utils/config';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAppAsyncThunk } from '../createAppAsyncThunk';
import { loginModel } from '@/app/[locale]/(Auth)/models/login-model';
import { registerModel } from '@/app/[locale]/(Auth)/models/register-model';
import FormRegisterValues from '@/types/register';
import HttpResponseCommon from '@/types/response';
import Admin, { Solution } from '@/types/admin';
import { register } from '@/services/authService';

export interface UserState {
  userRegister: HttpResponseCommon<Admin> | null;
}

export interface UserLoginResponse {
  data: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    siteCode: string;
    siteName: string;
    isApprove: number;
    solution: Solution;
    cost: number;
    paymentDetail: string;
  };
  status: string;
}

// export type UserRegisterResponse = {
//   email: string;
//   status: string;
// };

const initialState: UserState = {
  userRegister: {
    data: {
      id: '49ee98e2-6a34-4895-a325-188fbe7c2c07',
      firstName: 'string 01',
      lastName: 'string 01',
      phone: 'string',
      email: 'string',
      address: 'string',
      siteCode: 'string',
      siteName: 'string',
      isApprove: 0,
      solution: {
        id: '45aa6629-5e67-4c70-aa9c-eed4e82e7da6',
        name: 'Solution 1',
        description: 'This is cheapest solution',
        price: 10.0,
        durationInMonth: 6
      },
      cost: 10.0,
      paymentDetail: ''
    },
    status: 0,
    message: ''
  }
};

const auth = createSlice({
  name: 'userReducer',
  initialState,
  reducers: {
    resetState: (state: UserState) => {
      if (state.userRegister) state.userRegister.message = '';
    }
  },
  extraReducers(builder) {
    builder
      .addCase(registerAsyncApi.pending, (state: UserState) => {
        if (state.userRegister) state.userRegister.message = 'loading';
      })
      .addCase(registerAsyncApi.fulfilled, (state: UserState) => {
        if (state.userRegister) {
          state.userRegister.message = 'done';
        }
      })
      .addCase(registerAsyncApi.rejected, (state: UserState) => {
        if (state.userRegister) {
          state.userRegister.message = 'error';
        }
      });
  }
});

export const { resetState } = auth.actions;

export default auth.reducer;

// export const loginAsyncApi = createAppAsyncThunk(
//   'userReducer/loginAsyncApi',
//   async (userLogin: loginModel) => {
//     const response = await http.post('/common/login/', userLogin);
//     return response.data;
//   }
// );

export const registerAsyncApi = createAppAsyncThunk(
  'userReducer/registerAsyncApi',
  async (values: FormRegisterValues) => {
    const userRegister: FormRegisterValues = {
      ...values,
      paymentDetail: 'custom default',
      solutionId: '45aa6629-5e67-4c70-aa9c-eed4e82e7da6'
    };
    const response: HttpResponseCommon<Admin> | any = await register(userRegister);
    if (response && response.status) {
      console.log('data resp register: ', response.data);

      return response.data;
    } else return console.log('fail ko call dc register data ', response.data);
  }
);
