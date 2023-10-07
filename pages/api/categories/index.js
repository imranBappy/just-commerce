import customId from "custom-id-new";
import s3DeleteFiles from "~/lib/s3Delete";
import sessionChecker from "~/lib/sessionPermission";
import { convertToSlug } from "../../../middleware/functions";
import categoryModel from "../../../models/category";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "category")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await categoryModel.find({});
        res.status(200).json({ success: true, category: data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const data = req.body;
        const image = data.categoryImage;
        const random = customId({ randomLength: 2, lowerCase: true });
        const categoryData = {
          categoryId: random,
          name: data.name.trim(),
          icon: image,
          slug: convertToSlug(data.name, false),
        };
        await categoryModel.create(categoryData);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const data = await categoryModel.findById(req.query.id);
        const icon = [{ Key: data.icon[0]?.name }];
        await s3DeleteFiles(icon);
        await data.remove();
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
