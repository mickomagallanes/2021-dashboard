import React, { lazy, Suspense } from 'react';

const LazySubPagesForm = lazy(() => import('./SubPagesForm'));

const SubPagesForm = props => (
  <Suspense fallback={null}>
    <LazySubPagesForm {...props} />
  </Suspense>
);

export default SubPagesForm;
