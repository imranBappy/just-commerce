import ProductModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

const pif = {
  name: 1,
  slug: 1,
  image: 1,
  unit: 1,
  unitValue: 1,
  price: 1,
  discount: 1,
  type: 1,
  variants: 1,
  quantity: 1,
  date: 1,
  review: 1,
};

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { type } = req.query;
        const arg =
          type === "trending"
            ? { trending: true }
            : type === "new"
            ? { new: true }
            : type === "bestselling"
            ? { bestSelling: true }
            : null;
        if (arg) {
          const data = await ProductModel.find(arg).select(pif);
          res.setHeader(
            "Cache-Control",
            "s-maxage=300, stale-while-revalidate"
          );
          res.status(200).json({
            success: true,
            products: data,
          });
        } else {
          throw new Error("illigal request");
        }
      } catch (err) {
        console.log(err.message);
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
