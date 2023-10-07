import bcrypt from "bcrypt";
import userModel from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const data = await parseForm(req);
        const { name, email, password } = data.field;
        const salt = await bcrypt.genSalt(6);
        const hash = await bcrypt.hash(password, salt);
        const userData = { name, email, hash, salt };
        await userModel.create(userData);
        res.status(200).json({ success: true });
      } catch (err) {
        if (err && err.code == 11000) {
          console.log(err);
          res.status(200).json({ success: false, duplicate: true });
        } else {
          console.log(err);
          res.status(400).json({ success: false, duplicate: false });
        }
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
