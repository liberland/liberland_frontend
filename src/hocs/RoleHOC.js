/* eslint-disable react/prop-types */

function Role({
  access,
  roles,
  children,
}) {
  if (!access) return children;
  if (Array.isArray(access) && Array.isArray(roles) && access.some((role) => roles.includes(role))) return children;
  if (Array.isArray(access) && access.some((role) => roles[role])) return children;
  if (roles[access] && roles[access] !== 'guest') return children;

  return null;
}

export default Role;
