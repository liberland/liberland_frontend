import React, { lazy, Suspense } from 'react';
import Spin from 'antd/es/spin';

export function loader(imported) {
  const Component = lazy(imported);
  return function render() {
    return (
      <Suspense fallback={<Spin />}>
        <Component />
      </Suspense>
    );
  };
}
