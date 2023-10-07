export async function getStorageData(key) {
  try {
    let result = [];
    if (key) {
      const encKey = process.env.NEXT_PUBLIC_CRYPTO_PASS;
      const localData = localStorage.getItem(key);
      if (localData && localData.length > 0) {
        const CryptoJS = await import("crypto-js");
        const decrData = CryptoJS.AES.decrypt(localData, encKey);
        const decrDataStr = decrData.toString(CryptoJS.enc.Utf8);
        result = JSON.parse(decrDataStr);
      }
    }
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function setStorageData(key, value) {
  try {
    const encKey = process.env.NEXT_PUBLIC_CRYPTO_PASS;
    const data = JSON.stringify(value);
    const AES = await import("crypto-js/aes");
    const encData = AES.encrypt(data, encKey);
    const encDataStr = encData.toString();
    localStorage.setItem(key, encDataStr);
  } catch (error) {
    console.log(error);
  }
}

export function removeStorageData(key) {
  localStorage.removeItem(key);
}
