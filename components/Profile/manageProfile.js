import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { fetchData, postData } from "~/lib/clientFunctions";
import LoadingButton from "../../components/Ui/Button";
import Spinner from "../../components/Ui/Spinner";
import countryData from "../../data.json";
import { useTranslation } from "react-i18next";

const ManageProfile = (props) => {
  const url = `/api/profile?id=${props.id}`;
  const { data, error, mutate } = useSWR(props.id ? url : null, fetchData);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.user) {
      setUserData(data.user);
    }
  }, [data]);

  const name = useRef();
  const phone = useRef();
  const email = useRef();
  const house = useRef();
  const city = useRef();
  const state = useRef();
  const zip = useRef();
  const country = useRef();

  const updateUserInfo = async (e) => {
    try {
      e.preventDefault();
      setLoading("loading");
      const userData = {
        name: name.current.value,
        email: email.current.value,
        phone: phone.current.value,
        house: house.current.value,
        city: city.current.value,
        state: state.current.value,
        zipCode: zip.current.value,
        country: country.current.value,
      };
      const response = await postData(
        `/api/profile?scope=info&id=${props.id}`,
        userData
      );
      response.success
        ? toast.success("Profile Updated Successfully")
        : response.duplicate
        ? toast.error("A user with the given email is already registered")
        : toast.error("Something Went Wrong (500)");
      setLoading("");
    } catch (err) {
      setLoading("");
      console.log(err);
      toast.error(`Something Went Wrong (${err.message})`);
    }
  };

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <div className="card mb-5 border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              {t("basic_information")}
            </div>
            <form onSubmit={updateUserInfo}>
              <div className="card-body">
                <div className="py-2">
                  <label className="form-label">{t("name")}</label>
                  <input
                    type="text"
                    className="form-control"
                    ref={name}
                    defaultValue={userData.name}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="py-2">
                      <label className="form-label">{t("phone")}*</label>
                      <input
                        type="tel"
                        className="form-control"
                        ref={phone}
                        defaultValue={userData.phone}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="py-2">
                      <label className="form-label">{t("email")}*</label>
                      <input
                        type="email"
                        className="form-control"
                        ref={email}
                        defaultValue={userData.email}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  <label className="form-label">{t("house_street")}</label>
                  <textarea
                    className="form-control"
                    ref={house}
                    rows="2"
                    defaultValue={userData.house}
                  />
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="py-2">
                      <label className="form-label">{t("city")}</label>
                      <input
                        type="text"
                        className="form-control"
                        ref={city}
                        defaultValue={userData.city}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="py-2">
                      <label className="form-label">
                        {t("state_province")}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        ref={state}
                        defaultValue={userData.state}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="py-2">
                      <label className="form-label">{t("post_zip_code")}</label>
                      <input
                        type="text"
                        className="form-control"
                        ref={zip}
                        defaultValue={userData.zipCode}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="py-2">
                      <label className="form-label">
                        {t("select_country")}
                      </label>
                      <select
                        className="form-control"
                        ref={country}
                        value={userData.country}
                      >
                        <option value="">{t("select_country")}</option>
                        {countryData.country.map((ct) => (
                          <option value={ct.name} key={ct.name}>
                            {ct.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="py-3">
                    <LoadingButton
                      text="Update"
                      state={loading}
                      type="submit"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageProfile;
