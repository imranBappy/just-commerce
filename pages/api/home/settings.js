import settingModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const settings = await settingModel
          .findOne({})
          .select({
            _id: 0,
            __v: 0,
            headerCustomScript: 0,
            footerCustomScript: 0,
          });
        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        res.status(200).json({ success: true, settings });
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
