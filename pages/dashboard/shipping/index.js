import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "~/components/Table";
import classes from "~/components/tableFilter/table.module.css";
import PageLoader from "~/components/Ui/pageLoader";
import { cpf, deleteData, postData, updateData } from "~/lib/clientFunctions";


const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const ShippingCharges = () => {
  const [buttonState, setButtonState] = useState("");
  const [buttonState1, setButtonState1] = useState("");
  const [buttonState2, setButtonState2] = useState("");
  const [data, setData] = useState(null);
  const [shippingChargeList, setShippingChargeList] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (data && data.shippingCharge) {
      setShippingChargeList(data.shippingCharge.area);
    }
  }, [data]);

  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "shippingCharges"));
  }, [session]);

  const area = useRef();
  const areaCost = useRef();
  const areaForm = useRef();
  const internationalCost = useRef();
  const internationalShippingActive = useRef()
  const editAreaName = useRef();
  const editAreaCost = useRef();
  const updatedData = useRef();
  function updatePageData() {
    updatedData?.current?.update();
  }

  const openModal = (id, name, price, action) => {
    setSelectedItem({ id, name, price, action });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const addShippingArea = async (e) => {
    try {
      e.preventDefault();
      setButtonState("loading");
      const data = {
        areaName: area.current.value.trim(),
        // areaCost: areaCost.current.value,
      };
      const response = await postData(`/api/shipping?scope=area`, data);
      response.success
        ? (toast.success("Shipping charge added successfully"),
          areaForm.current.reset(),
          updatePageData())
        : toast.error("Something went wrong (500)");
      setButtonState("");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setButtonState("");
    }
  };

 

  const deleteShippingItem = async () => {
    try {
      const response = await deleteData(`/api/shipping`, {
        id: selectedItem.id,
      });
      response.success
        ? (toast.success("Shipping charge deleted successfully"),
          updatePageData())
        : toast.error("Something went wrong (500)");
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const editShippingItem = async (e) => {
    try {
      e.preventDefault();
      const data = {
        name: editAreaName?.current.value.trim(),
        price: editAreaCost?.current.value,
        id: selectedItem.id,
      };
      const response = await updateData(`/api/shipping`, data);
      response.success
        ? (toast.success("Shipping charge updated successfully"),
          updatePageData())
        : toast.error("Something went wrong (500)");
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  const columns = [
    {
      name: t("Area Name"),
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
    },
    // {
    //   name: t("Shipping Cost"),
    //   selector: (row) => row.price + currencySymbol,
    // },
    {
      name: t("actions"),
      selector: (row) => (
        <div>
          {permissions.delete && (
            <div
              className={classes.button}
              onClick={() => openModal(row._id, row.name, row.price, "delete")}
            >
              <Trash width={22} height={22} title="DELETE" />
            </div>
          )}
          {permissions.edit && (
            <div className={classes.button}>
              <PencilSquare
                width={22}
                height={22}
                title="EDIT"
                onClick={() => openModal(row._id, row.name, row.price, "edit")}
              />
            </div>
          )}
        </div>
      ),
    },
  ];
  const addInternationalCharge = async (e) => {
    try {
      e.preventDefault();
      setButtonState1("loading");
      const data = {
        amount: internationalCost.current.value,
      };
      const response = await postData(
        `/api/shipping?scope=international`,
        data,
      );
      response.success
        ? toast.success("International shipping charge added successfully")
        : toast.error("Something went wrong (500)");
      setButtonState1("");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setButtonState1("");
    }
  };
  const addInternationalPermission = async (e) => {
    try {
      e.preventDefault();
      setButtonState2("loading");
      const data = {
        permission: internationalShippingActive.current.value,
      };
      const response = await postData(
        `/api/shipping?scope=internationalShipping`,
        data,
      );
      response.success
        ? toast.success("International shipping Permission added successfully")
        : toast.error("Something went wrong (500)");
      setButtonState2("");
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      setButtonState2("");
    }
  };
  //test
 

  return (
    <PageLoader url={`/api/shipping`} setData={setData} ref={updateData}>
      {data && (
        <>
          {permissions.edit && (
            <>
              <div className="card mb-5 border-0 shadow">
                <div className="card-header bg-white py-3 fw-bold">
                  {t("Add New Shipping Area")}
                </div>
                <div className="card-body">
                  <form onSubmit={addShippingArea} ref={areaForm}>
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        required
                        placeholder={`${"Area Name"}*`}
                        ref={area}
                        className="form-control"
                      />
                      {/* <input
                        type="number"
                        min="0"
                       
                        placeholder={`${t("Charge For The Area")} (${currencySymbol})*`}
                        ref={areaCost}
                        className="form-control"
                      /> */}
                      <div className="input-group-append">
                        <LoadingButton
                          type="submit"
                          text={t("ADD")}
                          state={buttonState}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="card mb-5 border-0 shadow">
                <div className="card-header bg-white py-3 fw-bold">
                  {t("International Shipping Charge")}
                </div>
                <div className="card-body">
                  <form onSubmit={addInternationalCharge}>
                    <div className="input-group mb-3">
                      <input
                        type="number"
                        min="0"
                        required
                        placeholder={`${t("Charge Amount")} (${currencySymbol})*`}
                        ref={internationalCost}
                        defaultValue={
                          data.shippingCharge &&
                          data.shippingCharge.internationalCost
                        }
                        className="form-control"
                      />
                      <div className="input-group-append">
                        <LoadingButton
                          type="submit"
                          text={t("UPDATE")}
                          state={buttonState1}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* test  */}
              <div className="card mb-5 border-0 shadow">
                <div className="card-header bg-white py-3 fw-bold">
                  {t("International Shipping Charge")}
                </div>
                <div className="card-body">
                  <form onSubmit={addInternationalPermission}>
                    <div className="input-group mb-3">
                      
                      <select 
                        required
                        ref={internationalShippingActive}
                        defaultValue={

                          data.shippingCharge.internationalShippingActive
                        }
                        className="form-control"
                      >
                        <option value='YES'>YES</option>
                        <option value='NO'>NO</option>
                      </select>
                      <div className="input-group-append">
                        <LoadingButton
                          type="submit"
                          text={t("UPDATE")}
                          state={buttonState2}
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* test  */}
            </>
          )}
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              {t("Shipping Area")}
            </div>
            <div className="card-body">
              <div className={classes.container}>
                <Table
                  columns={columns}
                  data={shippingChargeList}
                  searchKey="name"
                  searchPlaceholder={t("name")}
                />
              </div>
            </div>
          </div>
          <GlobalModal
            isOpen={isOpen}
            handleCloseModal={closeModal}
            small={true}
          >
            {selectedItem.action === "delete" ? (
              <div className={classes.modal_icon}>
                <Trash width={90} height={90} />
                <p>Are you sure, you want to delete?</p>
                <div>
                  <button
                    className={classes.danger_button}
                    onClick={deleteShippingItem}
                  >
                    Delete
                  </button>
                  <button
                    className={classes.success_button}
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-5 pb-3">
                <form onSubmit={editShippingItem}>
                  <div className="mb-3">
                    <label htmlFor="inp-1" className="form-label">
                      {t("Area Name")}*
                    </label>
                    <input
                      type="text"
                      id="inp-1"
                      ref={editAreaName}
                      className="form-control"
                      defaultValue={selectedItem.name}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="inp-2" className="form-label">
                      {t("Area Charge")}*
                    </label>
                    <input
                      type="number"
                      id="inp-2"
                      ref={editAreaCost}
                      className="form-control"
                      defaultValue={selectedItem.price}
                      required
                    />
                  </div>
                  <div className="text-center">
                    <button type="submit" className={classes.success_button}>
                      {t("UPDATE")}
                    </button>
                    <button
                      type="button"
                      className={classes.danger_button}
                      onClick={() => closeModal()}
                    >
                      {t("Cancel")}
                    </button>
                  </div>
                </form>
              </div>
              
            )}
          </GlobalModal>
        </>
      )}
    </PageLoader>
  );
};

ShippingCharges.requireAuthAdmin = true;
ShippingCharges.dashboard = true;

export default ShippingCharges;
