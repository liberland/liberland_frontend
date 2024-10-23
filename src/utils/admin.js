const isAdmin = () => localStorage.getItem('isAdminLogin') === 'true' ? adminAuthConfig : authConfig;

export {
    isAdmin,
};