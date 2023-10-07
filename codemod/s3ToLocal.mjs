import {
  brandModel,
  categoryModel,
  orderModel,
  productModel,
  settingModel,
  webpageModel,
  _dbConnect,
  _dbDisconnect,
} from "../seeder/function.mjs";
import dotenv from "dotenv";

dotenv.config({ path: process.cwd() + "/.env.local" });

let count = 0;

function replaceUrl(url, name) {
  count = count + 1;
  return `${url}/${name}`;
}

async function s3ToLocal() {
  try {
    await _dbConnect();
    let currentUrl = process.env.NEXT_PUBLIC_URL;
    console.log(`Production URL ${currentUrl}`);
    //FOR PRODUCT
    const productList = await productModel.find({});
    for (const product of productList) {
      const updatedUrl = replaceUrl(currentUrl, product.image[0].name);
      product.image[0].url = updatedUrl;
      for (const image of product.gallery) {
        const updatedUrl = replaceUrl(currentUrl, image.name);
        image.url = updatedUrl;
      }
      product.markModified("image");
      product.markModified("gallery");
      await product.save();
    }

    //FOR SETTINGS
    const setting = await settingModel.findOne({});
    setting.logo[0].url = replaceUrl(currentUrl, setting.logo[0].name);
    setting.favicon[0].url = replaceUrl(currentUrl, setting.favicon[0].name);
    setting.gatewayImage[0].url = replaceUrl(
      currentUrl,
      setting.gatewayImage[0].name
    );
    setting.markModified("logo");
    setting.markModified("favicon");
    setting.markModified("gatewayImage");
    await setting.save();

    //FOR CATEGORY
    const categoryList = await categoryModel.find({});
    for (const category of categoryList) {
      category.icon[0].url = replaceUrl(currentUrl, category.icon[0].name);
      category.markModified("icon");
      await category.save();
    }

    //FOR BRAND
    const brandList = await brandModel.find({});
    for (const brand of brandList) {
      brand.image[0].url = replaceUrl(currentUrl, brand.image[0].name);
      brand.markModified("image");
      await brand.save();
    }

    //FOR ORDER
    const orderList = await orderModel.find({});
    for (const order of orderList) {
      for (const images of order.products) {
        images.image[0].url = replaceUrl(currentUrl, images.image[0].name);
      }
      order.markModified("products");
      await order.save();
    }

    //FOR PAGE SETTINGS
    const webpage = await webpageModel.findOne({});
    const { homePage } = webpage;
    homePage.carousel.background[0].url = replaceUrl(
      currentUrl,
      homePage.carousel.background[0].name
    );

    for (const cd of homePage.carousel.carouselData) {
      cd.image[0].url = replaceUrl(currentUrl, cd.image[0].name);
    }

    homePage.banner.image[0].url = replaceUrl(
      currentUrl,
      homePage.banner.image[0].name
    );

    for (const collection in homePage.collection) {
      if (Object.hasOwnProperty.call(homePage.collection, collection)) {
        const el = homePage.collection[collection];
        el.image[0].url = replaceUrl(currentUrl, el.image[0].name);
      }
    }

    webpage.markModified("homePage");
    await webpage.save();
  } catch (error) {
    console.log(error);
  }
  console.log(`Total URL Modified - ${count}`);
  process.exit(1);
}

s3ToLocal();
