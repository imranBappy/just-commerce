import { model, models, Schema } from "mongoose";
import { brand } from "~/utils/modelData.mjs";

const brandSchema = new Schema(brand);

export default models.brand || model("brand", brandSchema);
