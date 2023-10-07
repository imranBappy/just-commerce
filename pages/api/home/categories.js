import CategoryModel from "~/models/category";
import settingModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        let category = [];
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        if (req.query.only_category === "true") {
          category = await CategoryModel.find({})
            .select({
              _id: 0,
              categoryId: 1,
              name: 1,
              slug: 1,
              icon: 1,
              subCategories: 1,
              img: 1,
            })
            .limit(10);
          return res.status(200).json({ success: true, category });
        }
        category = await CategoryModel.find({}).select({
          _id: 0,
          categoryId: 1,
          name: 1,
          slug: 1,
          icon: 1,
          subCategories: 1,
          img: 1,
        });
        const settings = await settingModel.findOne({});
        res.status(200).json({ success: true, category, settings });
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
