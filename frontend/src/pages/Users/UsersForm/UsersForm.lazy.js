import React, { lazy, Suspense } from 'react';

const LazyUsersForm = lazy(() => import('./UsersForm'));

const UsersForm = props => (
  <Suspense fallback={null}>
    <LazyUsersForm {...props} />
  </Suspense>
);

export default UsersForm;
