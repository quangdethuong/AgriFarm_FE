'use client';
import { ROLES } from '@/constants/roles';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

import Loader from '@/components/Loader/Loader';
import DashBoardLayout from '../layoutMiddleware';
import DeniedPage from '../../(Result)/denied/page';
import { useRouter } from '@/navigation';
import { DENIED_PATH } from '@/constants/routes';

type Props = {
  children: React.ReactNode;
};

export default function LayoutRoleManager({ children }: Props) {
  const { data: session, status } = useSession();
  const userRole = session?.user?.userInfo?.role as ROLES;
  const router = useRouter();

  if (status === 'loading') {
    return (
      <Loader
        fullScreen
        spinning
      />
    );
  } else {
    if (userRole !== ROLES.ADMIN && userRole !== ROLES.MANAGER && userRole !== ROLES.SUPER_ADMIN) {
      return (
        <>
          <DeniedPage />
        </>
      );
    } else {
      return (
        <>
          <DashBoardLayout>{children}</DashBoardLayout>
        </>
      );
    }
  }
}
