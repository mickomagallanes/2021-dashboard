import React, { lazy, Suspense } from 'react';

const LazyButton = lazy(() => import('./Button'));

const Button = props => (
  <Suspense fallback={null}>
    <LazyButton {...props} />
  </Suspense>
);

export default Button;
