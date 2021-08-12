import React, { lazy, Suspense } from 'react';

const LazyEmployeesForm = lazy(() => import('./EmployeesForm'));

const EmployeesForm = props => (
  <Suspense fallback={null}>
    <LazyEmployeesForm {...props} />
  </Suspense>
);

export default EmployeesForm;
