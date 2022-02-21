const userRolesHelper = {
  getUserRolesString: (userRolesObject) => {
    if (userRolesObject.assemblyMember) return 'Assembly member';
    if (userRolesObject.citizen) return 'Citizen';
    return 'Non citizen';
  },
};

export default userRolesHelper;
