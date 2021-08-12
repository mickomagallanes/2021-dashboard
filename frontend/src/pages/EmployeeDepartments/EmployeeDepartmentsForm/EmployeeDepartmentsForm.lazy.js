import React, { lazy, Suspense } from 'react';

const LazyEmployeeDepartmentsForm = lazy(() => import('./EmployeeDepartmentsForm'));

const EmployeeDepartmentsForm = props => (
  <Suspense fallback={null}>
    <LazyEmployeeDepartmentsForm {...props} />
  </Suspense>
);

export default EmployeeDepartmentsForm;
