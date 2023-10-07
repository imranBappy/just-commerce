import {
  Check2Circle,
  PencilSquare,
  SlashCircle,
  Trash,
} from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import ImageLoader from "~/components/Image";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData, updateData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const CategoryTable = () => {
  const url = `/api/admin/brand`;
  const { data, error, mutate } = useSWR(url, fetchData);

  const [brandList, setBrandList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("");
  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.brand) {
      setBrandList(data.brand);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "brand"));
  }, [session]);

  const openModal = (id) => {
    setSelectedBrand(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteProduct = async () => {
    setIsOpen(false);
    await deleteData(`/api/admin/brand?id=${selectedBrand}`)
      .then((data) =>
        data.success
          ? (toast.success("Category Deleted Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const changeTopBrand = async (id) => {
    await updateData("/api/admin/brand", { id })
      .then((data) =>
        data.success
          ? toast.success("Brand Updated Successfully")
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
  const filteredItems = brandList.filter(
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
      name: t("Id"),
      selector: (row) => row.brandId,
    },
    {
      name: t("name"),
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: t("image"),
      selector: (row) => (
        <ImageLoader
          src={row.image[0]?.url}
          alt={row.name}
          width={50}
          height={50}
        />
      ),
    },
    {
      name: t("Top Brand"),
      selector: (row) =>
        permissions.edit ? (
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={() => changeTopBrand(row._id)}
              defaultChecked={row.topBrand}
            />
          </div>
        ) : row.topBrand ? (
          <Check2Circle width={20} height={20} />
        ) : (
          <SlashCircle width={20} height={20} />
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
            <Link href={`/dashboard/brand/${row._id}`}>
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
          <Trash width={80} height={80} />
          <p>Are you sure, you want to delete?</p>
          <div>
            <button
              className={classes.danger_button}
              onClick={() => deleteProduct()}
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

CategoryTable.requireAuthAdmin = true;
CategoryTable.dashboard = true;

export default CategoryTable;
