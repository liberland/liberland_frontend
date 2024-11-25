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
  const gradientPart = parseInt(colors[5][1], 16) % 3;
  if (gradientPart === 1) {
    colors.push(...Array(40).fill('rgba(0, 0, 0, 0)'));
  }
  const css = tinygradient(colors).css(gradientPart === 1 ? 'radial' : 'linear');
  const [x, y, z] = colors[0].split('#')[1].split('').map((n) => parseInt(n, 16));
  const shadow = colors[1];
  const sepia = parseInt(colors[2][1], 16) % 2 ? ` sepia(${parseInt(colors[2][1] + colors[2][2], 16) % 100}%)` : '';
  const contrast = parseInt(colors[3][1], 16) % 2
    ? ` contrast(${parseInt(colors[3][1] + colors[3][2], 16)}%)`
    : '';
  const saturate = parseInt(colors[4][1], 16) % 2
    ? ` saturate(${parseInt(colors[4][2], 16)})`
    : '';
  const brightness = parseInt(colors[6][1], 16) % 2
    ? ` brightness(${parseInt(colors[6][2] + colors[6][3], 16)}%)`
    : '';
  const rotateHue = parseInt(colors[7][1], 16) % 2
    ? ` hue-rotate(${parseInt(colors[7][2] + colors[7][3] + colors[7][4], 16) % 360}deg)`
    : '';

  return {
    background: gradientPart === 2
      ? css.replace('linear-gradient(to right, ', 'conic-gradient(') // Library doesn't support conic gradient :-(
      : css, // Styling must be internal to allow for print!
    width: '170px',
    height: '170px',
    minWidth: '170px',
    minHeight: '170px',
    borderRadius: gradientPart === 2 ? '50%' : undefined,
    filter: `drop-shadow(${
      Math.max(-10, Math.min(10, x * (x % 2 ? -1 : 1)))
    }px ${
      Math.max(-10, Math.min(10, y * (y % 2 ? -1 : 1)))
    }px ${
      Math.min(10, z + 3)
    }px ${shadow})${sepia}${contrast}${saturate}${brightness}${rotateHue}`,
  };
}

export async function downloadImage(id, htmlElement) {
  if (htmlElement) {
    const url = await toPng(htmlElement);
    FileSaver.saveAs(url, `nft-prime-${id}.png`);
  }
}
