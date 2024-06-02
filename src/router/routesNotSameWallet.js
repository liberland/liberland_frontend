import router from './index';

export default [
  router.home.feed,
  router.home.wallet,
  router.home.index,
  router.home.profile,
  router.home.staking,
  router.home.offices,
  router.home.contracts,
  ...Object.values(router.contracts),
  ...Object.values(router.offices),
  ...Object.values(router.wallet),
];
