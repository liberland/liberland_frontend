import React from 'react';
import Spin from 'antd/es/spin';
import Flex from 'antd/es/flex';

function LoadingComponent() {
  return (
    <Flex justify="center" align="center">
      <Spin size="large" />
    </Flex>
  );
}

export default LoadingComponent;
