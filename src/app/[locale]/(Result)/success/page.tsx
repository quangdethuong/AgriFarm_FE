'use client';
import React, { useEffect } from 'react';
import { Button, Result } from 'antd';
import { LOGIN_PATH, REGISTER_PATH } from '@/constants/routes';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import approveFromApi from '@/services/Payment/approveFromApi';
import UseAxiosAuth from '@/utils/axiosClient';
import { useAppSelector } from '@/redux/hooks';
import Admin from '@/types/admin';

const SuccessPage = (props: any) => {
  const router = useRouter();
  const t = useTranslations('Result');
  const http = UseAxiosAuth();
  const { userRegister } = useAppSelector(state => state.authReducer);
  const dataForm = userRegister?.data as Admin;
  useEffect(() => {
    approve();
  }, []);
  const approve = () => {
    const res = approveFromApi(http, dataForm.id);
    console.log(res);
  }

  return (
    <Result
      status='success'
      title={t('regis_success')}
      subTitle={t('subTitle_success')}
      extra={[
        <Button
          type='primary'
          key='console'
          onClick={() => {
            router.push(LOGIN_PATH);
          }}
        >
          {t('btn_redToLogin')}
        </Button>,
        <Button
          key='buy'
          onClick={() => {
            router.push(REGISTER_PATH);
          }}
        >
          {t('btn_redToRegis')}
        </Button>
      ]}
    />
  );
};

export default SuccessPage;
