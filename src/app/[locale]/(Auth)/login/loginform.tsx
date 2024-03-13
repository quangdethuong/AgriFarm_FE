'use client';

import { useState } from 'react';
import { Form, Input, Button, Row, Col, ConfigProvider } from 'antd';
import styles from '../auth.module.scss';

import classNames from 'classnames/bind';
import { loginModel } from '../models/login-model';
import Loading from '@/components/LoadingBtn/Loading';
import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { DASH_BOARD_PATH, REGISTER_PATH } from '@/constants/routes';
import { Link, useRouter } from '@/navigation';
import { hasDuplicate } from '@/utils/checkUrl';

const cx = classNames.bind(styles);

const LoginForm: React.FC = () => {
  const router = useRouter();

  const { data: session, status } = useSession();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const searchParams = useSearchParams();

  const callbackUrl =
    hasDuplicate(searchParams.get('callbackUrl') || '') === true
      ? searchParams.get('callbackUrl')?.substring(3)
      : searchParams.get('callbackUrl') || DASH_BOARD_PATH;
  console.log('call back url123: ', callbackUrl?.substring(1));
  // const handleDupicate = hasDuplicate(callbackUrl as string);
  // if (handleDupicate) {
  //   console.log('12312331213');
  //   console.log('newUrl: ', callbackUrl.substring(1));
  // } else {
  //   console.log('hi em yeu');
  // }
  //console.log('call back url: ', callbackUrl.substring(3));

  const handleLogin = async (data: loginModel) => {
    try {
      console.log('data: ', data.siteCode);
      setLoading(true);
      const res = await signIn('credentials', {
        // siteCode: data?.siteCode as string,
        userName: data?.userName as string,
        password: data?.password as string,
        redirect: false,
        callbackUrl
      });
      setLoading(false);

      if (!res?.error) {
        setError('');
        router.push(callbackUrl as string);
      } else {
        setError('Invalid User or password');
        console.log(error);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error?.message);
    }
  };

  return (
    <>
      <div className={cx('auth__form')}>
        <ConfigProvider
          theme={{
            components: {
              Form: {
                itemMarginBottom: 10,
                // verticalLabelPadding: '0 0 0',
                labelFontSize: 12,
                labelColor: 'rgb(133, 133, 133)'
              }
            }
          }}
        >
          <Form
            onFinish={handleLogin}
            layout='vertical'
            autoComplete='off'
          >
            <Form.Item>
              <h1 className={cx('auth__title')}>Login {session?.user?.email} </h1>
              <p className={cx('auth_subtitle')}>Access to your farm</p>
            </Form.Item>

            <Form.Item
              name='siteId'
              label='SiteId'
              rules={[{ required: false }]}
            >
              <Input size='large' />
            </Form.Item>
            <Form.Item
              name='userName'
              label='UserName'
              rules={[
                { required: true },
                {
                  type: 'string',
                  message: 'UserName is not valid'
                }
              ]}
            >
              <Input size='large' />
            </Form.Item>

            <Form.Item
              name='password'
              label='Password'
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password size='large' />
            </Form.Item>

            <Form.Item>
              <Row className={cx('form_btn')}>
                <Col span={12}>
                  {error && <p className={cx('auth__error')}>{error}</p>}

                  <Button
                    type='primary'
                    htmlType='submit'
                    size='large'
                    className={cx('auth__btn')}
                    disabled={loading ? true : false}
                  >
                    {loading ? <Loading userState={status} /> : 'Login'}
                  </Button>
                </Col>
                <Col span={12}>
                  <a
                    className={cx('login_form_forgot')}
                    href=''
                  >
                    Forgot password
                  </a>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <p>
                Have an account yet? <Link href={REGISTER_PATH}>Click here</Link>{' '}
              </p>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </>
  );
};

export default LoginForm;
