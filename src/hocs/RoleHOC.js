/* eslint-disable react/prop-types */
// LIBS
import React from 'react';

const Role = ({
  access,
  roles,
  children,
}) => {
  if (!access) return <>{children}</>;
  if (Array.isArray(access) && access.some((role) => roles[role])) return <>{children}</>;
  if (roles[access]) return <>{children}</>;

  return null;
};

export default Role;
