import React, { lazy, Suspense } from 'react';

const LazyEmployeeSalaries = lazy(() => import('./EmployeeSalaries'));

const EmployeeSalaries = props => (
  <Suspense fallback={null}>
    <LazyEmployeeSalaries {...props} />
  </Suspense>
);

export default EmployeeSalaries;
