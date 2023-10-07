import { model, models, Schema } from "mongoose";
import { user } from "~/utils/modelData.mjs";

const userSchema = new Schema(user);

export default models.user || model("user", userSchema);
