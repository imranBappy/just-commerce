import productModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";

const productItemField = {
  name: 1,
  slug: 1,
  image: 1,
  unit: 1,
  unitValue: 1,
  price: 1,
  discount: 1,
  shortDescription: 1,
  date: 1,
  type: 1,
  variants: 1,
  colors: 1,
  quantity: 1,
};

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const ids = req.body.idList;
        const data = await productModel
          .find()
          .where("_id")
          .in(ids)
          .select(productItemField)
          .exec();
        res.status(200).json({ success: true, data });
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
