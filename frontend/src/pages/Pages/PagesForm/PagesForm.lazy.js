import React, { lazy, Suspense } from 'react';

const LazyPagesForm = lazy(() => import('./PagesForm'));

const PagesForm = props => (
  <Suspense fallback={null}>
    <LazyPagesForm {...props} />
  </Suspense>
);

export default PagesForm;
