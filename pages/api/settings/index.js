import { writeFileSync } from "fs";
import s3DeleteFiles from "~/lib/s3Delete";
import sessionChecker from "~/lib/sessionPermission";
import settingModel from "~/models/setting";
import dbConnect from "~/utils/dbConnect";
import { parseForm } from "~/utils/parseForm";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function apiHandler(req, res) {
  const { method } = req;
  if (!(await sessionChecker(req, "settings")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const settings = await settingModel.findOne({});
        res.status(200).json({ success: true, settings });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false });
      }
      break;

    case "POST":
      try {
        const { query } = req;
        const bodyData = await parseForm(req);
        let settingData = await settingModel.findOne({});
        if (settingData === null) {
          settingData = new settingModel({ name: "" });
        }
        //Check Data Scope
        switch (query.scope) {
          case "general":
            const color_data = await JSON.parse(bodyData.field.color);
            settingData.name = bodyData.field.name;
            settingData.title = bodyData.field.title;
            settingData.currency = {
              name: bodyData.field.currencyName,
              symbol: bodyData.field.currencySymbol,
              exchangeRate: bodyData.field.exchangeRate,
            };
            settingData.color = color_data;
            settingData.language = bodyData.field.language;
            await settingData.save();
            break;

          case "layout":
            const footerBanner = await JSON.parse(bodyData.field.footerBanner);
            const socialLink = await JSON.parse(bodyData.field.social);
            settingData.phoneHeader = bodyData.field.phoneHeader;
            settingData.shortAddress = bodyData.field.shortAddress;
            settingData.phoneFooter = bodyData.field.phoneFooter;
            settingData.email = bodyData.field.email;
            settingData.address = bodyData.field.address;
            settingData.description = bodyData.field.description;
            settingData.copyright = bodyData.field.copyright;
            settingData.footerBanner = footerBanner;
            settingData.social = socialLink;
            await settingData.save();
            break;

          case "graphics":
            const logo = await JSON.parse(bodyData.field.logo);
            const favicon = await JSON.parse(bodyData.field.favicon);
            const gatewayImage = await JSON.parse(bodyData.field.gatewayImage);
            if (
              settingData.logo[0] &&
              settingData.logo[0].name !== logo[0].name
            ) {
              const fileName = [{ Key: settingData.logo[0].name }];
              await s3DeleteFiles(fileName);
            }
            if (
              settingData.favicon[0] &&
              settingData.favicon[0].name !== favicon[0].name
            ) {
              const fileName = [{ Key: settingData.favicon[0].name }];
              await s3DeleteFiles(fileName);
            }
            if (
              settingData.gatewayImage[0] &&
              settingData.gatewayImage[0].name !== gatewayImage[0].name
            ) {
              const fileName = [{ Key: settingData.gatewayImage[0].name }];
              await s3DeleteFiles(fileName);
            }
            settingData.logo = logo;
            settingData.favicon = favicon;
            settingData.gatewayImage = gatewayImage;
            await settingData.save();
            break;

          case "seo":
            const metaImage = await JSON.parse(bodyData.field.image);
            if (
              settingData.seo.image[0] &&
              settingData.seo.image[0].name !== metaImage[0].name
            ) {
              const fileName = [{ Key: settingData.seo.image[0].name }];
              await s3DeleteFiles(fileName);
            }
            settingData.seo.title = bodyData.field.title;
            settingData.seo.description = bodyData.field.description;
            settingData.seo.keyword = bodyData.field.keyword;
            settingData.seo.image = metaImage;
            await settingData.save();
            break;

          case "script":
            settingData.script = await JSON.parse(bodyData.field.script);
            await settingData.save();
            break;

          case "gateway":
            settingData.paymentGateway = await JSON.parse(
              bodyData.field.gateway
            );
            await settingData.save();
            break;

          case "login":
            settingData.login = await JSON.parse(bodyData.field.login);
            await settingData.save();
            break;

          case "security":
            settingData.security = await JSON.parse(bodyData.field.security);
            await settingData.save();
            break;

          case "sitemap":
            writeFileSync("public/sitemap.xml", bodyData.field.sitemap);
            break;

          case "robot":
            writeFileSync("public/robots.txt", bodyData.field.robots);
            break;

          default:
            return res.status(400).json({ success: false });
            break;
        }

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
