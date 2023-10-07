import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "~/components/Table";
import classes from "~/components/tableFilter/table.module.css";
import PageLoader from "~/components/Ui/pageLoader";
import { cpf, deleteData, postData } from "~/lib/clientFunctions";
import ShippingTable from "./ShippingTable";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const LoadingButton = dynamic(() => import("~/components/Ui/Button"));

const ShippingCharges = ({ handleShippingTableData }) => {
  const [buttonState, setButtonState] = useState("");
  const [buttonState1, setButtonState1] = useState("");
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
  const editAreaName = useRef();
  const editAreaCost = useRef();
  const updateData = useRef();
  function updatePageData() {
    updateData.current.update();
  }

  // const openModal = (id, name, price, action) => {
  //   setSelectedItem({ id, name, price, action });
  //   setIsOpen(true);
  // };
  // const closeModal = () => {
  //   setIsOpen(false);
  // };

  // const addShippingArea = async (e) => {
  //   try {
  //     e.preventDefault();
  //     setButtonState("loading");
  //     const data = {
  //       areaName: area.current.value.trim(),
  //       areaCost: areaCost.current.value,
  //     };
  //     const response = await postData(`/api/shipping?scope=area`, data);
  //     response.success
  //       ? (toast.success("Shipping charge added successfully"),
  //         areaForm.current.reset(),
  //         updatePageData())
  //       : toast.error("Something went wrong (500)");
  //     setButtonState("");
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err.message);
  //     setButtonState("");
  //   }
  // };

  // const addInternationalCharge = async (e) => {
  //   try {
  //     e.preventDefault();
  //     setButtonState1("loading");
  //     const data = {
  //       amount: internationalCost.current.value,
  //     };
  //     const response = await postData(
  //       `/api/shipping?scope=international`,
  //       data,
  //     );
  //     response.success
  //       ? toast.success("International shipping charge added successfully")
  //       : toast.error("Something went wrong (500)");
  //     setButtonState1("");
  //   } catch (err) {
  //     console.log(err);
  //     toast.error(err.message);
  //     setButtonState1("");
  //   }
  // };

 
  

  const columns = [
    {
      name: t("Area Name"),
      selector: (row) => row.name,
      sortable: true,
      grow: 1,
    },
    {
      name: t("Shipping Cost"),
      cell: (row) => (
        <input
          type="text"
          style={{padding:'10px 20px'}}
          // Add any input attributes or event handlers you need here
          value={row.shippingCost}
          onChange={(e) => handleInputChange(e, row)}
        />
      ),
    },
  ]

  return (
    <PageLoader url={`/api/shipping`} setData={setData} ref={updateData}>
      {data && (
        <>
         
          <div className="card mb-5 border-0 shadow">
            <div className="card-header bg-white py-3 fw-bold">
              {t("Shipping Area")}
            </div>
            <div className="card-body">
              <div className={classes.container}>
                <ShippingTable
                  columns={columns}
                  data={shippingChargeList}
                  searchKey="name"
                  searchPlaceholder={t("name")}
                  handleShippingTableData={handleShippingTableData}
                  
                />
              </div>
            </div>
          </div>
          
        </>
      )}
    </PageLoader>
  );
};

ShippingCharges.requireAuthAdmin = true;
ShippingCharges.dashboard = true;

export default ShippingCharges;
