import orderModel from "../../../models/order";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const id = req.query.id;
        const order = await orderModel
          .findOne({ orderId: id })
          .select("-_id")
          .lean();
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
        res.status(200).json({ success: true, order });
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
