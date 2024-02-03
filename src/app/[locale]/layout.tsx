import { ReduxProvider } from '@/redux/provider';

import Providers from '@/components/Provider/Provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { roboto } from '@/styles/base/font';
import '../../styles/global.scss';
import { Metadata } from 'next';
import { unstable_setRequestLocale } from 'next-intl/server';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ConfigProvider } from 'antd';
import theme from '@/lib/theme/themeConfig';
export const metadata: Metadata = {
  title: 'AgriFarm',
  description: 'Generated by create next app'
};
type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params: { locale } }: Props) {
  // unstable_setRequestLocale(locale);
  const messages = useMessages();
  return (
    <html
      lang={locale}
      className={`${roboto.variable}`}
    >
      <ReduxProvider>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
        >
          <AntdRegistry>
            <Providers>
              <body suppressHydrationWarning={true}>
                <main>{children}</main>
              </body>
            </Providers>
          </AntdRegistry>
        </NextIntlClientProvider>
      </ReduxProvider>
    </html>
  );
}
