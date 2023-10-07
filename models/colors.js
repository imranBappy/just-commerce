import { model, models, Schema } from "mongoose";
import { color } from "~/utils/modelData.mjs";

const colorSchema = new Schema(color);

export default models.color || model("color", colorSchema);
