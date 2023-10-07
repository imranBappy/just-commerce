import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  attribute,
  category,
  color,
  product,
  settings,
  shippingCharge,
  user,
  webpage,
  brand,
  order,
} from "../utils/modelData.mjs";

dotenv.config({ path: process.cwd() + "/.env.local" });

export async function _dbConnect() {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    })
    .then(() => console.log("DB Connected"))
    .catch((error) => {
      console.log("DB Connection Failed", error.message);
    });
}

export async function _dbDisconnect() {
  await mongoose.connection
    .close()
    .then(() => console.log("DB Disconnected"))
    .catch((error) => {
      console.log("DB Disconnection Failed", error.message);
    });
}

//settings data
const SettingSchema = new mongoose.Schema(settings);
export const settingModel = mongoose.model("setting", SettingSchema);
//products data
const productSchema = new mongoose.Schema(product);
export const productModel = mongoose.model("product", productSchema);
//category data
const categorySchema = new mongoose.Schema(category);
export const categoryModel = mongoose.model("category", categorySchema);
//attribute data
const attributeSchema = new mongoose.Schema(attribute);
export const attributeModel = mongoose.model("attribute", attributeSchema);
//color data
const colorSchema = new mongoose.Schema(color);
export const colorModel = mongoose.model("color", colorSchema);
//shippingCharge data
const shippingChargeSchema = new mongoose.Schema(shippingCharge);
export const shippingChargeModel = mongoose.model(
  "shippingCharge",
  shippingChargeSchema
);
//user data
const userSchema = new mongoose.Schema(user);
export const userModel = mongoose.model("user", userSchema);
//webpage data
const webpageSchema = new mongoose.Schema(webpage);
export const webpageModel = mongoose.model("webpage", webpageSchema);
//category data
const brandSchema = new mongoose.Schema(brand);
export const brandModel = mongoose.model("brand", brandSchema);
//category data
const orderSchema = new mongoose.Schema(order);
export const orderModel = mongoose.model("order", orderSchema);

const exp = {
  _dbConnect,
  settingModel,
  productModel,
  categoryModel,
  attributeModel,
  colorModel,
  shippingChargeModel,
  userModel,
  webpageModel,
  brandModel,
  orderModel,
};

export default exp;
