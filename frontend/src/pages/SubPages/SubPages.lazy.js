import React, { lazy, Suspense } from 'react';

const LazySubPages = lazy(() => import('./SubPages'));

const SubPages = props => (
  <Suspense fallback={null}>
    <LazySubPages {...props} />
  </Suspense>
);

export default SubPages;
