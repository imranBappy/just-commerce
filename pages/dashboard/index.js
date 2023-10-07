import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageLoader from "~/components/Ui/pageLoader";
import classes from "~/styles/dashboard.module.css";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Dashboard = () => {
  const [data, setData] = useState({});
  const { t } = useTranslation();
  let ORData = [];

  if (data && data.success) {
    const month = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    month.map((mn) => {
      const bb = data.order.find((x) => x._id.month === mn);
      if (bb) {
        ORData.push(bb.results);
      } else {
        ORData.push(0);
      }
    });
  }

  const chData = {
    series: [{ name: "Order", data: ORData }],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      yaxis: {
        labels: {
          formatter: function (value) {
            return Math.round(value);
          },
        },
      },
    },
  };

  return (
    <PageLoader url={`/api/dashboard`} setData={setData} ref={null}>
      <div>
        <div className={classes.card_container}>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalOrder}</div>
                <div className={classes.label}>{t("Total Order")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalUser}</div>
                <div className={classes.label}>{t("Total Customer")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalCategory}</div>
                <div className={classes.label}>{t("Total Category")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalColor}</div>
                <div className={classes.label}>{t("Total Color")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalAttribute}</div>
                <div className={classes.label}>{t("Total Attribute")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
          <div className={classes.card}>
            <div className={classes.circle}>
              <div className={classes.circle_inner}>
                <div className={classes.val}>{data.totalCoupon}</div>
                <div className={classes.label}>{t("Total Coupon")}</div>
                <div className={classes.color}></div>
              </div>
            </div>
          </div>
        </div>
        <div className="card mb-5 border-0 shadow">
          <div className="card-header bg-white py-3 fw-bold">
            {t("Order summary of the year")} {new Date().getFullYear()}
          </div>
          <div className="card-body">
            <Chart
              options={chData.options}
              series={chData.series}
              type="bar"
              width={"100%"}
              height={320}
            />
          </div>
        </div>
      </div>
    </PageLoader>
  );
};

Dashboard.requireAuthAdmin = true;
Dashboard.dashboard = true;

export default Dashboard;
