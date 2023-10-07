import { model, models, Schema } from "mongoose";
import { newsletter } from "~/utils/modelData.mjs";

const newsletterSchema = new Schema(newsletter);

export default models.newsletter || model("newsletter", newsletterSchema);
