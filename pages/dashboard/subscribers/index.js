import { Trash } from "@styled-icons/bootstrap";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Table from "~/components/Table";
import classes from "~/components/tableFilter/table.module.css";
import { cpf, dateFormat, deleteData } from "~/lib/clientFunctions";

const GlobalModal = dynamic(() => import("~/components/Ui/Modal/modal"));
const PageLoader = dynamic(() => import("~/components/Ui/pageLoader"));

const SubscriberList = () => {
  const [data, setData] = useState({ subscribers: { subscribers: [] } });
  const updateData = useRef();
  function updatePageData() {
    updateData.current.update();
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState("");

  const { session } = useSelector((state) => state.localSession);
  const [permissions, setPermissions] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    setPermissions(cpf(session, "subscriber"));
  }, [session]);

  const openModal = (id) => {
    setSelectedSubscriber(id);
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  const deleteSubscriber = async () => {
    setIsOpen(false);
    await deleteData(`/api/subscribers?id=${selectedSubscriber}`)
      .then((data) =>
        data.success
          ? (toast.success("Subscriber Deleted Successfully"), updatePageData())
          : toast.error("Something Went Wrong"),
      )
      .catch((err) => {
        console.log(err);
        toast.error("Something Went Wrong");
      });
  };
  const columns = [
    {
      name: t("email"),
      selector: (row) => row.email,
    },
    {
      name: t("Subscription Date"),
      selector: (row) => dateFormat(row.date),
      sortable: true,
    },
    {
      name: t("action"),
      selector: (row) =>
        permissions.delete && (
          <div className={classes.button} onClick={() => openModal(row._id)}>
            <Trash width={22} height={22} title="DELETE" />
          </div>
        ),
    },
  ];

  return (
    <PageLoader url={`/api/subscribers`} setData={setData} ref={updateData}>
      <div>
        <h4 className="text-center pt-3 pb-5">{t("Subscribers")}</h4>
        <div className={classes.container}>
          <Table
            data={data.subscribers.subscribers || []}
            columns={columns}
            searchKey="email"
            searchPlaceholder={t("email")}
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
                  onClick={() => deleteSubscriber()}
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
    </PageLoader>
  );
};

SubscriberList.requireAuthAdmin = true;
SubscriberList.dashboard = true;

export default SubscriberList;
