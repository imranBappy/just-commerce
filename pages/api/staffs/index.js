import bcrypt from "bcrypt";
import { getToken } from "next-auth/jwt";
import userModel from "~/models/user";
import dbConnect from "~/utils/dbConnect";

const fields = [
  "-orders",
  "-favorite",
  "-createdAt",
  "-updatedAt",
  "-hash",
  "-salt",
  "-isAdmin",
];

export default async function apiHandler(req, res) {
  const { method } = req;
  const secret = process.env.AUTH_SECRET;
  const session = await getToken({ req, secret });
  if (!session || !session.user.a)
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        let users = {};
        if (req.query.id) {
          users = await userModel.findOne({ _id: req.query.id }).select(fields);
        } else {
          users = await userModel
            .find({ "isStaff.status": true })
            .select(fields)
            .sort("-createdAt");
        }
        res.status(200).json({ success: true, users });
      } catch (err) {
        res.status(500).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        await userModel.findByIdAndRemove(req.query.id);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { name, surname, email, password, permissions } = req.body;
        const salt = await bcrypt.genSalt(6);
        const hash = await bcrypt.hash(password, salt);
        const userData = {
          name,
          email,
          hash,
          salt,
          isStaff: {
            status: true,
            surname,
            permissions,
          },
        };
        await userModel.create(userData);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        if (err.code == 11000) {
          res.status(200).json({
            success: false,
            message: "Email already exists, Please use a different one",
          });
        } else {
          res.status(200).json({ success: false });
        }
      }
      break;

    case "PUT":
      try {
        const { name, surname, email, permissions, id } = req.body;
        const userData = {
          name,
          email,
          isStaff: {
            status: true,
            surname,
            permissions,
          },
        };
        await userModel.updateOne({ _id: id }, userData);
        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        if (err.code == 11000) {
          res.status(200).json({
            success: false,
            message: "Email already exists, Please use a different one",
          });
        } else {
          res.status(200).json({ success: false });
        }
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
