import React, { lazy, Suspense } from 'react';

const LazyPagesFormBulk = lazy(() => import('./PagesFormBulk'));

const PagesFormBulk = props => (
  <Suspense fallback={null}>
    <LazyPagesFormBulk {...props} />
  </Suspense>
);

export default PagesFormBulk;
