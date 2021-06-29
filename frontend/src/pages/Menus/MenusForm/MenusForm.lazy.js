import React, { lazy, Suspense } from 'react';

const LazyMenusForm = lazy(() => import('./MenusForm'));

const MenusForm = props => (
  <Suspense fallback={null}>
    <LazyMenusForm {...props} />
  </Suspense>
);

export default MenusForm;
