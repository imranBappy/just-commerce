import sessionChecker from "~/lib/sessionPermission";
import newsletterModel from "~/models/newsletter";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "subscriber")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const subscribers = await newsletterModel.findOne({});
        res.status(200).json({ success: true, subscribers: subscribers || [] });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        await newsletterModel.updateOne(
          {},
          {
            $pull: { subscribers: { _id: req.query.id } },
          },
        );
        res.status(200).json({ success: true });
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
