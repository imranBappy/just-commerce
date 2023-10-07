import newsletterModel from "~/models/newsletter";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const email = req.body.email;
        let newsletter = await newsletterModel.findOne({});
        if (!newsletter) {
          newsletter = new newsletterModel({ subscribers: [] });
        }
        if (email.length > 0) {
          newsletter.subscribers.push({ email });
          await newsletter.save();
          res.status(201).json({ success: true });
        } else {
          res.status(400).json({ success: false });
        }
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
