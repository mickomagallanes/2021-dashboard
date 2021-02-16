import React, { lazy, Suspense } from 'react';

const LazyUser = lazy(() => import('./Users'));

const Users = props => (
  <Suspense fallback={null}>
    <LazyUser {...props} />
  </Suspense>
);

export default Users;
