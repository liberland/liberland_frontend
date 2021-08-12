export default class File {
  static readKeyFileAsync(keyFile) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => {
        res(reader.result);
      };
      reader.onerror = (error) => {
        rej(error);
      };
      reader.readAsText(keyFile);
    });
  }

  static toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
