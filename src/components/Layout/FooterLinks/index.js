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
      grid={isBiggerThanSmallScreen ? { gutter: 16 } : undefined}
      dataSource={footerList}
      renderItem={([title, links]) => {
        const list = Object.entries(links);
        return (
          <Collapse
            key={title}
            expandIcon={isBiggerThanSmallScreen ? () => null : undefined}
            activeKey={isBiggerThanSmallScreen ? [title] : undefined}
            items={[{
              key: title,
              label: (
                <div className="description">{title}</div>
              ),
              children: (
                <Menu
                  mode="inline"
                  items={list.map(([name, url]) => ({
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
        );
      }}
    />
  );
}

export default FooterLinks;
