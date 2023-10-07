import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import LoadingButton from "~/components/Ui/Button";
import Spinner from "~/components/Ui/Spinner";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";
import Switch from 'react-switch';

const SettingsPageLayout = () => {
  const url = `/api/settings`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [settings, setSettings] = useState([]);
  const { t } = useTranslation();
  const [internationalShippingActive, setInternationalShippingActive] = useState(true);

  useEffect(() => {
    if (data && data.settings) {
      setSettings(data.settings);
    }
  }, [data]);
  const [buttonState, setButtonState] = useState("");
  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "settings"));
  }, [session]);

  const phoneHeader = useRef();
  const phoneFooter = useRef();
  const email = useRef();
  const shortAddress = useRef();
  const address = useRef();
  const description = useRef();
  const copyright = useRef();
  const facebook = useRef();
  const instagram = useRef();
  const twitter = useRef();
  const youtube = useRef();
  const pinterest = useRef();
  const security1 = useRef();
  const security2 = useRef();
  const support1 = useRef();
  const support2 = useRef();
  const delivery1 = useRef();
  const delivery2 = useRef();

  const handleForm = async (e) => {
    e.preventDefault();
    setButtonState("loading");
    try {
      const footerBanner = {
        security: {
          title: security1.current.value.trim(),
          description: security2.current.value.trim(),
        },
        support: {
          title: support1.current.value.trim(),
          description: support2.current.value.trim(),
        },
        delivery: {
          title: delivery1.current.value.trim(),
          description: delivery2.current.value.trim(),
        },
      };
      const social = {
        facebook: facebook.current.value.trim(),
        instagram: instagram.current.value.trim(),
        twitter: twitter.current.value.trim(),
        youtube: youtube.current.value.trim(),
        pinterest: pinterest.current.value.trim(),
      };
      const data = {
        phoneHeader: phoneHeader.current.value.trim(),
        shortAddress: shortAddress.current.value.trim(),
        phoneFooter: phoneFooter.current.value.trim(),
        email: email.current.value.trim(),
        address: address.current.value.trim(),
        description: description.current.value.trim(),
        copyright: copyright.current.value.trim(),
        social: JSON.stringify(social),
        footerBanner: JSON.stringify(footerBanner),
      };
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }
      const response = await postData(`/api/settings?scope=layout`, formData);
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
          {headerSettings()}
          {footerSettings()}
          {footerBannerSettings()}
          {socialSettings()}
          {permissions.edit && (
            <div className="py-3">
              <LoadingButton type="submit" text="Update" state={buttonState} />
            </div>
          )}
        </form>
      )}
    </>
  );

  function socialSettings() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">
          {t("Social Link Settings")}
        </div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-6" className="form-label">
              Facebook
            </label>
            <input
              type="url"
              ref={facebook}
              defaultValue={settings.social.facebook}
              id="inp-6"
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-7" className="form-label">
              Instagram
            </label>
            <input
              type="url"
              ref={instagram}
              defaultValue={settings.social.instagram}
              id="inp-7"
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-8" className="form-label">
              Twitter
            </label>
            <input
              type="url"
              ref={twitter}
              defaultValue={settings.social.twitter}
              id="inp-8"
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-9" className="form-label">
              Youtube
            </label>
            <input
              type="url"
              ref={youtube}
              defaultValue={settings.social.youtube}
              id="inp-9"
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-10" className="form-label">
              Pinterest
            </label>
            <input
              type="url"
              ref={pinterest}
              defaultValue={settings.social.pinterest}
              id="inp-10"
              className="form-control"
            />
          </div>
        </div>
      </div>
    );
  }

  function footerSettings() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">{t("Footer Settings")}</div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-3" className="form-label">
              {t("Email Address")}
            </label>
            <input
              type="text"
              ref={email}
              id="inp-3"
              defaultValue={settings.email}
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-4" className="form-label">
              {t("Phone Number")}
            </label>
            <input
              type="text"
              ref={phoneFooter}
              id="inp-4"
              defaultValue={settings.phoneFooter}
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-5" className="form-label">
              {t("Full Address")}*
            </label>
            <textarea
              id="inp-5"
              ref={address}
              defaultValue={settings.address}
              className="form-control"
              required
            ></textarea>
          </div>
          <div className="py-3">
            <label htmlFor="inp-15" className="form-label">
              {t("About description")}*
            </label>
            <textarea
              id="inp-15"
              ref={description}
              defaultValue={settings.description}
              className="form-control"
              required
            ></textarea>
          </div>
          <div className="py-3">
            <label htmlFor="inp-4" className="form-label">
              {t("Copyright")}
            </label>
            <input
              type="text"
              ref={copyright}
              id="inp-4"
              defaultValue={settings.copyright}
              className="form-control"
            />
          </div>
        </div>
      </div>
    );
  }

  function footerBannerSettings() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">{t("Footer Widget")}</div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-31" className="form-label">
              {t("Security Title")}
            </label>
            <input
              type="text"
              ref={security1}
              id="inp-31"
              defaultValue={settings.footerBanner.security.title}
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-32" className="form-label">
              {t("Security Short Description")}
            </label>
            <input
              type="text"
              ref={security2}
              id="inp-32"
              defaultValue={settings.footerBanner.security.description}
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-33" className="form-label">
              {t("Support Title")}
            </label>
            <input
              type="text"
              ref={support1}
              id="inp-33"
              defaultValue={settings.footerBanner.support.title}
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-34" className="form-label">
              {t("Support Short Description")}
            </label>
            <input
              type="text"
              ref={support2}
              id="inp-34"
              defaultValue={settings.footerBanner.support.description}
              className="form-control"
            />
          </div>
          
         
          <div className="py-3">
            <label htmlFor="inp-35" className="form-label">
              {t("Delivery Title")}
            </label>
            <input
              type="text"
              ref={delivery1}
              id="inp-35"
              defaultValue={settings.footerBanner.delivery.title}
              className="form-control"
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-36" className="form-label">
              {t("Delivery Short Description")}
            </label>
            <input
              type="text"
              ref={delivery2}
              id="inp-36"
              defaultValue={settings.footerBanner.delivery.description}
              className="form-control"
            />
          </div>
        </div>
      </div>
    );
  }

  function headerSettings() {
    return (
      <div className="card mb-5 border-0 shadow">
        <div className="card-header bg-white py-3 fw-bold">{t("Header Settings")}</div>
        <div className="card-body">
          <div className="py-3">
            <label htmlFor="inp-1" className="form-label">
              {t("Phone Number")}*
            </label>
            <input
              type="text"
              ref={phoneHeader}
              id="inp-1"
              defaultValue={settings.phoneHeader}
              className="form-control"
              required
            />
          </div>
          <div className="py-3">
            <label htmlFor="inp-2" className="form-label">
              {t("Short Address")}*
            </label>
            <input
              type="text"
              ref={shortAddress}
              id="inp-2"
              defaultValue={settings.shortAddress}
              className="form-control"
              required
            />
          </div>
        </div>
      </div>
    );
  }
};

SettingsPageLayout.requireAuthAdmin = true;
SettingsPageLayout.dashboard = true;

export default SettingsPageLayout;
