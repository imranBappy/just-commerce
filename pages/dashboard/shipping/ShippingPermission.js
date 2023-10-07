import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import Switch from 'react-switch';
import { toast } from 'react-toastify';
import { updateData } from '~/lib/clientFunctions';

function ShippingButton({ onChange }) {
  const [internationalShippingActive, setInternationalShippingActive] = useState(true);

  const { t } = useTranslation();

  // const _id = "6506f6cc2f4a707eaf65881b";

  // const addInternationalCharge = async () => {
  //   try {
  //     const updatedInternationalShippingActive = !internationalShippingActive; // Toggle the state when sending data
  //     const data = {
  //       internationalShippingActive: updatedInternationalShippingActive,
  //       _id: _id, // Keep _id as a string
  //     };
  //     const response = await updateData(
  //       `/api/shipping/shippingPermission`,
  //       data,
  //     );

  //     if (response.success) {
  //       // Update the state only after a successful API response
  //       setInternationalShippingActive(updatedInternationalShippingActive);
  //       toast.success("International shipping state updated successfully");
  //     } else {
  //       toast.error("Something went wrong (500)");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error(err.message);
  //   }
  // };

  

  return (
    <div className="card mb-5 border-0 shadow">
      <div className="card-header bg-white py-3 fw-bold d-flex justify-content-between">
        {t("International Shipping Active")}
        <div className="align-items-center d-flex justify-content-between">
          <label className="mr-2">{internationalShippingActive ? t("ON") : t("OFF")}</label>
          <Switch
            onChange={onChange}
            // checked={internationalShippingActive}
          />
        </div>
      </div>

      {/* <div>
        <input onChange={(e) => setTest(e.target.value)} />
        <button>submit</button>
      </div> */}
    </div>
  );
}

export default ShippingButton;
