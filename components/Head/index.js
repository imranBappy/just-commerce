import Head from "next/head";
import { useRouter } from "next/router";
import { memo } from "react";
import { useSelector } from "react-redux";

const HeadData = ({ title, seo, url }) => {
  const router = useRouter();
  const settings = useSelector((state) => state.settings);
  const siteName = settings.settingsData.name;
  const titleData = `${
    title
      ? title + " | "
      : settings.settingsData.title
      ? settings.settingsData.title + " | "
      : ""
  } ${siteName}`;
  const seoData = seo || settings.settingsData.seo;
  const seoTitle = seoData.title;
  const seoDescription = seoData.description;
  const seoKeyword = seoData.keyword;
  const seoImageUrl =
    seoData.image && seoData.image[0] ? seoData.image[0].url : "";
  const pageUrl = url
    ? `${process.env.NEXT_PUBLIC_URL}/${url}`
    : process.env.NEXT_PUBLIC_URL;

  return (
    <Head>
      <title>{titleData}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta
        name="google-site-verification"
        content={settings.settingsData.script.googleSiteVerificationId}
      />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeyword} />
      <meta name="url" content={pageUrl} />
      <meta itemProp="name" content={seoTitle} />
      <meta itemProp="description" content={seoDescription} />
      <meta itemProp="image" content={seoImageUrl} />
      <meta name="twitter:card" content="product" />
      <meta name="twitter:site" content="@publisher_handle" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:creator" content="@author_handle" />
      <meta name="twitter:image" content={seoImageUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={seoImageUrl} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:site_name" content={siteName} />
      <meta
        property="fb:app_id"
        content={settings.settingsData.script.facebookAppId}
      />
      {settings.settingsData.favicon[0] && (
        <link rel="shortcut icon" href={settings.settingsData.favicon[0].url} />
      )}
    </Head>
  );
};

export default memo(HeadData);
