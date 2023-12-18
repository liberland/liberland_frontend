import truncate from './truncate';

export const findNameOrId = (discussionAdress, listData) => {
  const discussionName = listData && listData.find((item) => item.key === discussionAdress).name;
  return discussionName || (discussionAdress && truncate(discussionAdress, 13));
};
