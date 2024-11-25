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
  const colors = window.BigInt(number).toString(16).split('').reduce((accumulator, byte) => {
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
  colors.push(...Array(40).fill('#ffffff'));
  const css = tinygradient(colors).css('radial');
  return {
    background: css, // Styling must be internal to allow for print!
    width: '200px',
    height: '200px',
    minWidth: '200px',
    minHeight: '200px',
  };
}

export async function downloadImage(id, htmlElement) {
  if (htmlElement) {
    const url = await toPng(htmlElement);
    FileSaver.saveAs(url, `nft-prime-${id}.png`);
  }
}
