import sessionChecker from "~/lib/sessionPermission";
import pageModel from "~/models/webpages";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  if (!(await sessionChecker(req, "pageSettings")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const pageData = await pageModel.findOne({});
        res.status(200).json({ success: true, page: pageData });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { query, body } = req;
        let pageData = await pageModel.findOne({});
        if (pageData === null) {
          pageData = new pageModel({ aboutPage: { content: "" } });
        }
        //Check Data Scope
        switch (query.scope) {
          case "about":
            pageData.aboutPage.content = body.content;
            await pageData.save();
            break;

          case "privacy":
            pageData.privacyPage.content = body.content;
            await pageData.save();
            break;

          case "terms":
            pageData.termsPage.content = body.content;
            await pageData.save();
            break;

          case "return":
            pageData.returnPolicyPage.content = body.content;
            await pageData.save();
            break;

          case "faq":
            pageData.faqPage.content = body.content;
            await pageData.save();
            break;

          default:
            return res.status(400).json({ success: false });
            break;
        }

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
