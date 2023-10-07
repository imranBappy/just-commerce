import { model, models, Schema } from "mongoose";
import { product } from "~/utils/modelData.mjs";

const productSchema = new Schema(product, { versionKey: false });

export default models.product || model("product", productSchema);
