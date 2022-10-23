/* eslint-disable react/prop-types */
// LIBS
import React from 'react';

const Role = ({
  access,
  roles,
  children,
}) => {
  console.log('access')
  console.log(access)
  console.log('roles')
  console.log(roles)
  console.log('children')
  console.log(children)
  if (!access) return <>{children}</>;
  if (Array.isArray(access) && access.some((role) => roles[role])) return <>{children}</>;
  if (roles[access]) return <>{children}</>;

  console.log('returning null')
  return null;
};

export default Role;
