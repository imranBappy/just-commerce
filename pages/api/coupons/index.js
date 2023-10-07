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
        const coupon = await couponModel.find({});
        res.status(200).json({ success: true, coupon });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        const formData = await parseForm(req);
        const coupon = {
          code: formData.field.code.trim(),
          amount: Number(formData.field.amount),
          active: formData.field.active,
          expired: formData.field.expire,
        };
        await couponModel.create(coupon);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        if (err.code === 11000) {
          return res.status(200).json({
            success: false,
            dup: true,
          });
        }
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const id = req.query.id;
        await couponModel.findByIdAndDelete(id);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
