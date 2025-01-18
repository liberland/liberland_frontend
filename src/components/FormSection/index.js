import React from 'react';
import PropTypes from 'prop-types';
import Flex from 'antd/es/flex';
import Title from 'antd/es/typography/Title';
import { useMediaQuery } from 'usehooks-ts';

function FormSection({
  children,
  extra,
  title,
}) {
  const isLargerThanWideScreen = useMediaQuery('(min-width: 1200px)');
  return (
    <Flex vertical gap="15px">
      <Flex wrap gap="15px" justify="space-between" align="center">
        <Title level={2}>
          {title}
        </Title>
        {isLargerThanWideScreen && extra && (
          <Flex wrap gap="15px">
            {extra}
          </Flex>
        )}
      </Flex>
      {children}
      {!isLargerThanWideScreen && extra && (
        <Flex wrap gap="15px" justify="end">
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
