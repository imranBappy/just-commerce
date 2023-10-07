import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const SettingsPageScript = () => {
  const url = `/api/settings`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [settings, setSettings] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.settings) {
      setSettings(data.settings);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "settings"));
  }, [session]);

  const gsvId = useRef();
  const fbAppId = useRef();
  const gaId = useRef();
  const fbPixelId = useRef();
  const fbMessengerId = useRef();

  const handleForm = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const data = await JSON.stringify({
        googleSiteVerificationId: gsvId.current.value.trim(),
        facebookAppId: fbAppId.current.value.trim(),
        googleAnalyticsId: gaId.current.value.trim(),
        facebookPixelId: fbPixelId.current.value.trim(),
        messengerPageId: fbMessengerId.current.value.trim(),
      });
      const formData = new FormData();
      formData.append("script", data);
      const response = await postData(`/api/settings?scope=script`, formData);
      response.success
        ? toast.success("Setting Updated Successfully")
        : toast.error(`Something Went Wrong (500)`);
    } catch (err) {
      toast.error(`Something Went Wrong (${err.message})`);
    }
    setButtonState("");
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !settings._id ? (
        <Spinner />
      ) : (
        <form onSubmit={handleForm}>
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              {t("Scripts Settings")}
            </div>
            <div className="card-body">
              <div className="py-3">
                <label htmlFor="inp-1" className="form-label">
                  {t("Google Site Verification Id")}
                </label>
                <input
                  type="text"
                  ref={gsvId}
                  id="inp-1"
                  defaultValue={settings.script.googleSiteVerificationId}
                  className="form-control"
                />
              </div>
              <div className="py-3">
                <label htmlFor="inp-2" className="form-label">
                  {t("Google Analytics Id")}
                </label>
                <input
                  type="text"
                  ref={gaId}
                  id="inp-2"
                  defaultValue={settings.script.googleAnalyticsId}
                  className="form-control"
                />
              </div>
              <div className="py-3">
                <label htmlFor="inp-3" className="form-label">
                  {t("Facebook App Id")}
                </label>
                <input
                  type="text"
                  ref={fbAppId}
                  id="inp-3"
                  defaultValue={settings.script.facebookAppId}
                  className="form-control"
                />
              </div>
              <div className="py-3">
                <label htmlFor="inp-4" className="form-label">
                  {t("Facebook Pixel Id")}
                </label>
                <input
                  type="text"
                  ref={fbPixelId}
                  id="inp-4"
                  defaultValue={settings.script.facebookPixelId}
                  className="form-control"
                />
              </div>
              <div className="py-3">
                <label htmlFor="inp-5" className="form-label">
                  {t("Facebook Messenger Page Id")}
                </label>
                <input
                  type="text"
                  ref={fbMessengerId}
                  id="inp-5"
                  defaultValue={settings.script.messengerPageId}
                  className="form-control"
                />
              </div>
            </div>
          </div>
          {permissions.edit && (
            <div className="py-3">
              <LoadingButton type="submit" text={t("UPDATE")} state={buttonState} />
            </div>
          )}
        </form>
      )}
    </>
  );
};

SettingsPageScript.requireAuthAdmin = true;
SettingsPageScript.dashboard = true;

export default SettingsPageScript;
