import React, { lazy, Suspense } from 'react';

const LazyTextField = lazy(() => import('./TextField'));

const TextField = props => (
  <Suspense fallback={null}>
    <LazyTextField {...props} />
  </Suspense>
);

export default TextField;
