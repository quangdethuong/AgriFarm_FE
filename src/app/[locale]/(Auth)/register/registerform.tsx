'use client';
import { Form, Input, Button, Row, Col, ConfigProvider, Checkbox } from 'antd';
import styles from '../auth.module.scss';
import classNames from 'classnames/bind';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { registerAsyncApi, resetState } from '@/redux/features/common-slice';
import { useEffect, useState } from 'react';
import Loading from '@/components/LoadingBtn/Loading';
import { useRouter } from 'next/navigation';
import { LOGIN_PATH, SUCCESS_PATH } from '@/constants/routes';
import FormRegisterValues from '@/types/register';
import { useTranslations } from 'next-intl';
import { MessageError } from '@/constants/message';
import {
  STATUS_ACCEPTED,
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_SERVER_ERROR
} from '@/constants/https';
import Admin from '@/types/admin';
import UseAxiosAuth from '@/utils/axiosClient';
import paymentApi from '@/services/Payment/paymentApi';

const cx = classNames.bind(styles);

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const { userRegister } = useAppSelector(state => state.authReducer);
  const t = useTranslations('Message');
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string>('');
  const http = UseAxiosAuth();
  const [errorEmail, setErrorEmail] = useState<string>('');
  const [errorFCode, setErrorFCode] = useState<string>('');
  const [errorFName, setErrorFName] = useState<string>('');
  const handleSetStateError = async () => {
    setErrorEmail('');
    setErrorFCode('');
    setErrorFName('');
    const messageError = userRegister?.message as string;
    console.log('messageError', messageError);
  };
  useEffect(() => {
    if (userRegister?.status === STATUS_ACCEPTED) {
      dispatch(resetState());
      setError('');
      setErrorEmail('');
      setErrorFCode('');
      setErrorFName('');
      router.push(SUCCESS_PATH);

      const eeee = userRegister?.data as Admin;
      console.log('eeee', eeee.id);
    }
    if (userRegister?.status === STATUS_BAD_REQUEST) {
      const messageError = userRegister?.message as string;
      //setError(t('allErrorRegis').replace(/\./g, '.\n'));
      if (messageError.includes(MessageError.FARM_NAME_EXIST)) {
        setErrorFName(t('farmName_error'));
        setErrorFCode('');
        setErrorEmail('');
      }

      if (messageError.includes(MessageError.FARM_CODE_EXIST)) {
        setErrorFCode(t('farmCode_error'));
        setErrorEmail('');
        setErrorFName('');
      }

      if (messageError.includes(MessageError.EMAIL_EXIST)) {
        setErrorEmail(t('email_error'));

        setErrorFCode('');
        setErrorFName('');
      }
    }
  }, [userRegister, router, dispatch, t]);

  const handleRegister = async (data: FormRegisterValues) => {
    console.log('data register: ', data);
    console.log('errorEmail: ', errorEmail);

    const actionAsyncThunk = registerAsyncApi(data);
    dispatch(actionAsyncThunk);
    console.log("Start api thanh toan");
    const res = await paymentApi(http);
    console.log(res);
    window.location.href = res?.data.paymentUrl;
  };

  return (
    <>
      <div className={cx('auth__form')}>
        <Form.Item
          style={{
            marginBottom: '5px'
          }}
        >
          <h1 className={cx('auth__title')}>Register Farm</h1>
          <p className={cx('auth_subtitle')}>
            Register information to receive a farm management account
          </p>
        </Form.Item>

        <ConfigProvider
          theme={{
            components: {
              Form: {
                itemMarginBottom: 10,
                verticalLabelPadding: '0 0 0',
                labelFontSize: 12,
                labelColor: 'rgb(133, 133, 133)'
              }
            }
          }}
        >
          <Form
            onFinish={handleRegister}
            layout='vertical'
            autoComplete='off'
          >
            <Form.Item
              name='email'
              label='Email'
              rules={[
                { required: true },
                {
                  type: 'email',
                  message: 'Email is not valid'
                }
              ]}
            >
              <Input
                onChange={handleSetStateError}
                size='middle'
              />
            </Form.Item>
            {errorEmail && <p className={cx('auth__error')}>{errorEmail}</p>}

            <Form.Item
              name='address'
              label='Address'
              rules={[{ required: true }]}
            >
              <Input size='middle' />
            </Form.Item>

            <Form.Item
              name='siteCode'
              label='Farm code'
              rules={[{ required: true }]}
            >
              <Input
                onChange={handleSetStateError}
                size='middle'
              />
            </Form.Item>
            {errorFCode && <p className={cx('auth__error')}>{errorFCode}</p>}

            <Form.Item
              name='siteName'
              label='Farm Name'
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input
                onChange={handleSetStateError}
                size='middle'
              />
            </Form.Item>
            {errorFName && <p className={cx('auth__error')}>{errorFName}</p>}

            <Form.Item
              name='firstName'
              label='First Name'
              rules={[{ required: true }]}
            >
              <Input size='middle' />
            </Form.Item>

            <Form.Item
              name='lastName'
              label='Last name'
              rules={[{ required: true }]}
            >
              <Input size='middle' />
            </Form.Item>

            <Form.Item
              name='phone'
              label='Phone'
              rules={[{ required: true }]}
            >
              <Input size='middle' />
            </Form.Item>

            <Form.Item>
              <Row
                align='middle'
                className={cx('form_btn')}
              >
                <Col span={24}>
                  <Form.Item
                    name='agreement'
                    valuePropName='checked'
                    rules={[
                      {
                        validator: (_, value) =>
                          value
                            ? Promise.resolve()
                            : Promise.reject(new Error('Should accept agreement'))
                      }
                    ]}
                  >
                    <Checkbox>
                      Agree to our{' '}
                      <a
                        href=''
                        target=''
                      >
                        Terms
                      </a>{' '}
                      of use and{' '}
                      <a
                        href=''
                        target=''
                      >
                        Privacy Policy
                      </a>{' '}
                    </Checkbox>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  {error && <p className={cx('auth__error')}>{error}</p>}
                  <Button
                    type='primary'
                    htmlType='submit'
                    size='large'
                    className={cx('auth__btn_regis')}
                    disabled={userRegister?.message === 'loading' ? true : false}
                  >
                    {userRegister?.message === 'loading' ? (
                      <Loading userState='loading' />
                    ) : (
                      'Register'
                    )}
                  </Button>
                </Col>
              </Row>
            </Form.Item>

            <Form.Item>
              <p style={{ marginTop: '0', marginBottom: '5px' }}>
                Have an account yet? <a href={LOGIN_PATH}>Click here</a>
              </p>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
    </>
  );
};

export default RegisterForm;
