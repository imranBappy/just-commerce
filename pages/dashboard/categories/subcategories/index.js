import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import FileUpload from "~/components/FileUpload/fileUpload";
import ImageLoader from "~/components/Image";

import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData, updateData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const SubcategoryTable = (props) => {
  const url = `/api/categories`;
  const { data, error, mutate } = useSWR(url, fetchData);

  console.log('data', data)
  const [categoryImage, updateCategoryImage] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState({});
  const inputValue = useRef(null);

  const { t } = useTranslation();
  useEffect(() => {
    if (data && data.category) {
      const subList = [];
      data.category.map((category) =>
        category.subCategories.map((sub) => {
          sub.catId = category._id;
          sub.cat = category.name;
          subList.push(sub);
        })
      );
      setSubcategoryList(subList);
    }
  }, [data]);

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "category"));
  }, [session]);

  const openModal = (id, slug, name,  action) => {
    setSelectedSub({ id, slug, name,  action });
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteProduct = async () => {
    setIsOpen(false);
    await deleteData(
      `/api/categories/subcategories?id=${selectedSub.id}&slug=${selectedSub.slug}`
    )
      .then((data) =>
        data.success
          ? (toast.success("Subcategory Deleted Successfully"), mutate())
          : toast.error("Something Went Wrong")
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };

  const updateProduct = async () => {
    if (!categoryImage[0]?.url) {
      toast.error("Please Select image")
    }
    try {
      const bodyData = JSON.stringify({
        id: selectedSub.id,
        name: selectedSub.name,
        slug: selectedSub.slug,
        update: inputValue.current.value,
        subImage: categoryImage[0]?.url
      });
      const data = new FormData();
      data.append("data", bodyData);

      // console.log('bodyData', data)
      



      const response = await updateData("/api/categories/subcategories", data);
      response.success
        ? (toast.success("Subcategory Updated Successfully"), mutate())
        : toast.error("Something Went Wrong");
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };

  const [filterText, setFilterText] = React.useState("");
  const [resetPaginationToggle, setResetPaginationToggle] =
    React.useState(false);
  const filteredItems = subcategoryList.filter(
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
      name: t("slug"),
      selector: (row) => row.slug,
      sortable: true,
    },
    {
      name: t("image"),
      selector: (row) => (
        <ImageLoader
          src={row.subImage}
          alt='the'
          width={80}
          height={80}
        />
        // <Image  src={row.subImage} alt="the" width={80} height={80}/>
      ),
    },
    {
      name: t("Parent Category"),
      selector: (row) => row.cat,
      sortable: true,
    },
    {
      name: t("action"),
      selector: (row) => (
        <div>
          {permissions.delete && (
            <div
              className={classes.button}
              onClick={() => openModal(row.catId, row.slug, row.name, "delete")}
            >
              <Trash width={22} height={22} title="DELETE" />
            </div>
          )}
          {permissions.edit && (
            <div
              className={classes.button}
              onClick={() => openModal(row.catId, row.slug, row.name, "edit")}
            >
              <PencilSquare width={22} height={22} title="EDIT" />
            </div>
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
        {selectedSub.action === "delete" ? (
          <div className={classes.modal_icon}>
            <Trash width={70} height={70} />
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
        ) : (
          <div className="p-4">
            <div className="mb-5">
              <label htmlFor="inp-1" className="form-label">
                Subcategory Name*
              </label>
              <input
                type="text"
                id="inp-1"
                ref={inputValue}
                className="form-control"
                defaultValue={selectedSub.name}
                required
              />
            </div>
            <div className="mb-4 pt-2">
              <FileUpload
                accept=".jpg,.png,.jpeg"
                label={`${t("Upload your sub category icon here")}*`}
                maxFileSizeInBytes={2000000}
                updateFilesCb={updateCategoryImage}
                  preSelectedFiles={categoryImage[0]?.url}
                  
              />
             
            </div>
            <div className="text-center">
              <button
                className={classes.danger_button}
                onClick={() => updateProduct()}
              >
                Update
              </button>
              <button
                className={classes.success_button}
                onClick={() => closeModal()}
              >
                Cancel
              </button>
            </div>
          </div>
         
        )}
      </GlobalModal>
    </>
  );
};

SubcategoryTable.requireAuthAdmin = true;
SubcategoryTable.dashboard = true;

export default SubcategoryTable;
