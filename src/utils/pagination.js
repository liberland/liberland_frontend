export const paginator = (pageSize, loaded, count, action) => (page) => {
  if (loaded < count && page * pageSize >= loaded) {
    action({ skip: loaded });
  }
};
