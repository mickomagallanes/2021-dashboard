import React, { lazy, Suspense } from 'react';

const LazyPageRoles = lazy(() => import('./PageRoles'));

const PageRoles = props => (
  <Suspense fallback={null}>
    <LazyPageRoles {...props} />
  </Suspense>
);

export default PageRoles;
