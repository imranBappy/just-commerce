import { model, models, Schema } from "mongoose";
import { webpage } from "~/utils/modelData.mjs";

const webpagesSchema = new Schema(webpage);

export default models.webpage || model("webpage", webpagesSchema);
