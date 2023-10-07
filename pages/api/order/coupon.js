import couponModel from "~/models/coupon";
import dbConnect from "~/utils/dbConnect";

function dateFormat(date) {
  //YYYY-MM-DD
  const data = new Date(date);
  const year = data.getFullYear();
  const month = data.getMonth() + 1;
  const day = data.getDate();
  return new Date(`${year}, ${month}, ${day}`);
}

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const coupon = await couponModel.findOne({ code: req.body.code });
        if (coupon) {
          const active = dateFormat(coupon.active);
          const expired = dateFormat(coupon.expired);
          const today = dateFormat(new Date());
          if (active <= today && today <= expired) {
            res.status(200).json({
              success: true,
              message: `Coupon Applied ${coupon.code}`,
              discount: coupon.amount,
              code: coupon.code,
            });
          } else {
            res
              .status(200)
              .json({ success: false, message: "Coupon Code Expired" });
          }
        } else {
          res.status(200).json({ success: false, message: "Invalid Coupon" });
        }
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
