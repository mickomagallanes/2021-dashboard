import React, { lazy, Suspense } from 'react';

const LazyEmployeeDepartments = lazy(() => import('./EmployeeDepartments'));

const EmployeeDepartments = props => (
  <Suspense fallback={null}>
    <LazyEmployeeDepartments {...props} />
  </Suspense>
);

export default EmployeeDepartments;
