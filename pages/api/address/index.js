import { getToken } from "next-auth/jwt";
import UserModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";
import xss from "xss";

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });

  if (!session)
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const body = req.body;
        let obj = {};
        for (const x in body) {
          if (Object.hasOwnProperty.call(body, x)) {
            const el = body[x];
            const cleanData = xss(el);
            obj[x] = cleanData;
          }
        }
        const r = await UserModel.updateOne({ _id: session.user.id }, obj);
        res.status(200).json({
          success: r.modifiedCount && r.modifiedCount === 1 ? true : false,
        });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
