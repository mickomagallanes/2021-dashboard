import React, { lazy, Suspense } from 'react';

const LazyRolesForm = lazy(() => import('./RolesForm'));

const RolesForm = props => (
  <Suspense fallback={null}>
    <LazyRolesForm {...props} />
  </Suspense>
);

export default RolesForm;
