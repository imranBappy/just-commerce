import { model, models, Schema } from "mongoose";
import { coupon } from "~/utils/modelData.mjs";

const couponSchema = new Schema(coupon);

export default models.coupon || model("coupon", couponSchema);
