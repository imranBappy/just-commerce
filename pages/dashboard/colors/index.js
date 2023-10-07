import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const Colors = () => {
  const url = `/api/colors`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [colorList, setColorList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.colors) {
      setColorList(data.colors);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "color"));
  }, [session]);

  const openModal = (id) => {
    setSelectedColor(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteColor = async () => {
    setIsOpen(false);
    await deleteData(`/api/colors?id=${selectedColor}`)
      .then((data) =>
        data.success
          ? (toast.success("Color Deleted Successfully"), mutate())
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
  const filteredItems = colorList.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
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
      name: t("name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("Value"),
      selector: (row) => row.value,
    },
    {
      name: t("color"),
      selector: (row) => (
        <div
          className={classes.color_viewer}
          style={{ backgroundColor: row.value }}
        />
      ),
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
            <Link href={`/dashboard/colors/${row._id}`}>
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
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
          <h4 className="text-center pt-3 pb-5">All Colors</h4>
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
          <GlobalModal
            isOpen={isOpen}
            handleCloseModal={closeModal}
            small={true}
          >
            <div className={classes.modal_icon}>
              <Trash width={100} height={100} />
              <p>Are you sure, you want to delete?</p>
              <div>
                <button
                  className={classes.danger_button}
                  onClick={() => deleteColor()}
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
        </div>
      )}
    </>
  );
};

Colors.requireAuthAdmin = true;
Colors.dashboard = true;

export default Colors;
