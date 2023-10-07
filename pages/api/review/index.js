import { getToken } from "next-auth/jwt";
import orderModel from "~/models/order";
import productModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

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
        const { pid, oid, rating, comment } = req.body;
        const _data = {
          userName: session.user.name,
          email: session.user.email,
          rating,
          comment,
        };
        await productModel.findByIdAndUpdate(pid, {
          $push: { review: _data },
        });
        await orderModel.findOneAndUpdate(
          { orderId: oid, "products._id": pid },
          {
            $set: { "products.$.review": true },
          },
        );
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
