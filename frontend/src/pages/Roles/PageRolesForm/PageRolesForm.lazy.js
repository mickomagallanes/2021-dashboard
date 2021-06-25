import React, { lazy, Suspense } from 'react';

const LazyPageRolesForm = lazy(() => import('./PageRolesForm'));

const PageRolesForm = props => (
  <Suspense fallback={null}>
    <LazyPageRolesForm {...props} />
  </Suspense>
);

export default PageRolesForm;
