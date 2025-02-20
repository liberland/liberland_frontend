import React from 'react';
import Switch from 'antd/es/switch';
import MoonFilled from '@ant-design/icons/MoonFilled';
import SunOutlined from '@ant-design/icons/SunOutlined';
import { useModeContext } from '../AntdProvider';

export default function ModeSwitch() {
  const { isDarkMode, setIsDarkMode } = useModeContext();
  return (
    <Switch
      checkedChildren={<MoonFilled aria-label="Dark mode" />}
      unCheckedChildren={<SunOutlined aria-label="Light mode" />}
      checked={isDarkMode}
      onChange={(checked) => setIsDarkMode(checked)}
    />
  );
}
