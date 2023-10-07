import ProductModel from "~/models/product";
import settingsModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function productDetailsData(slug) {
  try {
    await dbConnect();
    const settings = await settingsModel.findOne({});
    const product = await ProductModel.findOne({ slug: slug });
    const related = product
      ? await ProductModel.find({
          categories: product.categories,
        }).limit(8)
      : [];
    return {
      success: true,
      product,
      related,
      settings,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      product: {},
      related: [],
      settings: {},
    };
  }
}
