import { model, models, Schema } from "mongoose";
import { attribute } from "~/utils/modelData.mjs";

const attributeSchema = new Schema(attribute);

export default models.attribute || model("attribute", attributeSchema);
