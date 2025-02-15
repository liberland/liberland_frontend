import React, { lazy, Suspense } from 'react';
import Alert from 'antd/es/alert';
import Spin from 'antd/es/spin';

const cache = {};

export function loader(imported) {
  const key = imported.toString();
  const Component = lazy(async () => {
    const hasLoadedBefore = localStorage.getItem('refreshed') || false;
    try {
      const loaded = await imported();
      localStorage.removeItem('refreshed');
      cache[key] = loaded.default;
      return loaded;
    } catch (e) {
      if (!hasLoadedBefore) {
        localStorage.setItem('refreshed', 'true');
        window.location.reload();
        return null;
      }
      throw e;
    }
  });
  return function render() {
    const Cached = cache[key];
    if (Cached) {
      return (
        <Alert.ErrorBoundary>
          <Cached />
        </Alert.ErrorBoundary>
      );
    }
    return (
      <Suspense fallback={<Spin />}>
        <Alert.ErrorBoundary>
          <Component />
        </Alert.ErrorBoundary>
      </Suspense>
    );
  };
}
