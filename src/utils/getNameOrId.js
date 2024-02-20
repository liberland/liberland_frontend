import truncate from './truncate';

export const findNameOrId = (discussionAddress, listData) => {
  const discussionName = listData && listData.find((item) => item.key === discussionAddress).name;
  return discussionName || (discussionAddress && truncate(discussionAddress, 13));
};
