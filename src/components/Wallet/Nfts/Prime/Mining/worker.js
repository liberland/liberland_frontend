import random from 'random-bigint';

// Javascript program Miller-Rabin primality test
// based on JavaScript code found at https://www.geeksforgeeks.org/primality-test-set-3-miller-rabin/

// Utility function to do
// modular exponentiation.
// It returns (x^y) % p
function power(x, y, p) {
  // Initialize result
  // (JML- all literal integers converted to use n suffix denoting BigInt)
  let res = 1n;

  // Update x if it is more than or
  // equal to p
  x %= p;
  while (y > 0n) {
    // If y is odd, multiply
    // x with result
    // eslint-disable-next-line no-bitwise
    if (y & 1n) res = (res * x) % p;

    // y must be even now
    y /= 2n; // (JML- original code used a shift operator, but division is clearer)
    x = (x * x) % p;
  }
  return res;
}

// This function is called
// for all k trials. It returns
// false if n is composite and
// returns false if n is
// probably prime. d is an odd
// number such that d*2<sup>r</sup> = n-1
// for some r >= 1
function millerTest(d, n) {
  // (JML- all literal integers converted to use n suffix denoting BigInt)

  // Pick a random number in [2..n-2]
  // Corner cases make sure that n > 4
  /*
    JML- I can't mix the Number returned by Math.random with
    operations involving BigInt. The workaround is to create a random integer
    with precision 6 and convert it to a BigInt.
  */
  // eslint-disable-next-line no-undef
  const r = BigInt(Math.floor(Math.random() * 100_000));
  // JML- now I have to divide by the multiplier used above (BigInt version)
  const y = (r * (n - 2n)) / 100_000n;
  const a = 2n + (y % (n - 4n));

  // Compute a^d % n
  let x = power(a, d, n);

  if (x === 1n || x === n - 1n) return true;

  // Keep squaring x while one
  // of the following doesn't
  // happen
  // (i) d does not reach n-1
  // (ii) (x^2) % n is not 1
  // (iii) (x^2) % n is not n-1
  while (d !== n - 1n) {
    x = (x * x) % n;
    d *= 2n;

    if (x === 1n) return false;
    if (x === n - 1n) return true;
  }

  // Return composite
  return false;
}

// It returns false if n is
// composite and returns true if n
// is probably prime. k is an
// input parameter that determines
// accuracy level. Higher value of
// k indicates more accuracy.
export function isPrime(n, k = 14) {
  // (JML- all literal integers converted to use n suffix denoting BigInt)
  // Corner cases
  if (n <= 1n || n === 4n) return [false, 0, 0];
  if (n <= 3n) return [true, 0, 0];

  // Find r such that n =
  // 2^d * r + 1 for some r >= 1
  let d = n - 1n;
  let s = 0;
  while (d % 2n === 0n) {
    d /= 2n;
    s += 1;
  }

  // Iterate given nber of 'k' times
  for (let i = 0; i < k; i += 1) {
    if (!millerTest(d, n)) {
      return [false, d, s];
    }
  }

  return [true, d, s];
}

async function primeFinder(cancel, found) {
  const minBits = parseInt(process.env.REACT_APP_THIRD_WEB_NFT_PRIME_MIN_BYTES) * 8;
  let randomStart = random(minBits);
  while (!cancel()) {
    const handler = async (n) => {
      const [foundPrime, d, s] = isPrime(n);
      if (foundPrime) {
        found({ n, d, s });
      }
    };
    await handler(randomStart);
    randomStart += 1n;
  }
}

// Workers need to be able to serialize bigint into decimal string. Will not affect the rest of the app
// eslint-disable-next-line no-undef
BigInt.prototype.toJSON = function toJSON() { return this.toString(); };

let stopPrimeFinder = false;

// eslint-disable-next-line no-restricted-globals
self.onmessage = ({ data }) => {
  // eslint-disable-next-line default-case
  switch (data) {
    case 'prime start':
      stopPrimeFinder = false;
      primeFinder(
        () => stopPrimeFinder,
        (prime) => {
          postMessage(prime);
        },
      );
      break;
    case 'prime stop':
      stopPrimeFinder = true;
      break;
  }
};
