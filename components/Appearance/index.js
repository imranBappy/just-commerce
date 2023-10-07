import { useSelector } from "react-redux";
import { hexToRgb } from "~/lib/clientFunctions";

export default function Appearance(params) {
  const { settingsData: d } = useSelector((state) => state.settings);

  return (
    <style global jsx>
      {`
        :root {
          --primary: ${d.color.primary || "#ffc107"};
          --primary_contrast: ${d.color.primary_contrast || "#ffffff"};
          --primary_light: ${d.color.primary_hover || "#ffd763"};
          --primary_light_contrast: ${d.color.primary_hover_contrast || "#000000"};
          --secondary: ${d.color.secondary || "#EF4A23"};
          --secondary_contrast: ${d.color.secondary_contrast || "#ffffff"};
          --blue_white: #f9fbfd;
          --primary_opacity: ${hexToRgb(d.color.primary || "#ffd763")};
          --black: #393939;
          --deep_black: #000000;
          --light_black: #848484;
          --grey: ${d.color.body_gray || "#d9e0e5"};
          --grey_contrast: ${d.color.body_gray_contrast || "#000000"};
          --light_gray: #fafafa;
          --deep_gray: #dbdbdb;
          --white: #ffffff;
          --danger: #cf4436;
          --success: #198754;
          --success_hover: #157347;
          --border_color: #dfdfdf;
        }
      `}
    </style>
  );
}
