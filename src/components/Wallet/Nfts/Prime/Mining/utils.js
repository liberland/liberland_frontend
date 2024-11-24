import objectHash from 'object-hash';
import tinygradient from 'tinygradient';
import html2canvas from 'html2canvas';
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
    workers.forEach((worker) => worker.postMessage('prime stop'));
    return Object.values(results);
  };
}

export function createGradient(number) {
  const colors = window.BigInt(number).toString(16).split('').reduce((accumulator, byte) => {
    const lastColor = accumulator[accumulator.length - 1];
    if (lastColor?.length === 7) { // example: #ababab
      accumulator.push(`#${byte}`);
    } else {
      accumulator[accumulator.length - 1] = `${accumulator[accumulator.length - 1]}${byte}`;
    }
    return accumulator;
  }, []);

  return tinygradient(colors).css();
}

export async function downloadImage(id, htmlElement) {
  if (htmlElement) {
    const canvas = await html2canvas(htmlElement);
    const blob = new Blob(canvas.toBlob(), { type: 'image/png' });
    FileSaver.saveAs(blob, `nft-prime-${id}.png`);
  }
}
