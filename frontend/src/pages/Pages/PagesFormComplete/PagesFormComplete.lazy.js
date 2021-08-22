import React, { lazy, Suspense } from 'react';

const LazyPagesFormComplete = lazy(() => import('./PagesFormComplete'));

const PagesFormComplete = props => (
  <Suspense fallback={null}>
    <LazyPagesFormComplete {...props} />
  </Suspense>
);

export default PagesFormComplete;
