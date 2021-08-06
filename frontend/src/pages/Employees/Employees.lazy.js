import React, { lazy, Suspense } from 'react';

const LazyEmployees = lazy(() => import('./Employees'));

const Employees = props => (
  <Suspense fallback={null}>
    <LazyEmployees {...props} />
  </Suspense>
);

export default Employees;
