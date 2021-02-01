import React, { lazy, Suspense } from 'react';

const LazySidebar = lazy(() => import('./Sidebar'));

const Sidebar = props => (
  <Suspense fallback={null}>
    <LazySidebar {...props} />
  </Suspense>
);

export default Sidebar;
