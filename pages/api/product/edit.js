import sessionChecker from "~/lib/sessionPermission";
import attrModel from "../../../models/attributes";
import brandModel from "../../../models/brand";
import CategoryModel from "../../../models/category";
import colorModel from "../../../models/colors";
import ProductModel from "../../../models/product";
import dbConnect from "../../../utils/dbConnect";
import { parseFormMultiple } from "../../../utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "product")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { slug } = req.query;
        const product = await ProductModel.findOne({ slug: slug });
        const category = await CategoryModel.find({});
        const attribute = await attrModel.find({});
        const color = await colorModel.find({});
        const brand = await brandModel.find({});
        res
          .status(200)
          .json({ success: true, product, category, attribute, color, brand });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const data = await parseFormMultiple(req);
        const {
          name,
          unit,
          unit_val,
          sale_price,
          description,
          short_description,
          type,
          category,
          subcategory,
          brand,
          qty,
          trending,
          new_product,
          best_selling,
          sku,
          color,
          main_price,
          attribute,
          selectedAttribute,
          variant,
          pid,
          displayImage,
          galleryImages,
          seo,
          deliveryPrice
        } = data.field;
        const categories = await JSON.parse(category);
        const subcategories = await JSON.parse(subcategory);
        const image = await JSON.parse(displayImage);
        const gallery = await JSON.parse(galleryImages);
        const colors = await JSON.parse(color);
        const delivery = await JSON.parse(deliveryPrice);
        const attributes = await JSON.parse(attribute);
        const variants = await JSON.parse(variant);
        const seoData = await JSON.parse(seo);
        const discount = (main_price - (sale_price / 100) * main_price).toFixed(
          1,
        );
        let productData;
        if (type === "simple") {
          productData = {
            name: name.trim(),
            unit: unit.trim(),
            unitValue: unit_val.trim(),
            price: main_price,
            discount,
            shortDescription: short_description.trim(),
            description,
            type,
            categories,
            subcategories,
            brand: brand.trim(),
            quantity: qty,
            trending: trending ? true : false,
            new: new_product ? true : false,
            bestSelling: best_selling ? true : false,
            sku,
            image,
            gallery,
            seo: seoData,
            deliveryPrice: delivery
          };
        } else {
          productData = {
            name: name.trim(),
            unit: unit.trim(),
            unitValue: unit_val.trim(),
            price: main_price,
            discount,
            shortDescription: short_description.trim(),
            description,
            type,
            categories,
            subcategories,
            brand: brand.trim(),
            trending: trending ? true : false,
            new: new_product ? true : false,
            bestSelling: best_selling ? true : false,
            colors,
            attributes,
            variants,
            attributeIndex: selectedAttribute,
            image,
            gallery,
            seo: seoData,
            deliveryPrice: delivery
          };
        }
        await ProductModel.findByIdAndUpdate(pid, {
          ...productData,
             template: JSON.parse(data.field?.template || '[]')
        });

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
