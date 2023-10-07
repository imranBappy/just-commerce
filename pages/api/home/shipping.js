import { getToken } from "next-auth/jwt";
import shippingModel from "../../../models/shippingCharge";
import UserModel from "~/models/user";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        let address = null;
        const shippingCharge = await shippingModel.findOne({});
        if (session && session.user) {
          address = await UserModel.findById(session.user.id).select([
            "name",
            "email",
            "phone",
            "house",
            "city",
            "state",
            "zipCode",
            "country",
            "-_id",
          ]);
        }
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        res.status(200).json({ success: true, shippingCharge, address });
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
