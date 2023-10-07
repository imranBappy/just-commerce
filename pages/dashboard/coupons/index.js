import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, dateFormat, deleteData, fetchData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const Coupons = () => {
  const url = `/api/coupons`;
  const { data, error, mutate } = useSWR(url, fetchData);

  const [couponList, setCouponList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.coupon) {
      setCouponList(data.coupon);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "coupon"));
  }, [session]);

  const openModal = (id) => {
    setSelectedCoupon(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const deleteCoupon = async () => {
    setIsOpen(false);
    await deleteData(`/api/coupons?id=${selectedCoupon}`)
      .then((data) =>
        data.success
          ? (toast.success("Coupon Deleted Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = couponList.filter(
    (item) =>
      item.code && item.code.toLowerCase().includes(filterText.toLowerCase())
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText, resetPaginationToggle]);

  const customStyles = {
    rows: {
      style: {
        minHeight: "92px",
        fontSize: "15px",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
      },
    },
  };

  const columns = [
    {
      name: t("Code"),
      selector: (row) => row.code,
      sortable: true,
    },
    {
      name: t("amount"),
      selector: (row) => `${row.amount}%`,
      sortable: true,
    },
    {
      name: t("Active"),
      selector: (row) => dateFormat(row.active),
    },
    {
      name: t("Expired"),
      selector: (row) => dateFormat(row.expired),
    },
    {
      name: t("action"),
      selector: (row) => (
        <div>
          {permissions.delete && (
            <div className={classes.button} onClick={() => openModal(row._id)}>
              <Trash width={22} height={22} title="DELETE" />
            </div>
          )}
          {permissions.edit && (
            <Link href={`/dashboard/coupons/${row._id}`}>
              <div className={classes.button}>
                <PencilSquare width={22} height={22} title="EDIT" />
              </div>
            </Link>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      {error ? (
        <h3 className="text-center text-danger">failed to load</h3>
      ) : !data ? (
        <Spinner />
      ) : (
        <div className={classes.container}>
          <DataTable
            columns={columns}
            data={filteredItems}
            pagination
            paginationResetDefaultPage={resetPaginationToggle}
            subHeader
            subHeaderComponent={subHeaderComponentMemo}
            persistTableHead
            customStyles={customStyles}
          />
        </div>
      )}
      <GlobalModal isOpen={isOpen} handleCloseModal={closeModal} small={true}>
        <div className={classes.modal_icon}>
          <Trash width={90} height={90} />
          <p className="mb-3">Are you sure, you want to delete?</p>
          <div>
            <button
              className={classes.danger_button}
              onClick={() => deleteCoupon()}
            >
              Delete
            </button>
            <button
              className={classes.success_button}
              onClick={() => closeModal()}
            >
              Cancel
            </button>
          </div>
        </div>
      </GlobalModal>
    </>
  );
};

Coupons.requireAuthAdmin = true;
Coupons.dashboard = true;

export default Coupons;
