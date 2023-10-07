import { ShieldFillCheck } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const SettingsPageGateway = () => {
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

  const purchaseLogin = useRef();

  const handleForm = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const data = await JSON.stringify({
        loginForPurchase: purchaseLogin.current.checked,
      });
      const formData = new FormData();
      formData.append("security", data);
      const response = await postData(`/api/settings?scope=security`, formData);
      response.success
        ? toast.success("Setting Updated Successfully")
        : toast.error(`Something Went Wrong (500)`);
      setButtonState("");
    } catch (err) {
      toast.error(`Something Went Wrong (${err.message})`);
    }
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
              {t("Security Settings")}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-xl-4 col-lg-6">
                  <div className="card mb-5 border-0 shadow">
                    <div className="card-header bg-white py-3 text-center fw-bold">
                      {t("Login Required For Purchase")}
                    </div>
                    <div className="card-body">
                      <div className="float-start">
                        <ShieldFillCheck
                          height={50}
                          width={50}
                          className="text-success"
                        />
                      </div>
                      <div className="form-check form-switch my-3 float-end">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="inp-110"
                          ref={purchaseLogin}
                          defaultChecked={settings.security.loginForPurchase}
                        />
                        <label className="form-check-label" htmlFor="inp-110">
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

SettingsPageGateway.requireAuthAdmin = true;
SettingsPageGateway.dashboard = true;

export default SettingsPageGateway;
