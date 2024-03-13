'use client';
import React, { Suspense, useState } from 'react';

import { Layout, Badge, Button } from 'antd';

const { Content, Sider } = Layout;

import themeConfig from '@/lib/theme/themeConfig';

import Loader from '@/components/Loader/Loader';
import SAdminSider from '../../Layouts/SAdmin/Sider/SASider';
import { usePathname } from '@/navigation';
import BreadcrumbComponent from '../(Admin)/staff/components/Breadcrumb/breadCrumb';

export default function LayoutSuperAdmin({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  // if (status === 'loading') {
  //   return (
  //     <Loader
  //       fullScreen
  //       spinning
  //     />
  //   );
  // }
  return themeConfig(
    <Layout className='layout'>
      <Layout
        className='site_layout m_h'
        hasSider
      >
        <Sider
          width={255}
          theme='light'
          className='sidebar'
          // collapsible
          // collapsed={collapsed}
          // onCollapse={value => setCollapsed(value)}
        >
          {/* <RenderSideBar roles={session?.user?.userInfo?.role as ROLES} /> */}
          <SAdminSider path={pathName} />
        </Sider>
        <Content className='site_layout_background'>
          <Suspense
            fallback={
              <Loader
                fullScreen
                spinning
              />
            }
          >
            {children}
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}
