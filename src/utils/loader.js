import React, { lazy, Suspense } from 'react';
import Spin from 'antd/es/spin';

const cache = {};

export function loader(imported) {
  const key = imported.toString();
  const Component = lazy(async () => {
    const loaded = await imported();
    cache[key] = loaded.default;
    return loaded;
  });
  return function render() {
    const Cached = cache[key];
    if (Cached) {
      return <Cached />;
    }
    return (
      <Suspense fallback={<Spin />}>
        <Component />
      </Suspense>
    );
  };
}
