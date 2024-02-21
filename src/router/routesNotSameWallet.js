import router from './index';

export default [
  router.home.feed,
  router.home.wallet,
  router.home.index,
  router.home.profile,
  router.home.staking,
  ...Object.values(router.wallet),
];
