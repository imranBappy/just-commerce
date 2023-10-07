import brandModel from "~/models/brand";
import categoryModel from "~/models/category";
import ProductModel from "~/models/product";
import settingsModel from "~/models/setting";
import PageModel from "~/models/webpages";
import dbConnect from "~/utils/dbConnect";

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

export default async function homePageData(type, query) {
  try {
    await dbConnect();
    const category = await categoryModel.find({ topCategory: true }).select({
      name: 1,
      slug: 1,
      icon: 1,
    });
    const trending = await ProductModel.find({ trending: true }).select(
      productItemField
    );
    const newProduct = await ProductModel.find({ new: true }).select(
      productItemField
    );
    const brand = await brandModel.find({ topBrand: true });
    const bestSelling = await ProductModel.find({
      bestSelling: true,
    }).select(productItemField);
    const page = await PageModel.findOne({}).select("homePage");
    const settings = await settingsModel.findOne({});
    return {
      success: true,
      category: category,
      additional: page,
      trending,
      newProduct,
      bestSelling,
      brand,
      settings,
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      category: [],
      additional: {},
      trending: [],
      newProduct: [],
      bestSelling: [],
      brand: [],
      settings: {},
    };
  }
}
