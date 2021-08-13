import React, { lazy, Suspense } from 'react';

const LazyEmployeePositionsForm = lazy(() => import('./EmployeePositionsForm'));

const EmployeePositionsForm = props => (
  <Suspense fallback={null}>
    <LazyEmployeePositionsForm {...props} />
  </Suspense>
);

export default EmployeePositionsForm;
