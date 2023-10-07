import CategoryModel from "../../../models/category";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";

const productItemField = {
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
        const { category, subcategory, brands } = req.query;
        const categoryItems = await CategoryModel.find({});
        if (category || subcategory || brands) {
          const args = [
            category ? { categories: category } : {},
            subcategory ? { subcategories: subcategory } : {},
            brands ? { brand: brands } : {},
          ];
          const product = await ProductModel.find({
            $and: args,
          })
            .sort("-date")
            .select(productItemField)
            .exec();
          res.status(200).json({
            product: product,
            product_length: product.length,
            category: categoryItems,
          });
        } else {
          const product = await ProductModel.find({})
            .sort("-date")
            .limit(8)
            .select(productItemField)
            .exec();
          const product_length = await ProductModel.estimatedDocumentCount();
          res.status(200).json({
            product: product,
            product_length: product_length,
            category: categoryItems,
          });
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
