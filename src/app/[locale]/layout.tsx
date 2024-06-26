import { ReduxProvider } from '@/redux/provider';

import Providers from '@/components/Provider/Provider';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { roboto } from '@/styles/base/font';
import '../../styles/global.scss';
import { Metadata } from 'next';
import 'mapbox-gl/dist/mapbox-gl.css';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export const metadata: Metadata = {
  title: 'AgriFarm',
  description: 'AgriFarm Rice Cultivation'
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
