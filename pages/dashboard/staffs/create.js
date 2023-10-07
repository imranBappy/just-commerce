import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import LoadingButton from "~/components/Ui/Button";
import { postData } from "~/lib/clientFunctions";

const CreateStaff = () => {
  const [permissions, setPermissions] = useState([
    { name: "product", view: false, edit: false, delete: false },
    { name: "order", view: false, edit: false, delete: false },
    { name: "category", view: false, edit: false, delete: false },
    { name: "coupon", view: false, edit: false, delete: false },
    { name: "color", view: false, edit: false, delete: false },
    { name: "attribute", view: false, edit: false, delete: false },
    { name: "brand", view: false, edit: false, delete: false },
    { name: "shippingCharges", view: false, edit: false, delete: false },
    { name: "customers", view: false, edit: false, delete: false },
    { name: "settings", view: false, edit: false, delete: false },
    { name: "pageSettings", view: false, edit: false, delete: false },
    { name: "subscriber", view: false, edit: false, delete: false },
  ]);

  const [state, setState] = useState("");
  const { t } = useTranslation();

  const handleForm = async (e) => {
    e.preventDefault();
    setState("loading");
    try {
      const el = e.target.elements;
      const { name, surname, email, password, confirmPassword } = el;
      if (password.value !== confirmPassword.value) {
        setState("");
        return toast.error("Both Password Field Value Not Matched");
      }
      const formData = {
        name: name.value.trim(),
        surname: surname.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
        permissions,
      };
      const response = await postData(`/api/staffs`, formData);
      response.success
        ? toast.success("Staff Added Successfully")
        : response.message
        ? toast.error(response.message)
        : toast.error(`Something Went Wrong (500)`);
    } catch (err) {
      toast.error(`Something Went Wrong (${err.message})`);
    }
    setState("");
  };

  function updatePermission(name, target, value) {
    const idx = permissions.findIndex((x) => x.name === name);
    if (idx > -1) {
      const __item = permissions[idx];
      const __field = (__item[target] = value.checked);
    }
  }

  function convertToTitle(text) {
    const _r = text.replace(/([A-Z])/g, " $1");
    return _r.charAt(0).toUpperCase() + _r.slice(1);
  }
  return (
    <>
      <form onSubmit={handleForm}>
        <div className="card mb-5 border-0 shadow">
          <div className="card-header bg-white py-3 fw-bold">
            {t("Staff Information")}
          </div>
          <div className="card-body">
            <div className="py-3">
              <label htmlFor="inp-001" className="form-label">
                {t("name")}
              </label>
              <input
                type="text"
                id="inp-001"
                name="name"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-002" className="form-label">
                {t("Surname")}
              </label>
              <input
                type="text"
                id="inp-002"
                name="surname"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-003" className="form-label">
                {t("email")}
              </label>
              <input
                type="email"
                id="inp-003"
                name="email"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-004" className="form-label">
                {t("password")}
              </label>
              <input
                type="password"
                id="inp-004"
                name="password"
                className="form-control"
                required
              />
            </div>
            <div className="py-3">
              <label htmlFor="inp-005" className="form-label">
                {t("confirm_password")}
              </label>
              <input
                type="password"
                id="inp-005"
                name="confirmPassword"
                className="form-control"
                required
              />
            </div>
          </div>
        </div>
        <div className="card mb-5 border-0 shadow">
          <div className="card-header bg-white py-3 fw-bold">
            {t("Staff permissions")}
          </div>
          <div className="card-body">
            {permissions.map((item, idx) => (
              <div className="py-3" key={idx}>
                <h6 className="text-primary fw-bold">{convertToTitle(item.name)}</h6>
                <div className="form-check form-switch form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={idx + "view"}
                    defaultChecked={item.view}
                    onChange={(e) =>
                      updatePermission(item.name, "view", e.target)
                    }
                  />
                  <label className="form-check-label" htmlFor={idx + "view"}>
                    {t("View")}
                  </label>
                </div>
                <div className="form-check form-switch form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={idx + "edit"}
                    defaultChecked={item.edit}
                    onChange={(e) =>
                      updatePermission(item.name, "edit", e.target)
                    }
                  />
                  <label className="form-check-label" htmlFor={idx + "edit"}>
                    {t("Edit")}
                  </label>
                </div>
                <div className="form-check form-switch form-check-inline">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={idx + "delete"}
                    defaultChecked={item.delete}
                    onChange={(e) =>
                      updatePermission(item.name, "delete", e.target)
                    }
                  />
                  <label className="form-check-label" htmlFor={idx + "delete"}>
                    {t("Delete")}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="py-3">
          <LoadingButton text={t("Create Staff")} type="submit" state={state} />
        </div>
      </form>
    </>
  );
};

CreateStaff.requireAuthAdmin = true;
CreateStaff.dashboard = true;

export default CreateStaff;
