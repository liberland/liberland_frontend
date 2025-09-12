import Fuse from 'fuse.js';
import { expose } from 'threads/worker';

let contractFuse;

function searchContracts({
  data,
  value,
}) {
  contractFuse ||= new Fuse(data, {
    keys: ['data'],
    minMatchCharLength: 3,
    ignoreLocation: true,
  });
  return contractFuse.search(value).map(({ item }) => item);
}

expose({
  searchContracts,
});
