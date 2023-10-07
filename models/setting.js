import { model, models, Schema } from "mongoose";
import { settings } from "~/utils/modelData.mjs";

const settingSchema = new Schema(settings);

export default models.setting || model("setting", settingSchema);
