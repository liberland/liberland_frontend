import React from 'react';
import { Sider as SiderInternal } from 'antd/es/layout/layout';
import { useMediaQuery } from 'usehooks-ts';
import UrlMenu from '../UrlMenu';

function Sider() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');

  return isBiggerThanSmallScreen ? (
    <SiderInternal width={250} breakpoint="md" collapsedWidth="60px">
      <UrlMenu />
    </SiderInternal>
  ) : null;
}

export default Sider;
