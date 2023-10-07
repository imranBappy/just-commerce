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

const importDataAuto = async () => {
  try {
    await _dbConnect();

    const settingModelData = await settingModel.find({});
    const productModelData = await productModel.find({});
    const categoryModelData = await categoryModel.find({});
    const attributeModelData = await attributeModel.find({});
    const colorModelData = await colorModel.find({});
    const shippingChargeModelData = await shippingChargeModel.find({});
    const userModelData = await userModel.find({});
    const webpageModelData = await webpageModel.find({});

    function checkData(data) {
      return data && data.length > 0 ? true : false;
    }

    if (!checkData(settingModelData)) {
      await settingModel.create(data.settings);
      console.log("Settings data imported");
    }

    if (!checkData(productModelData)) {
      await productModel.insertMany(data.product);
      console.log("Products data imported");
    }

    if (!checkData(categoryModelData)) {
      await categoryModel.insertMany(data.category);
      console.log("Category data imported");
    }

    if (!checkData(attributeModelData)) {
      await attributeModel.create(data.attribute);
      console.log("Attribute data imported");
    }

    if (!checkData(colorModelData)) {
      await colorModel.insertMany(data.color);
      console.log("Color data imported");
    }

    if (!checkData(shippingChargeModelData)) {
      await shippingChargeModel.create(data.shippingCharge);
      console.log("Shipping Charge data imported");
    }

    if (!checkData(userModelData)) {
      await userModel.create(data.user);
      console.log("User data imported");
    }

    if (!checkData(webpageModelData)) {
      await webpageModel.create(data.webpage);
      console.log("Webpage data imported");
    }

    await _dbDisconnect();
  } catch (error) {
    console.log("Data not imported", error.message);
  }
};

export default importDataAuto;
