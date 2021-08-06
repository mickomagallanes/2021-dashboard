import React, { lazy, Suspense } from 'react';

const LazyEmployeePositions = lazy(() => import('./EmployeePositions'));

const EmployeePositions = props => (
  <Suspense fallback={null}>
    <LazyEmployeePositions {...props} />
  </Suspense>
);

export default EmployeePositions;
