import { useState } from 'react';

export const useUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const uploadImageToIPFS = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      setUploading(false);
      throw new Error(error.message || 'Failed to upload image');
    }

    const data = await response.json();
    setUploading(false);
    return data.IpfsHash;
  };

  const uploadImageWithLink = async (file) => {
    const ipfsHash = await uploadImageToIPFS(file);
    return `https://${process.env.REACT_APP_PINATA_GATEWAY}/ipfs/${ipfsHash}`;
  };

  const uploadJsonToIPFS = async (json) => {
    setUploading(true);
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        pinata_api_key: process.env.REACT_APP_PINATA_API_KEY,
        pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(json),
    });

    if (!response.ok) {
      const error = await response.json();
      setUploading(false);
      throw new Error(error.message || 'Failed to upload JSON');
    }

    const data = await response.json();
    setUploading(false);
    return data.IpfsHash;
  };

  const uploadMetadataToIPFS = async (name, description, onError) => {
    try {
      if (!name || !description) {
        onError();
      }
      setUploading(true);
      const imageCID = previewImage.split('/ipfs/')[1];
      const metadata = {
        name,
        description,
        image: `ipfs://${imageCID}`,
      };
      const metadataCID = await uploadJsonToIPFS(metadata);
      return metadataCID;
    } catch (error) {
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadImageWithLink,
    uploadMetadataToIPFS,
    setPreviewImage,
    previewImage,
  };
};
