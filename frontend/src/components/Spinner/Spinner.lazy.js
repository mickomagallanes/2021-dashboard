import React, { lazy, Suspense } from 'react';

const LazySpinner = lazy(() => import('./Spinner'));

const Spinner = props => (
  <Suspense fallback={null}>
    <LazySpinner {...props} />
  </Suspense>
);

export default Spinner;
