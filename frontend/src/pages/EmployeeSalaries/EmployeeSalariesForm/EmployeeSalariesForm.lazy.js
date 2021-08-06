import React, { lazy, Suspense } from 'react';

const LazyEmployeeSalariesForm = lazy(() => import('./EmployeeSalariesForm'));

const EmployeeSalariesForm = props => (
  <Suspense fallback={null}>
    <LazyEmployeeSalariesForm {...props} />
  </Suspense>
);

export default EmployeeSalariesForm;
