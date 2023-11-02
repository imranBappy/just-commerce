import {model,models,Schema} from "mongoose";  
import { templates } from "~/utils/modelData.mjs";  

const templatesSchema = new Schema(templates);

export default models.templates || model("templates", templatesSchema);
