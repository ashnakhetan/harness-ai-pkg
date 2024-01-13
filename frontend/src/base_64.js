import React, { useState } from 'react';

// encodeImage.js or any filename you choose

const encodeImage = async (imageFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsDataURL(imageFile);
    });
  };
  
  export default encodeImage;
  