import React from 'react';
import PropTypes from 'prop-types';
import Tag from 'antd/es/tag';
import CheckCircleFilled from '@ant-design/icons/CheckCircleFilled';
import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined';
import styles from './styles.module.scss';

function CompanyEditable({
  editableByRegistrar,
}) {
  return editableByRegistrar.isTrue ? (
    <Tag icon={<CheckCircleFilled />} className={styles.editable} color="success">
      Editable by registrar
    </Tag>
  ) : (
    <Tag icon={<CloseCircleOutlined />} className={styles.editable} color="error">
      Not editable by registrar
    </Tag>
  );
}

CompanyEditable.propTypes = {
  editableByRegistrar: PropTypes.shape({
    isTrue: PropTypes.bool,
  }).isRequired,
};

export default CompanyEditable;
