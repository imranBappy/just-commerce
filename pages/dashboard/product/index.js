import { PencilSquare, Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useSWR from "swr";
import ImageLoader from "~/components/Image";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, deleteData, fetchData } from "~/lib/clientFunctions";

const DataTable = dynamic(() => import("react-data-table-component"));
const FilterComponent = dynamic(() => import("~/components/tableFilter"));
const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const Spinner = dynamic(() => import("~/components/Ui/Spinner"));

const ProductList = () => {
  const url = `/api/product`;
  const { data, error, mutate } = useSWR(url, fetchData);
  const [productList, setProductList] = useState([]);

  // console.log('product', productList)

  // const showTest = <div>
  //   {
  //     productList[0]?.deliveryPrice.map(item => {
  //       console.log('item', item._id)
  //       return (
  //         <p key={item._id} style={{ color: 'red' }}>{item._id}</p>
  //       )
  //     })
  //   }
  // </div>
  useEffect(() => {
    if (data && data.product) {
      setProductList(data.product);
    }
  }, [data]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const { t } = useTranslation();

  const settings = useSelector((state) => state.settings);
  const currencySymbol = settings.settingsData.currency.symbol;

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  useEffect(() => {
    setPermissions(cpf(session, "product"));
  }, [session]);

  const openModal = (id) => {
    setSelectedProduct(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteProduct = async () => {
    setIsOpen(false);
    await deleteData(`/api/product/delete/${selectedProduct}`)
      .then((data) =>
        data.success
          ? (toast.success("Product Deleted Successfully"), mutate())
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
  const filteredItems = productList.filter(
    (item) =>
      item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
  );


  console.log('product', filteredItems)
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

  const columns = [
    {
      name: t("Product Id"),
      selector: (row) => row.productId,
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
          alt={data.name}
          width={80}
          height={80}
        />
      ),
    },
    {
      name: t("Product Type"),
      selector: (row) => row.type,
      sortable: true,
    },
    {
      name: t("price"),
      selector: (row) => currencySymbol + row.price,
      sortable: true,
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
            <Link href={`/dashboard/product/${row.slug}`}>
              <div className={classes.button}>
                <PencilSquare width={22} height={22} title="EDIT" />
              </div>
            </Link>
          )}
        </div>
      ),
    },
  ];

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

  return (
    <>
      {error ? (
        <div className="text-center text-danger">failed to load</div>
      ) : !data ? (
        <Spinner />
      ) : (
        <div>
              {/* {showTest} */}
          <h4 className="text-center pt-3 pb-5">Products</h4>
             
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
            <GlobalModal
              isOpen={isOpen}
              handleCloseModal={closeModal}
              small={true}
            >
              <div className={classes.modal_icon}>
                <Trash width={90} height={90} />
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
          </div>
        </div>
      )}
    </>
  );
};

ProductList.requireAuthAdmin = true;
ProductList.dashboard = true;

export default ProductList;
