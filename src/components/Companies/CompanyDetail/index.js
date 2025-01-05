import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'antd';

function simplifyList(maybeList) {
  if (Array.isArray(maybeList)) {
    return maybeList.filter(Boolean).join(' ');
  }
  return maybeList;
}

function CompanyDetail({ mainDataObject, showAll = false }) {
  return (
    <List
      itemLayout="vertical"
      dataSource={(
        mainDataObject?.staticFields || []
      ).map((staticField) => ({
        name: staticField?.name || '',
        display: staticField?.display || '',
      })).concat(showAll
        ? (
          mainDataObject?.dynamicFields || []
        ).map((dynamicField) => {
          switch (dynamicField?.data?.length || 0) {
            case 0:
              return null;
            case 1:
              return {
                name: dynamicField?.name || '',
                display: dynamicField.data[0]?.display
                  ? `${
                    simplifyList(dynamicField.data[0].display)
                  }${dynamicField.data[0]?.isEncrypted ? ' (Encrypted)' : ''}`
                  : '',
              };
            default:
              return {
                name: dynamicField?.name || '',
                children: (dynamicField.data || []).map((formObject, index) => ({
                  name: dynamicField?.name ? `${dynamicField.name} ${index + 1}` : index + 1,
                  display: formObject?.display
                    ? `${simplifyList(formObject.display)}${formObject.isEncrypted ? ' (Encrypted)' : ''}`
                    : '',
                })),
              };
          }
        }).filter(Boolean)
        : [])}
      renderItem={({ name, display, children }) => (
        <List.Item key={name}>
          <List.Item.Meta title={name} description={display}>
            {children ? (
              <List
                itemLayout="vertical"
                dataSource={children}
                renderItem={({ name: subName, display: subDisplay }) => (
                  <List.Item key={subName}>
                    <List.Item.Meta title={subName} description={subDisplay} />
                  </List.Item>
                )}
              />
            ) : null}
          </List.Item.Meta>
        </List.Item>
      )}
    />
  );
}

CompanyDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mainDataObject: PropTypes.any.isRequired,
  showAll: PropTypes.bool.isRequired,
};

export default CompanyDetail;
