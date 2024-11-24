// Here's webworker logic which will be in a separate bundle
import { primeFinder } from './components/Wallet/Nfts/Prime/Mining/utils';

const primeAccLimit = 5;

// Workers need to be able to serialize bigint into decimal string. Will not affect the rest of the app
window.BigInt.prototype.toJSON = function toJSON() { return this.toString(); };

let stopPrimeFinder = false;
let primesAcc = [];

window.addEventListener('message', async ({ data }) => {
  switch (data) {
    case 'prime start':
      stopPrimeFinder = false;
      primeFinder(
        () => stopPrimeFinder,
        (prime) => {
          primesAcc.push(prime);
          if (primesAcc.length === primeAccLimit) {
            postMessage(primesAcc);
            primesAcc = [];
          }
        },
      );
      break;
    case 'prime stop':
      stopPrimeFinder = true;
      if (primesAcc.length > 0) {
        postMessage(primesAcc);
        primesAcc = [];
      }
      break;
    default:
      throw new Error(`${JSON.stringify(data)} is not a valid message`);
  }
});
