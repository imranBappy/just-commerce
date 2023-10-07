import {
  attributeModel,
  categoryModel,
  colorModel,
  productModel,
  settingModel,
  shippingChargeModel,
  userModel,
  webpageModel,
  _dbConnect,
  _dbDisconnect,
} from "./function.mjs";
import data from "./seedData.mjs";

const importData = async () => {
  try {
    await _dbConnect();
    console.log("************************************************");
    console.log("**Cleaning Database for avoiding duplication!!**");
    console.log("************************************************");

    await settingModel.deleteMany();
    await productModel.deleteMany();
    await categoryModel.deleteMany();
    await attributeModel.deleteMany();
    await colorModel.deleteMany();
    await shippingChargeModel.deleteMany();
    await userModel.deleteMany();
    await webpageModel.deleteMany();

    console.log("Cleaning complete");

    await settingModel.create(data.settings);
    console.log("Settings data imported");
    await productModel.insertMany(data.product);
    console.log("Products data imported");
    await categoryModel.insertMany(data.category);
    console.log("Category data imported");
    await attributeModel.create(data.attribute);
    console.log("Attribute data imported");
    await colorModel.insertMany(data.color);
    console.log("Color data imported");
    await shippingChargeModel.create(data.shippingCharge);
    console.log("Shipping Charge data imported");
    await userModel.create(data.user);
    console.log("User data imported");
    await webpageModel.create(data.webpage);
    console.log("Webpage data imported");

    console.log("***************************");
    console.log("**Database Seeding Done!!**");
    console.log("***************************");
    await _dbDisconnect();
    // 0 is a success code and 1 (or another number) can be a failure code.
    process.exit(0);
  } catch (error) {
    console.log("Data not imported =>", error.message);
    process.exit(1);
  }
};

importData();
