import React, { lazy, Suspense } from 'react';
import Spin from 'antd/es/spin';
import { join } from 'path';

const cache = {};

export function loaderFactory(filePath) {
  return function loader(importPath) {
    const path = join(filePath, importPath);
    const Component = lazy(() => {
      cache[path] ||= import(path);
      return cache[path];
    });
    return (
      <Suspense fallback={<Spin />}>
        <Component />
      </Suspense>
    );
  };
}
