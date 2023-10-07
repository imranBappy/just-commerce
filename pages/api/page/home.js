import customIdNew from "custom-id-new";
import s3DeleteFiles from "~/lib/s3Delete";
import sessionChecker from "~/lib/sessionPermission";
import pageModel from "../../../models/webpages";
import dbConnect from "../../../utils/dbConnect";

export default async function apiHandler(req, res) {
  const { method } = req;

  if (!(await sessionChecker(req, "pageSettings")))
    return res
      .status(403)
      .json({ success: false, message: "Access Forbidden" });

  await dbConnect();

  switch (method) {
    case "POST":
      try {
        const { query, body } = req;
        let pageData = await pageModel.findOne({});
        if (pageData === null) {
          pageData = new pageModel({ aboutPage: { content: "" } });
        }
        //Check Data Scope
        switch (query.scope) {
          case "carousel":
            const { title, subTitle, description, url, image } = body;
            const carouselData = {
              title,
              subTitle,
              description,
              url,
              image,
              id: customIdNew({ randomLength: 4, lowerCase: true }),
            };
            pageData.homePage.carousel.carouselData.push(carouselData);
            await pageData.save();
            break;

          case "background":
            const { background } = body;
            const arg =
              pageData.homePage.carousel.background[0].name !==
              background[0].name;
            if (arg) {
              const fileName = [
                { Key: pageData.homePage.carousel.background[0].name },
              ];
              await s3DeleteFiles(fileName);
            }
            pageData.homePage.carousel.background = background;
            await pageData.save();
            break;

          case "banner":
            const arg2 =
              pageData.homePage.banner.image[0].name !== body.image[0].name;
            if (arg2) {
              const fileName = [
                { Key: pageData.homePage.banner.image[0].name },
              ];
              await s3DeleteFiles(fileName);
            }
            const bannerData = {
              title: body.title,
              subTitle: body.subTitle,
              description: body.description,
              url: body.url,
              image: body.image,
            };
            pageData.homePage.banner = bannerData;
            await pageData.save();
            break;

          case "collection":
            const collectionItem =
              pageData.homePage.collection[query.dataScope];
            const arg3 =
              collectionItem.image[0] &&
              collectionItem.image[0].name !== body.image[0].name;
            if (arg3) {
              const fileName = [{ Key: collectionItem.image[0].name }];
              await s3DeleteFiles(fileName);
            }
            const collectionData = {
              title: body.title,
              url: body.url,
              image: body.image,
            };
            pageData.homePage.collection[query.dataScope] = collectionData;
            await pageData.save();
            break;

          default:
            return res.status(400).json({ success: false });
            break;
        }

        res.status(200).json({ success: true });
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err: err.message });
      }
      break;

    case "DELETE":
      try {
        const { query } = req;
        const pageData = await pageModel.findOne({});
        //Check Data Scope
        switch (query.scope) {
          case "carousel":
            const item = await pageData.homePage.carousel.carouselData.filter(
              (item) => item.id === query.id,
            );
            const fileName = [{ Key: item[0].image[0].name }];
            await s3DeleteFiles(fileName);
            await pageModel.updateOne(
              {},
              {
                $pull: { "homePage.carousel.carouselData": { id: query.id } },
              },
            );
            res.status(200).json({ success: true });
            break;
          default:
            res.status(400).json({ success: false });
            break;
        }
      } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, err: err.message });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
