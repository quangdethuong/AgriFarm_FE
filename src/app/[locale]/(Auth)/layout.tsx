'use client';
import React, { Suspense, useEffect, useState } from 'react';

import { Col, Layout, Row } from 'antd';
import loginBanner from '~/loginbanner.png';
import signUpBanner from '~/signup-img.png';
import Image from 'next/image';

import { useSession } from 'next-auth/react';
import Loader from '@/components/Loader/Loader';
import { redirect, usePathname } from '@/navigation';
import LogoImage from '@/components/Logo/LogoImage';
import { useSearchParams, useRouter } from 'next/navigation';
import { DASH_BOARD_PATH } from '@/constants/routes';
import { renderPath } from './login/loginform';
import { ROLES } from '@/constants/roles';
import MenuHeaderLocale from '../Layouts/MainLayout/MenuSider/MenuLocale';
import { useLocale } from 'next-intl';

const { Sider, Content } = Layout;

//  function DashBoardLayout({ children }: Props) {
//   const { data: session, status } = useSession();
//   const userRole = session?.user?.userInfo?.role as ROLES;

//   if (status === 'loading') {
//     return (
//       <Loader
//         fullScreen
//         spinning
//       />
//     );
//   }
//   // Choose the layout based on the user's role
//   const getLayout = () => {
//     switch (userRole) {
//       case ROLES.SUPER_ADMIN:
//         return <LayoutSuperAdmin>{children}</LayoutSuperAdmin>;
//       case ROLES.ADMIN:
//         return <LayoutAdmin>{children}</LayoutAdmin>;
//       case ROLES.MEMBER:
//         return <LayoutMember>{children}</LayoutMember>;
//       case ROLES.MANAGER:
//         return <LayoutManager>{children}</LayoutManager>;
//       default:
//         // Default layout for other roles
//         return <div>Lỗi rồi fix đi</div>;
//     }
//   };

//   return <>{getLayout()}</>;
// }

const AuthenticateTemplate = ({ children }: { children: React.ReactNode }) => {
  const path = usePathname();
  const locale = useLocale();
  const { data: session, status } = useSession();
  const userRole = session?.user?.userInfo?.role as ROLES;
  const isPath = path.startsWith('/login');
  const router = useRouter();

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || renderPath(userRole);
  const localeCallBack = `${'/' + locale}${callbackUrl}`;
  console.log('localeCallBack: ', localeCallBack);

  if (status === 'authenticated') {
    router.push(localeCallBack);
  } else {
    if (status === 'loading') {
      return (
        <Loader
          fullScreen
          spinning={true}
        />
      );
    }

    return (
      <Row className='disable_scroll'>
        <Col
          style={{
            height: '100vh',
            backgroundSize: 'cover'
          }}
          xs={24}
          sm={14}
          md={14}
          lg={14}
        >
          <Image
            src={isPath ? loginBanner : signUpBanner}
            alt='Rice'
            priority
            quality={100}
            sizes='100vw'
            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          />
        </Col>
        <div className=''>
          <LogoImage />
        </div>
        <MenuHeaderLocale path={path} />

        <Col
          xs={24}
          sm={10}
          md={10}
          lg={10}
          className='mt_auto'
        >
          <Content>{children}</Content>
        </Col>
      </Row>
    );
  }
};

export default AuthenticateTemplate;
