import sessionChecker from "~/lib/sessionPermission";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "general")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const bodyData = req.body;
        const user = await userModel.findById(bodyData.id);
        const exists = await user.favorite.filter((pid) =>
          bodyData.pid.includes(pid),
        );
        if (exists.length > 0) {
          return res.status(200).json({ success: false, exists: true });
        }
        await userModel.findByIdAndUpdate(bodyData.id, {
          $push: { favorite: bodyData.pid },
        });
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        const bodyData = req.body;
        await userModel.findByIdAndUpdate(bodyData.id, {
          $pull: { favorite: bodyData.pid },
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
