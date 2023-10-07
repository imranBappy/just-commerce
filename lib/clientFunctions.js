import axios from "axios";
import { toJpeg } from "html-to-image";
import { updateSettings } from "~/redux/settings.slice";

export const fetchData = (url) =>
  axios
    .get(url)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

export async function postData(url, data) {
  const response = await axios({
    method: "post",
    url,
    data,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

  return response;
}

export async function updateData(url, data) {
  const response = await axios({
    method: "put",
    url,
    data,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

  return response;
}

export async function deleteData(url, data) {
  const response = await axios({
    method: "delete",
    url,
    data,
  })
    .then((res) => res.data)
    .catch((error) => {
      console.log(error.message);
      const errData = { success: false, err: error.message };
      return errData;
    });

  return response;
}

export function decimalBalance(num) {
  return Math.round(num * 10) / 10;
}

export function getTotalPrice(cartData) {
  const price = cartData.items.reduce(
    (accumulator, item) => accumulator + item.qty * item.price,
    0
  );
  return Math.round(price * 10) / 10;
}

export function discountPrice(cartData) {
  const price = cartData.items.reduce(
    (accumulator, item) => accumulator + item.qty * item.price,
    0
  );
  const discountPrice =
    Math.round((price - (cartData.coupon.discount / 100) * price) * 10) / 10;
  return discountPrice;
}

export async function printDocument(reference, name) {
  const { jsPDF } = await import("jspdf");
  await toJpeg(reference, { quality: 1.0, pixelRatio: 1.8 })
    .then(function (dataUrl) {
      const pdf = new jsPDF("p", "pt", "a4", true);
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight, "FAST");
      pdf.save(`${name}.pdf`);
    })
    .catch((err) => {
      console.log(err);
    });
}

export function shimmer(w, h) {
  return `<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="0%" />
      <stop stop-color="#edeef1" offset="20%" />
      <stop stop-color="#f6f7f8" offset="40%" />
      <stop stop-color="#f6f7f8" offset="100%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.1s" repeatCount="indefinite"  />
</svg>`;
}

export function toBase64(str) {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
}

export function currencyConvert(payAmount, exchangeRate) {
  const amount = Number(payAmount);
  const exchange = Number(exchangeRate);
  let convertedAmount = 0;
  convertedAmount = amount * exchange;
  return Number(convertedAmount.toFixed(2));
}

export function setSettingsData(store, data) {
  const storeData = store.getState();
  const st = !storeData.settings.settingsData._id && data && data.settings;
  if (st) {
    store.dispatch(updateSettings(data.settings));
  }
}

export function appUrl(req) {
  let _a;
  let host =
    (((_a = req) === null || _a === void 0 ? void 0 : _a.headers)
      ? req.headers.host
      : window.location.host) || process.env.NEXT_PUBLIC_URL;
  let protocol =
    process.env.NEXT_PUBLIC_APP_SSL !== "yes" ? "http://" : "https://";
  if (typeof window !== "undefined") {
    protocol = window.location.protocol + "//";
  }
  return {
    protocol: protocol,
    host: host,
    origin: protocol + host,
  };
}

export function dateFormat(d) {
  return new Date(d).toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function filterPermission(session, menu) {
  const _menu = [];
  for (const i of menu) {
    if (i.target === "yes") {
      _menu.push(i);
    } else if (i.target !== "no") {
      const p = session.user.s.permissions.find((x) => x.name === i.target);
      if (p.edit) {
        _menu.push(i);
      } else if (p.view && !p.edit) {
        i.subMenu = i.subMenu.filter((x) => !x.create);
        _menu.push(i);
      }
    }
  }
  return _menu;
}

//Component Permission Filter
export function cpf(session, target) {
  const _default = { view: false, edit: false, delete: false };
  if (session && session.user.s.status) {
    const permissions = session.user.s.permissions.find(
      (x) => x.name === target
    );
    return permissions || _default;
  } else if (session && session.user.a) {
    return { view: true, edit: true, delete: true };
  } else {
    return _default;
  }
}

export function compareData(_data, key) {
  let dataTarget = "";
  let sortType = "ace";
  switch (key) {
    case "da":
      dataTarget = "date";
      sortType = "asc";
      break;

    case "db":
      dataTarget = "date";
      sortType = "desc";
      break;

    case "pa":
      dataTarget = "price";
      sortType = "asc";
      break;

    case "pb":
      dataTarget = "price";
      sortType = "desc";
      break;

    case "na":
      dataTarget = "name";
      sortType = "asc";
      break;

    case "nb":
      dataTarget = "name";
      sortType = "desc";
      break;

    default:
      dataTarget = "";
      sortType = "asc";
      break;
  }
  if (dataTarget.length > 0) {
    function _compareItem(x, y) {
      const a =
        dataTarget === "date"
          ? new Date(x[dataTarget]).getTime()
          : x[dataTarget];
      const b =
        dataTarget === "date"
          ? new Date(y[dataTarget]).getTime()
          : y[dataTarget];
      if (a < b) {
        return sortType === "asc" ? -1 : 1;
      }
      if (a > b) {
        return sortType === "asc" ? 1 : -1;
      }
      return 0;
    }

    return _data.sort(_compareItem);
  }
}

export function stockInfo(product) {
  if (product.type === "simple") {
    return product.quantity === -1 || product.quantity > 0 ? true : false;
  }
  const qty = product.variants.reduce((a, b) => {
    let x = a && a == "-1" ? 100000 : a > -1 ? a : 0;
    let y = b.qty && b.qty == "-1" ? 100000 : b.qty > -1 ? b.qty : 0;
    return +x + +y;
  }, 0);
  return qty > 0 ? true : false;
}

export function hexToRgb(hex) {
  // Expand shorthand hex form to full form
  const shorthandReg = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandReg, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "#ffffff";
}

export function formField(target) {
  const fields = {};
  for (const x in target) {
    if (Object.hasOwnProperty.call(target, x)) {
      const el = target[x];
      if (el.type !== "file" && el.name.length > 0) {
        fields[el.name] = el.value.trim();
      }
    }
  }
  return fields;
}
