import React, { lazy, Suspense } from 'react';

const LazyRoutes = lazy(() => import('./Routes'));

const Routes = props => (
  <Suspense fallback={null}>
    <LazyRoutes {...props} />
  </Suspense>
);

export default Routes;
