import sessionChecker from "~/lib/sessionPermission";
import notificationModel from "~/models/notification";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "general")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const notification = await notificationModel
          .find({})
          .sort("-createdAt")
          .limit(20)
          .exec();
        res.status(200).json({ success: true, notification });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        await notificationModel.deleteMany({});
        res.status(200).json({ success: true });
      } catch (e) {
        console.log(e);
        res.status(200).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
