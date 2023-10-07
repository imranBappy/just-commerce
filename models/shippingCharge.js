import { model, models, Schema } from "mongoose";
import { shippingCharge } from "~/utils/modelData.mjs";

const ShippingChargeSchema = new Schema(shippingCharge);

export default models.shippingCharge ||
  model("shippingCharge", ShippingChargeSchema);
