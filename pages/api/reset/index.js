import bcrypt from "bcrypt";
import customIdNew from "custom-id-new";
import sendMail from "~/lib/sendEmail";
import userModel from "~/models/user";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const token = req.query.token;
        const user = await userModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
          return res.status(200).json({
            success: false,
            token,
            err: "Password reset token is invalid or has expired.",
          });
        }
        res.status(200).json({ success: true, token, err: null });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, token, err: err.message });
      }
      break;
    case "POST":
      try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
          return res.status(200).json({
            success: false,
            err: `No account with that email address (${email}) exists.`,
          });
        }
        const token = customIdNew({ randomLength: 12, lowerCase: true });
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const mailBody = `
        You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n
        `;

        const mailOptions = {
          to: user.email,
          subject: "Account Password Reset",
          text: mailBody,
        };

        const { success } = await sendMail(mailOptions);
        if (success) {
          res.status(200).json({ success: true });
        } else {
          res.status(200).json({
            success: false,
            err: "Unable to send email cause an internal server error",
          });
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err: err.message });
      }
      break;

    case "PUT":
      try {
        const { pass, token } = req.body;
        const user = await userModel.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) {
          return res.status(200).json({
            success: false,
            err: "Password reset token is invalid or has expired.",
          });
        }
        const salt = await bcrypt.genSalt(6);
        const hash = await bcrypt.hash(pass, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        user.hash = hash;
        user.salt = salt;
        await user.save();
        res.status(200).json({ success: true, err: null });
      } catch (err) {
        res.status(500).json({ success: false, err: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
