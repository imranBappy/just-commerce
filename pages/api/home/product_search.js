import ProductModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const product = await ProductModel.find({}).select({
          name: 1,
          slug: 1,
          _id: 0,
          price: 1,
          discount: 1,
          image: 1,
          unit: 1,
          unitValue: 1,
        });
        res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate");
        res.status(200).json({
          success: true,
          product,
        });
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
