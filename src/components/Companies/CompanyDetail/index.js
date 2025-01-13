import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Descriptions from 'antd/es/descriptions';
import List from 'antd/es/list';
import styles from './styles.module.scss';

function simplifyList(maybeList) {
  if (Array.isArray(maybeList)) {
    return maybeList.filter(Boolean).join(' ');
  }
  return maybeList;
}

function CompanyDetail({ mainDataObject, showAll = false }) {
  const details = useMemo(() => (
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
    : []), [mainDataObject, showAll]);

  return (
    <Descriptions layout="vertical" size="small" className={styles.details}>
      {details.map(({ name, display, children }) => (
        <Descriptions.Item label={name}>
          {children?.length ? (
            <List
              itemLayout="vertical"
              dataSource={children}
              renderItem={({ name: subName, display: subDisplay }) => (
                <List.Item>
                  <List.Item.Meta title={subName} description={subDisplay} />
                </List.Item>
              )}
            />
          ) : (display || 'None')}
        </Descriptions.Item>
      ))}
    </Descriptions>
  );
}

CompanyDetail.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  mainDataObject: PropTypes.any.isRequired,
  showAll: PropTypes.bool.isRequired,
};

export default CompanyDetail;
