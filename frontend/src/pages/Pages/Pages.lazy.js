import React, { lazy, Suspense } from 'react';

const LazyPages = lazy(() => import('./Pages'));

const Pages = props => (
  <Suspense fallback={null}>
    <LazyPages {...props} />
  </Suspense>
);

export default Pages;
