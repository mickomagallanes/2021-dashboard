import React, { lazy, Suspense } from 'react';

const LazyRoutesForm = lazy(() => import('./RoutesForm'));

const RoutesForm = props => (
  <Suspense fallback={null}>
    <LazyRoutesForm {...props} />
  </Suspense>
);

export default RoutesForm;
