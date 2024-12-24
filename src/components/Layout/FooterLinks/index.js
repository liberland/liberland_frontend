import React, { useMemo } from 'react';
import List from 'antd/es/list';
import Collapse from 'antd/es/collapse';
import Menu from 'antd/es/menu';
import { useMediaQuery } from 'usehooks-ts';
import { footerLinks } from '../../../constants/navigationList';

function FooterLinks() {
  const footerList = useMemo(() => Object.entries(footerLinks), []);
  const isBiggerThanSmallScreen = useMediaQuery('(min-width: 768px)');

  return (
    <List
      grid={{ gutter: 10, column: footerList.length }}
      dataSource={footerList}
      renderItem={([title, links]) => (
        <Collapse
          key={title}
          expandIcon={isBiggerThanSmallScreen ? () => null : undefined}
          activeKey={isBiggerThanSmallScreen ? [title] : undefined}
          dataSource={[{
            key: title,
            label: title,
            children: (
              <Menu
                mode="inline"
                items={Object.entries(links).map(([name, url]) => ({
                  label: name,
                  key: name,
                  onClick: () => {
                    window.location.href = url;
                  },
                }))}
              />
            ),
          }]}
        />
      )}
    />
  );
}

export default FooterLinks;
