import Script from "next/script";

function FacebookChat(pageId) {
  return (
    <>
      <div id="fb-root"></div>
      <Script
        id="fb-custom-chat"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `window.fbAsyncInit = function () {
        FB.init({
          xfbml: true,
          version: 'v13.0'
        });
      };

      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));`,
        }}
      />

      <div
        className="fb-customerchat"
        attribution="setup_tool"
        page_id={pageId.pageId}
      ></div>
    </>
  );
}

export default FacebookChat;
