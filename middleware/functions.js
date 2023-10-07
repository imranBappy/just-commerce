import { unlink } from "fs/promises";
import customId from "custom-id-new";

export async function deleteOne(file) {
  try {
    const filePath = `./public/uploads/${file}`;
    await unlink(filePath);
  } catch (err) {
    console.log(err);
  }
}
export async function deleteMultiple(files) {
  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = `./public/uploads/${file}`;
      await unlink(filePath);
    }
  } catch (err) {
    console.log(err);
  }
}

export function convertToSlug(string, randomId) {
  const str = string
    .toString()
    .trim()
    .toLowerCase()
    .replace("&", "and")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

  if (randomId) {
    const cid = customId({ randomLength: 4, lowerCase: true })
    const slug = `${str}-${cid}`
    return slug;
  } else {
    return str;
  }
}