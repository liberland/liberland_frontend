import objectHash from 'object-hash';
import tinygradient from 'tinygradient';
import { toPng } from 'html-to-image';
import FileSaver from 'file-saver';

export function webWorkerPrimeFinder(amount, onChange) {
  const workers = [];
  const results = {};

  for (let i = 0; i < amount; i += 1) {
    const worker = new Worker(new URL('./worker.js', import.meta.url));
    worker.addEventListener('message', ({ data }) => {
      results[objectHash(data)] = data;
      onChange(Object.values(results));
    });
    workers.push(worker);
  }

  workers.forEach((worker) => worker.postMessage('prime start'));
  return () => {
    workers.forEach((worker) => worker.terminate());
    return Object.values(results);
  };
}

export function createGradient(number) {
  const colors = window.BigInt(number).toString(16).split('')
    .reduce((accumulator, byte) => {
      const lastColor = accumulator[accumulator.length - 1];
      if (!lastColor || lastColor.length === 7) { // example: #ababab
        accumulator.push(`#${byte}`);
      } else {
        accumulator[accumulator.length - 1] = `${accumulator[accumulator.length - 1]}${byte}`;
      }
      return accumulator;
    }, []);
  const lastColor = colors[colors.length - 1];
  if (lastColor.length < 7) {
    const firstColor = colors[0].split('#')[1];
    colors[colors.length - 1] += firstColor;
    colors[colors.length - 1] = colors[colors.length - 1].slice(0, 7);
  }
  const hash = objectHash(colors).split('').map((byte) => parseInt(byte, 16));
  const gradientPart = hash[0] % 3;
  if (gradientPart === 1) {
    colors.push(...Array(40).fill('rgba(0, 0, 0, 0)'));
  }
  const combineNumbers = (...numbers) => numbers
    .map((n, i) => n * (16 ** i))
    .reduce((p, c) => p + c, 0);
  const css = tinygradient(colors).css(gradientPart === 1 ? 'radial' : 'linear');
  const [x, y, z] = hash.slice(1, 4);
  const shadow = `#${hash.slice(4, 10).map((toBytes) => toBytes.toString(16)).join('')}`;
  const sepia = hash[10] % 2 ? ` sepia(${combineNumbers(hash[11], hash[12]) % 100}%)` : '';
  const contrast = hash[13] % 2
    ? ` contrast(${combineNumbers(hash[14], hash[15])}%)`
    : '';
  const saturate = hash[16] % 2
    ? ` saturate(${hash[17]})`
    : '';
  const brightness = hash[18] % 2
    ? ` brightness(${combineNumbers(hash[19], hash[20])}%)`
    : '';
  const rotateHue = hash[21] % 2
    ? ` hue-rotate(${combineNumbers(hash[22], hash[23], hash[24]) % 360}deg)`
    : '';

  const styles = {
    background: gradientPart === 2
      ? css.replace('linear-gradient(to right, ', 'conic-gradient(') // Library doesn't support conic gradient :-(
      : css, // Styling must be internal to allow for print!
    width: '170px',
    height: '170px',
    minWidth: '170px',
    minHeight: '170px',
    borderRadius: gradientPart === 2 ? '50%' : undefined,
    filter: `drop-shadow(${
      x * (hash[25] % 2 ? -1 : 1)
    }px ${
      y * (hash[26] % 2 ? -1 : 1)
    }px ${
      Math.min(10, z + 3)
    }px ${shadow})${sepia}${contrast}${saturate}${brightness}${rotateHue}`,
  };

  return styles;
}

export async function downloadImage(id, htmlElement) {
  if (htmlElement) {
    const url = await toPng(htmlElement);
    FileSaver.saveAs(url, `nft-prime-${id}.png`);
  }
}
