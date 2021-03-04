import React, { lazy, Suspense } from 'react';

const LazyPagination = lazy(() => import('./Pagination'));

const Pagination = props => (
  <Suspense fallback={null}>
    <LazyPagination {...props} />
  </Suspense>
);

export default Pagination;
