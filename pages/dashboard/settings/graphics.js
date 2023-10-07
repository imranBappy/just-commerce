import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));
const FileUpload = dynamic(() => import("~/components/FileUpload/fileUpload"));

const SettingsPageGraphics = () => {
  const url = `/api/settings`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [settings, setSettings] = useState([]);
  const [logo, setLogo] = useState([]);
  const [favicon, setFavicon] = useState([]);
  const [gateway, setGateway] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.settings) {
      setSettings(data.settings);
      setLogo(data.settings.logo);
      setFavicon(data.settings.favicon);
      setGateway(data.settings.gatewayImage);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "settings"));
  }, [session]);

  const handleForm = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const data = {
        logo,
        favicon,
        gatewayImage: gateway,
      };
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, JSON.stringify(data[key]));
      }
      const response = await postData(`/api/settings?scope=graphics`, formData);
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
              {t("Website Graphics Content")}
            </div>
            <div className="card-body">
              <div className="py-3">
                <FileUpload
                  accept=".jpg,.png,.jpeg"
                  label={t("Website Logo(250px x 70px)")}
                  maxFileSizeInBytes={2000000}
                  updateFilesCb={setLogo}
                  preSelectedFiles={logo}
                />

                <FileUpload
                  accept=".jpg,.png,.jpeg"
                  label={t("Website Favicon(150px x 150px)")}
                  maxFileSizeInBytes={2000000}
                  updateFilesCb={setFavicon}
                  preSelectedFiles={favicon}
                />

                <FileUpload
                  accept=".jpg,.png,.jpeg"
                  label={t("Payment Gateway List Image(565px x 37px)")}
                  maxFileSizeInBytes={2000000}
                  updateFilesCb={setGateway}
                  preSelectedFiles={gateway}
                />
              </div>
              {permissions.edit && (
                <div className="py-3">
                  <LoadingButton
                    type="submit"
                    text={t("UPDATE")}
                    state={buttonState}
                  />
                </div>
              )}
            </div>
          </div>
        </form>
      )}
    </>
  );
};

SettingsPageGraphics.requireAuthAdmin = true;
SettingsPageGraphics.dashboard = true;

export default SettingsPageGraphics;
