import customId from "custom-id-new";
import sessionChecker from "~/lib/sessionPermission";
import { deleteOne } from "~/middleware/functions";
import { parseForm } from "~/utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "general")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  switch (method) {
    case "POST":
      try {
        const result = await parseForm(req);
        const imageName = result.file.file.newFilename;
        const url = `${process.env.NEXT_PUBLIC_URL}/${imageName}`;
        res.status(200).json({ success: true, name: imageName, url });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: err.message });
      }
      break;

    case "DELETE":
      try {
        const { query } = req;
        await deleteOne(query.name);
        res.status(200).json({ success: true, err: null });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, err: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
