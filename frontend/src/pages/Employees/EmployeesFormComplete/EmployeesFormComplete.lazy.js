import React, { lazy, Suspense } from 'react';

const LazyEmployeesFormComplete = lazy(() => import('./EmployeesFormComplete'));

const EmployeesFormComplete = props => (
  <Suspense fallback={null}>
    <LazyEmployeesFormComplete {...props} />
  </Suspense>
);

export default EmployeesFormComplete;
