import { useSelector } from "react-redux";
import FPixel from "./fpixel";
import Gtag from "./gtag";
import FacebookChat from "./messenger";

export default function ThirdPartyScript() {
  const settings = useSelector((state) => state.settings);
  const GA_TRACKING_ID = settings.settingsData.script.googleAnalyticsId;
  const FB_PIXEL_ID = settings.settingsData.script.facebookPixelId;
  const FB_MESSENGER_ID = settings.settingsData.script.messengerPageId;

  return (
    <>
      {GA_TRACKING_ID && <Gtag id={GA_TRACKING_ID} />}
      {FB_PIXEL_ID && <FPixel id={FB_PIXEL_ID} />}
      {FB_MESSENGER_ID && <FacebookChat pageId={FB_MESSENGER_ID} />}
    </>
  );
}
