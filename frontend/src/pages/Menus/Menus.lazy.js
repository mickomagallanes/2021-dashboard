import React, { lazy, Suspense } from 'react';

const LazyMenus = lazy(() => import('./Menus'));

const Menus = props => (
  <Suspense fallback={null}>
    <LazyMenus {...props} />
  </Suspense>
);

export default Menus;
