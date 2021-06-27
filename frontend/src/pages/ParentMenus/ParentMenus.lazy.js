import React, { lazy, Suspense } from 'react';

const LazyParentMenus = lazy(() => import('./ParentMenus'));

const ParentMenus = props => (
  <Suspense fallback={null}>
    <LazyParentMenus {...props} />
  </Suspense>
);

export default ParentMenus;
