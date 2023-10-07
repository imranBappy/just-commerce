import settingsModel from "~/models/setting";
import pageModel from "~/models/webpages";
import dbConnect from "~/utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const { query } = req;
        const pageData = await pageModel.findOne({});
        const settings = await settingsModel.findOne({});
        res.setHeader("Cache-Control", "s-maxage=6000, stale-while-revalidate");
        //Check Data Scope
        switch (query.scope) {
          case "about":
            const aboutData = pageData.aboutPage;
            res.status(200).json({ success: true, page: aboutData, settings });
            break;

          case "privacy":
            const privacyData = pageData.privacyPage;
            res
              .status(200)
              .json({ success: true, page: privacyData, settings });
            break;

          case "terms":
            const termsData = pageData.termsPage;
            res.status(200).json({ success: true, page: termsData, settings });
            break;

          case "return":
            const returnData = pageData.returnPolicyPage;
            res.status(200).json({ success: true, page: returnData, settings });
            break;

          case "faq":
            const faqData = pageData.faqPage;
            res.status(200).json({ success: true, page: faqData, settings });
            break;

          default:
            return res.status(400).json({ success: false });
            break;
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
