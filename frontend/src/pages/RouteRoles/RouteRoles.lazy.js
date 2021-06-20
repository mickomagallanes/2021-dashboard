import React, { lazy, Suspense } from 'react';

const LazyRouteRoles = lazy(() => import('./RouteRoles'));

const RouteRoles = props => (
  <Suspense fallback={null}>
    <LazyRouteRoles {...props} />
  </Suspense>
);

export default RouteRoles;
