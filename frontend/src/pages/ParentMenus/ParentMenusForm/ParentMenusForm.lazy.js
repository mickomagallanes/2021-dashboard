import React, { lazy, Suspense } from 'react';

const LazyParentMenusForm = lazy(() => import('./ParentMenusForm'));

const ParentMenusForm = props => (
  <Suspense fallback={null}>
    <LazyParentMenusForm {...props} />
  </Suspense>
);

export default ParentMenusForm;
