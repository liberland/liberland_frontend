export const USER_ROLES = [
  'Citizen',
  'eresident',
  'AssemblyMember',
  'MinisterOfInterior',
  'NonCitizen',
];

export const userRolesHelper = {
  getUserRolesString: (userRolesObject) => {
    if (userRolesObject.assemblyMember) return 'Assembly member';
    if (userRolesObject.citizen) return 'Citizen';
    return 'Non citizen';
  },

  assignJsIdentity: (identity) => {
    switch (identity) {
      case 'Citizen':
        return { citizen: 'citizen' };
      // TODO eresident wont work - not referenced in code
      case 'eresident':
        return { e_resident: 'eresident', non_citizen: 'non_citizen' };
      case 'AssemblyMember':
        return { assemblyMember: 'assemblyMember', citizen: 'citizen' };
      case 'MinisterOfInterior':
        return { ministerOfInterior: 'ministerOfInterior', citizen: 'citizen' };
      default:
        return { non_citizen: 'non_citizen' };
    }
  },
};
