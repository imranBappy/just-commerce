import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import ImageLoader from "~/components/Image";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const SettingsPageLogin = () => {
  const url = `/api/settings`;
  const { data, error } = useSWR(url, fetchData);
  const [settings, setSettings] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.settings) {
      setSettings(data.settings);
    }
  }, [data]);

  const facebook = useRef();
  const google = useRef();

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "settings"));
  }, [session]);

  const handleForm = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const data = await JSON.stringify({
        facebook: facebook.current.checked,
        google: google.current.checked,
      });
      const formData = new FormData();
      formData.append("login", data);
      const response = await postData(`/api/settings?scope=login`, formData);
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
              {t("Social Media Login Settings")}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      {t("Google Login")}
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <ImageLoader
                          src="/images/google.png"
                          width={100}
                          height={50}
                          alt="COD"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-110"
                          ref={google}
                          defaultChecked={settings.login.google}
                        />
                        <label className="form-check-label" htmlFor="inp-110">
                          {t("Status")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      {t("Facebook Login")}
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <ImageLoader
                          src="/images/facebook.png"
                          width={100}
                          height={50}
                          alt="facebook"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-111"
                          ref={facebook}
                          defaultChecked={settings.login.facebook}
                        />
                        <label className="form-check-label" htmlFor="inp-111">
                          {t("Status")}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
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

SettingsPageLogin.requireAuthAdmin = true;
SettingsPageLogin.dashboard = true;

export default SettingsPageLogin;
