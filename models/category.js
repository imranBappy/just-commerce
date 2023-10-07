import { model, models, Schema } from "mongoose";
import { category } from "~/utils/modelData.mjs";

const categorySchema = new Schema(category);

export default models.category || model("category", categorySchema);
