import React from 'react';
import { useMediaQuery } from 'usehooks-ts';
import DesktopHeader from '../DesktopHeader';
import MobileHeader from '../MobileHeader';

function Header() {
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');
  return isBiggerThanSmallScreen ? <DesktopHeader /> : <MobileHeader />;
}

export default Header;
