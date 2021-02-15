import React, { lazy, Suspense } from 'react';

const LazyTable = lazy(() => import('./Table'));

const Table = props => (
  <Suspense fallback={null}>
    <LazyTable {...props} />
  </Suspense>
);

export default Table;
