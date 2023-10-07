import { getToken } from "next-auth/jwt";
import notificationModel from "~/models/notification";
import productModel from "~/models/product";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });
  if (!session)
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { pid, question } = req.body;
        const _data = {
          userName: session.user.name,
          email: session.user.email,
          question,
        };
        const product = await productModel.findByIdAndUpdate(pid, {
          $push: { question: _data },
        });
        const message = `<p>${session.user.name} asked a question about the product (<a href="/product/${product.slug}" target="_blank">${product.name}</a>)</p>`;
        await notificationModel.create({ message });
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "PUT":
      try {
        if (!session.user.a)
          return res
            .status(403)
            .json({ success: false, message: "Access Forbidden" });

        const { id, pid, answer } = req.body;
        await productModel.findOneAndUpdate(
          { _id: pid, "question._id": id },
          {
            $set: { "question.$.answer": answer },
          },
        );
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
