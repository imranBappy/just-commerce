import sessionChecker from "~/lib/sessionPermission";
import shippingModel from "~/models/shippingCharge";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  if (!(await sessionChecker(req, "shippingCharges")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  switch (method) {
    case "GET":
      try {
        const shipping = await shippingModel.findOne({});
        res.status(200).json({ success: true, shippingCharge: shipping });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { query, body } = req;
        let shippingData = await shippingModel.findOne({});
        if (shippingData === null) {
          shippingData = new shippingModel({ area: [] });
        }
        //Check Data Scope
        switch (query.scope) {
          case "area":
            const areaData = {
              name: body.areaName,
              price: body.areaCost,
            };
            shippingData.area.push(areaData);
            await shippingData.save();
            break;

          case "international":
            shippingData.internationalCost = body.amount;
            shippingData.internationalShippingActive = body.internationalShippingActive;
            await shippingData.save();
            break;

          case "internationalShipping":
            shippingData.internationalShippingActive = body.permission;
            await shippingData.save();
            break;
          default:
            return res.status(400).json({ success: false });
            break;
        }

        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        await shippingModel.updateOne(
          {},
          { $pull: { area: { _id: req.body.id } } },
          { safe: true },
        );
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "PUT":
      try {
        const bodyData = req.body;
        await shippingModel.updateOne(
          { "area._id": bodyData.id },
          {
            $set: {
              "area.$.name": bodyData.name,
              "area.$.price": bodyData.cost,
            },
          },
        );
        res.status(200).json({ success: true });
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
