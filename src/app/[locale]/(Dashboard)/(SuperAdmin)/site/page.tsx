'use client';
import MapboxMap from '@/components/MapBox/mapbox';
import { Col, Flex, Row } from 'antd';
import * as React from 'react';
import styles from './site.module.scss';
import SearchConditionForm from './components/SearchCondition/searchConditionForm';

import { useTranslations } from 'next-intl';
import classNames from 'classnames/bind';
import BreadcrumbComponent from '../subscription/components/Breadcrumb/breadCrumb';
const cx = classNames.bind(styles);

type Props = {};

const SitePage = (props: Props) => {
  const [loading, setLoading] = React.useState(true);
  const handleMapLoading = () => setLoading(false);
  const [map, setMap] = React.useState<mapboxgl.Map>();
  const t = useTranslations('Disease');

  return (
    <>
      {/* <div>
        <MapboxMap
        // initialOptions={{ center: [38.0983, 55.7038] }}
        //onMapLoaded={setMap}
        // initialOptions={{ center: [38.0983, 55.7038] }}
        // onMapLoaded={handleMapLoading}
        />
      </div> */}
      <BreadcrumbComponent />

      <Row className='app-container'>
        <Col className='map-wrapper'>
          <MapboxMap />
        </Col>
      </Row>

      <ColoredLine text={t('search_condition')} />
      <div>
        <SearchConditionForm
        // handleDate={handleDate}
        // handleKeyword={handleKeyword}
        // searchAction={searchAction}
        />
      </div>
      <ColoredLine text={t('search_result')} />
      {/* <div className='app-container'>
        <div className='map-wrapper'>
          <MapboxMap
  
          />
        </div>
      
      </div> */}
    </>
  );
};
interface ColoredLineProps {
  text: string;
}
const ColoredLine: React.FC<ColoredLineProps> = ({ text }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div
      className={cx('disease__line')}
      style={{ flex: 1 }}
    />
    <span style={{ marginLeft: 5, marginRight: 5 }}>{text}</span>
    <div
      className={cx('disease__line')}
      style={{ flex: 12 }}
    />
  </div>
);
export default SitePage;
