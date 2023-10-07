import ProductModel from "~/models/product";
import SettingModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { slug, relatedProduct } = req.query;
        const settings = await SettingModel.findOne({});
        const product = await ProductModel.findOne({ slug: slug });
        if (relatedProduct === "true" && product) {
          const related = await ProductModel.find({
            categories: product.categories,
          }).limit(8);
          res.status(200).json({ success: true, product, related, settings });
        } else {
          res.status(200).json({ success: true, product });
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
