'use client';
import React from 'react';
import { Button, Result } from 'antd';
import { LOGIN_PATH, REGISTER_PATH } from '@/constants/routes';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';

const SuccessPage: React.FC = () => {
  const router = useRouter();
  const t = useTranslations('Result');
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
