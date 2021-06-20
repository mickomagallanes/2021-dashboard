import React, { lazy, Suspense } from 'react';

const LazyRouteRolesForm = lazy(() => import('./RouteRolesForm'));

const RouteRolesForm = props => (
  <Suspense fallback={null}>
    <LazyRouteRolesForm {...props} />
  </Suspense>
);

export default RouteRolesForm;
