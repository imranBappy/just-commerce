import { URL, URLSearchParams } from "url";
import orderModel from "~/models/order";

export default async function apiHandler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const status = req.query.status;
        switch (status) {
          case "success":
            const order = await orderModel.findOne({
              orderId: req.query.order_id,
            });
            if (order.status === "Draft") {
              order.paymentStatus = "Paid";
              order.status = "Pending";
              await order.save();
            }
            res
              .writeHead(302, { Location: `/checkout/success/${order._id}` })
              .end();
            break;

          case "fail":
            await orderModel.findOneAndRemove({ orderId: req.query.order_id });
            res.writeHead(302, { Location: "/" }).end();
            break;

          case "cancel":
            await orderModel.findOneAndRemove({ orderId: req.query.order_id });
            res.writeHead(302, { Location: "/" }).end();
            break;

          case "ipn":
            if (req.body && req.body.status === "VALID") {
              const orderData = await orderModel.findOne({
                orderId: req.query.order_id,
              });
              orderData.paymentStatus = "Paid";
              orderData.status = "Pending";
              orderData.paymentId = req.body.tran_id;
              await orderData.save();
              const url = new URL(
                process.env.NEXT_PUBLIC_SSLCOMMERZ_VALIDATION_API_URL,
              );
              const params = {
                val_id: req.body.val_id,
                store_id: process.env.NEXT_PUBLIC_SSLCOMMERZ_ID,
                store_passwd: process.env.NEXT_PUBLIC_SSLCOMMERZ_PASS,
              };
              url.search = new URLSearchParams(params);
              await fetch(url).catch((err) => console.log(err));
            }
            res.status(201).json({ message: "ok" });
            break;

          default:
            res.status(400).json({ success: false });
            break;
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
