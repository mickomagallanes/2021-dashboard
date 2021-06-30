import React, { lazy, Suspense } from 'react';

const LazySelectFormField = lazy(() => import('./SelectFormField'));

const SelectFormField = props => (
  <Suspense fallback={null}>
    <LazySelectFormField {...props} />
  </Suspense>
);

export default SelectFormField;
