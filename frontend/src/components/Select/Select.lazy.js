import React, { lazy, Suspense } from 'react';

const LazySelect = lazy(() => import('./Select'));

const Select = props => (
  <Suspense fallback={null}>
    <LazySelect {...props} />
  </Suspense>
);

export default Select;
