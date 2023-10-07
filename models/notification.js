import { model, models, Schema } from "mongoose";
import { notification } from "~/utils/modelData.mjs";

const notificationSchema = new Schema(notification);

export default models.notification || model("notification", notificationSchema);
