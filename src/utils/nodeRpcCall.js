import { newCompanyDataObject } from './defaultData';

export const BLOCKS_PER_DAY = 24 * (3600 / 6);
export const daysToBlocks = (days) => parseInt(days) * BLOCKS_PER_DAY;

export const setMetadataCache = (genesisHash, specVersion, metadata) => {
  localStorage.substrateApiMetadata = JSON.stringify({
    [`${genesisHash}-${specVersion}`]: metadata,
  });
};

export const getMetadataCache = () => {
  const metadataEncoded = localStorage.substrateApiMetadata;
  if (metadataEncoded) {
    return JSON.parse(metadataEncoded);
  }

  return undefined;
};

export const getNestedValue = (data, path) => path.reduce((acc, key) => acc && acc[key], data);

export function blockchainDataToFormObject(blockchainDataRaw) {
  const blockchainData = blockchainDataRaw.toJSON ? blockchainDataRaw.toJSON() : blockchainDataRaw;
  const supportedObject = JSON.parse(JSON.stringify(newCompanyDataObject));
  const staticFields = [];
  const dynamicFields = [];

  supportedObject.staticFields.forEach((staticField) => {
    if (staticField.key in blockchainData || staticField.type === 'checkbox') {
      const fieldObject = staticField;
      fieldObject.display = blockchainData[staticField.key];
      staticFields.push(fieldObject);
    }
  });

  supportedObject.dynamicFields.forEach((dynamicField) => {
    if (dynamicField.key in blockchainData) {
      const fieldObject = dynamicField;
      const fieldObjectData = [];
      blockchainData[dynamicField.key].forEach((dynamicFieldDataArray) => {
        // Format using fields data
        const crossReferencedFieldDataArray = [{}];
        for (const key in dynamicFieldDataArray) {
          if (Object.prototype.hasOwnProperty.call(dynamicFieldDataArray, key)) {
            const pushObject = {};
            pushObject.key = key;
            if (dynamicFieldDataArray[key].isEncrypted !== undefined) {
              pushObject.display = dynamicFieldDataArray[key].value;
              pushObject.isEncrypted = dynamicFieldDataArray[key].isEncrypted;
            } else {
              pushObject.display = dynamicFieldDataArray[key];
              pushObject.isEncrypted = false;
            }
            crossReferencedFieldDataArray.push(JSON.parse(JSON.stringify(pushObject)));
          }
        }
        fieldObjectData.push(crossReferencedFieldDataArray);
      });

      fieldObject.data = JSON.parse(JSON.stringify(fieldObjectData));
      dynamicFields.push(fieldObject);
    }
  });
  blockchainData.staticFields = JSON.parse(JSON.stringify(staticFields));
  blockchainData.dynamicFields = JSON.parse(JSON.stringify(dynamicFields));
  return blockchainData;
}
