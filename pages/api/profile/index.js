import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import OrderModel from "../../../models/order";
import UserModel from "../../../models/user";
import dbConnect from "../../../utils/dbConnect";

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
    case "GET":
      try {
        const user = await UserModel.findById(req.query.id)
          .select([
            "-hash",
            "-salt",
            "-isAdmin",
            "-resetPasswordExpires",
            "-resetPasswordToken",
            "-__v",
            "-createdAt",
            "-updatedAt",
          ])
          .populate(
            "orders",
            {
              _id: 0,
              __V: 0,
              new: 0,
              user: 0,
              coupon: 0,
            },
            null,
            { sort: { orderDate: -1 } },
          )
          .populate("favorite")
          .exec();
        res.status(200).json({ success: true, user });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { query, body } = req;
        const bodyData = body;
        const userData = await UserModel.findById(query.id);
        if (!userData) {
          return res.status(400).json({ success: false });
        }
        switch (query.scope) {
          case "info":
            userData.name = bodyData.name;
            userData.email = bodyData.email;
            userData.phone = bodyData.phone;
            userData.house = bodyData.house;
            userData.city = bodyData.city;
            userData.state = bodyData.state;
            userData.zipCode = bodyData.zipCode;
            userData.country = bodyData.country;
            await userData.save();
            break;

          case "password":
            const salt = await bcrypt.genSalt(6);
            const hash = await bcrypt.hash(bodyData.password, salt);
            userData.salt = salt;
            userData.hash = hash;
            await userData.save();
            break;

          default:
            return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        if (err && err.code === 11000) {
          return res.status(400).json({ success: false, duplicate: true });
        }
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
