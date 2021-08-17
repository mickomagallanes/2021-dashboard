import React, { lazy, Suspense } from 'react';

const LazyEmployeesFormBulk = lazy(() => import('./EmployeesFormBulk'));

const EmployeesFormBulk = props => (
  <Suspense fallback={null}>
    <LazyEmployeesFormBulk {...props} />
  </Suspense>
);

export default EmployeesFormBulk;
