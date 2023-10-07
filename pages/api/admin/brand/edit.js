import sessionChecker from "~/lib/sessionPermission";
import brandModel from "~/models/brand";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "brand")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const data = await brandModel.findById(req.query.id);
        res.status(200).json({ success: true, brand: data });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const data = req.body;
        const brandData = {
          name: data.name.trim(),
          image: data.image,
        };
        await brandModel.findByIdAndUpdate(data.id, brandData);
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
