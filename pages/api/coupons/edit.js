import sessionChecker from "~/lib/sessionPermission";
import couponModel from "../../../models/coupon";
import dbConnect from "../../../utils/dbConnect";
import { parseForm } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "coupon")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await couponModel.findById(req.query.id);
        res.status(200).json({ success: true, coupon: data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const data = await parseForm(req);
        const couponData = {
          code: data.field.code.trim(),
          amount: data.field.amount,
          active: data.field.active,
          expired: data.field.expired,
        };
        await couponModel.findByIdAndUpdate(data.field.id, couponData);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          return res.status(200).json({
            success: false,
            dup: true,
          });
        }
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
