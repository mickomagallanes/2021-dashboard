import React, { lazy, Suspense } from 'react';

const LazyTextFormField = lazy(() => import('./TextFormField'));

const TextFormField = props => (
  <Suspense fallback={null}>
    <LazyTextFormField {...props} />
  </Suspense>
);

export default TextFormField;
