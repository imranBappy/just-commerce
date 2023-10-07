import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import { cpf, fetchData, postData } from "~/lib/clientFunctions";

const Spinner = dynamic(() => import("~/components/Ui/Spinner"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));
const HexColorInput = dynamic(() =>
  import("react-colorful").then((mod) => mod.HexColorInput)
);
const HexColorPicker = dynamic(() =>
  import("react-colorful").then((mod) => mod.HexColorPicker)
);

const SettingsPage = () => {
  const url = `/api/settings`;
  const { data, error } = useSWR(url, fetchData);
  const [settings, setSettings] = useState([]);
  const [buttonState, setButtonState] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState({});
  const [primary, setPrimary] = useState("#000000");
  const [primary_hover, setPrimary_hover] = useState("#000000");
  const [secondary, setSecondary] = useState("#000000");
  const [body_gray_color, setBodyGrayColor] = useState("#000000");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.settings) {
      setSettings(data.settings);
      setSelectedCurrency(data.settings.currency);
      setPrimary(data.settings.color.primary);
      setPrimary_hover(data.settings.color.primary_hover);
      setSecondary(data.settings.color.secondary);
      setBodyGrayColor(data.settings.color.body_gray);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "settings"));
  }, [session]);

  const name = useRef();
  const title = useRef();
  const language = useRef();
  const currency = useRef();
  const exchangeRate = useRef();

  const updateCurrency = () => {
    const data = {
      name: currency.current.value,
      symbol: currency.current.selectedOptions[0].getAttribute("data-symbol"),
    };
    setSelectedCurrency(data);
  };

  const getContrastYIQ = (hexcolor) => {
    try {
      hexcolor = hexcolor.replace("#", "");
      var r = parseInt(hexcolor.substr(0, 2), 16);
      var g = parseInt(hexcolor.substr(2, 2), 16);
      var b = parseInt(hexcolor.substr(4, 2), 16);
      var yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq >= 160 ? "#333333" : "#ffffff";
    } catch (err) {
      console.log(err);
      return "#333333";
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    try {
      setButtonState("loading");
      const color = JSON.stringify({
        primary: primary,
        primary_hover: primary_hover,
        secondary: secondary,
        body_gray: body_gray_color,
        body_gray_contrast: getContrastYIQ(body_gray_color),
        primary_contrast: getContrastYIQ(primary),
        primary_hover_contrast: getContrastYIQ(primary_hover),
        secondary_contrast: getContrastYIQ(secondary),
      });
      const data = {
        name: name.current.value,
        title: title.current.value,
        currencyName: currency.current.value,
        currencySymbol:
          currency.current.selectedOptions[0].getAttribute("data-symbol"),
        exchangeRate: exchangeRate.current.value,
        color,
        language: language.current.value,
      };
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key].trim());
      }
      const response = await postData(`/api/settings?scope=general`, formData);
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
        <>
          <form onSubmit={handleForm}>
            <div className="card mb-5 border-0 shadow">
              <div className="card-header bg-white py-3 fw-bold">
                {t("General Settings")}
              </div>
              <div className="card-body">
                <div className="py-3">
                  <label htmlFor="inp-1" className="form-label">
                    {t("Application Name")}*
                  </label>
                  <input
                    type="text"
                    ref={name}
                    defaultValue={settings.name}
                    id="inp-1"
                    className="form-control"
                    required
                  />
                </div>
                <div className="py-3">
                  <label htmlFor="inp-2" className="form-label">
                    {t("Home Page Title")}*
                  </label>
                  <input
                    type="text"
                    ref={title}
                    defaultValue={settings.title}
                    id="inp-2"
                    className="form-control"
                    required
                  />
                </div>
                <div className="py-3">
                  <label htmlFor="inp-17" className="form-label">
                    {t("System Default Language")}*
                  </label>
                  <select
                    id="inp-17"
                    ref={language}
                    defaultValue={settings.language}
                    className="form-control"
                    required
                  >
                    <option value="en">English</option>
                    <option value="bn">Bangla</option>
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div className="py-3">
                  <label htmlFor="inp-7" className="form-label">
                    {t("System Default Currency")}*
                  </label>
                  <select
                    id="inp-7"
                    ref={currency}
                    defaultValue={settings.currency.name}
                    onChange={updateCurrency}
                    className="form-control"
                    required
                  >
                    <option value="USD" data-symbol="$">
                      U.S. Dollar ($)
                    </option>
                    <option value="AUD" data-symbol="$">
                      Australian Dollar ($)
                    </option>
                    <option value="BRL" data-symbol="R$">
                      Brazilian Real (R$)
                    </option>
                    <option value="CAD" data-symbol="$">
                      Canadian Dollar ($)
                    </option>
                    <option value="CZK" data-symbol="Kč">
                      Czech Koruna (Kč)
                    </option>
                    <option value="DKK" data-symbol="kr">
                      Danish Krone (kr)
                    </option>
                    <option value="EUR" data-symbol="€">
                      Euro (€)
                    </option>
                    <option value="HKD" data-symbol="$">
                      Hong Kong Dollar ($)
                    </option>
                    <option value="HUF" data-symbol="Ft">
                      Hungarian Forint (Ft)
                    </option>
                    <option value="ILS" data-symbol="₪">
                      Israeli New Sheqel (₪)
                    </option>
                    <option value="JPY" data-symbol="¥">
                      Japanese Yen (¥)
                    </option>
                    <option value="MYR" data-symbol="RM">
                      Malaysian Ringgit (RM)
                    </option>
                    <option value="MXN" data-symbol="$">
                      Mexican Peso ($)
                    </option>
                    <option value="NOK" data-symbol="kr">
                      Norwegian Krone (kr)
                    </option>
                    <option value="NZD" data-symbol="$">
                      New Zealand Dollar ($)
                    </option>
                    <option value="PHP" data-symbol="₱">
                      Philippine Peso (₱)
                    </option>
                    <option value="PLN" data-symbol="zł">
                      Polish Zloty (zł)
                    </option>
                    <option value="GBP" data-symbol="£">
                      Pound Sterling (£)
                    </option>
                    <option value="RUB" data-symbol="руб">
                      Russian Ruble (руб)
                    </option>
                    <option value="SGD" data-symbol="$">
                      Singapore Dollar ($)
                    </option>
                    <option value="SEK" data-symbol="kr">
                      Swedish Krona (kr)
                    </option>
                    <option value="CHF" data-symbol="CHF">
                      Swiss Franc (CHF)
                    </option>
                    <option value="THB" data-symbol="฿">
                      Thai Baht (฿)
                    </option>
                    <option value="BDT" data-symbol="৳">
                      Taka (৳)
                    </option>
                    <option value="Rupee" data-symbol="Rs">
                      Indian Rupee (Rs)
                    </option>
                    <option value="KSH" data-symbol="KSh">
                      Kenya currency (KSh)
                    </option>
                  </select>
                </div>
                <div className="py-3">
                  <label htmlFor="inp-4" className="form-label">
                    {t("Currency exchange rate")} ( 1 {selectedCurrency.name} =
                    ? USD )
                  </label>
                  <input
                    type="number"
                    ref={exchangeRate}
                    defaultValue={settings.currency.exchangeRate}
                    id="inp-4"
                    step=".00000001"
                    className="form-control"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="card mb-5 border-0 shadow">
              <div className="card-header bg-white py-3 fw-bold">
                {t("Appearance Settings")}
              </div>
              <div className="card-body">
                <div className="app_set">
                  <div className="py-3">
                    <label htmlFor="inp-5" className="form-label">
                      {t("Primary Color")}
                    </label>
                    <HexColorPicker color={primary} onChange={setPrimary} />
                    <br />
                    <HexColorInput color={primary} onChange={setPrimary} />
                  </div>
                  <div className="py-3">
                    <label htmlFor="inp-6" className="form-label">
                      {t("Primary Hover Color")}
                    </label>
                    <HexColorPicker
                      color={primary_hover}
                      onChange={setPrimary_hover}
                    />
                    <br />
                    <HexColorInput
                      color={primary_hover}
                      onChange={setPrimary_hover}
                    />
                  </div>
                  <div className="py-3">
                    <label htmlFor="inp-7" className="form-label">
                      {t("Secondary Color")}
                    </label>
                    <HexColorPicker color={secondary} onChange={setSecondary} />
                    <br />
                    <HexColorInput color={secondary} onChange={setSecondary} />
                  </div>
                  <div className="py-3">
                    <label htmlFor="inp-13" className="form-label">
                      {t("Body Gray Color")}
                    </label>
                    <HexColorPicker
                      color={body_gray_color}
                      onChange={setBodyGrayColor}
                    />
                    <br />
                    <HexColorInput
                      color={body_gray_color}
                      onChange={setBodyGrayColor}
                    />
                  </div>
                </div>
              </div>
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
          </form>
        </>
      )}
    </>
  );
};

SettingsPage.requireAuthAdmin = true;
SettingsPage.dashboard = true;

export default SettingsPage;
