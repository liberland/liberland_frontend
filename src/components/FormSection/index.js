import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';

function FormSection({
  children,
  extra,
  title,
}) {
  return (
    <Flex vertical gap="15px">
      <Flex wrap gap="15px" justify="space-between" align="center">
        <Title level={2}>
          {title}
        </Title>
      </Flex>
      {children}
      {extra && (
        <Flex wrap gap="15px" justify="start">
          {extra}
        </Flex>
      )}
    </Flex>
  );
}

FormSection.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  extra: PropTypes.node,
};

export default FormSection;
