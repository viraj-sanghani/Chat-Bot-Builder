window.onload = function () {
  setTimeout(() => {
    const apiKey = document
      .querySelector("#quickConnect")
      .getAttribute("apiKey");

    const mainWrap = document.createElement("div");
    mainWrap.id = "chatbot";
    mainWrap.style.cssText =
      "border: 0px;background-color: transparent;pointer-events: none;z-index: 9999999999;position: fixed;bottom: 0;width: 110px;height: 110px;overflow: hidden;opacity: 1;max-width: 100%;max-height: 100%;ALIGN_TO: 0;";

    const iframe = document.createElement("iframe");
    iframe.src = "http://localhost:3000/bot/" + apiKey;
    iframe.frameborder = 0;
    iframe.style.cssText =
      "pointer-events: all;background: none;border: 0px;float: none;position: absolute;inset: 0px;width: 100%;height: 100%;overflow:hidden;margin: 0px;padding: 0px;min-height: 0px;";

    mainWrap.appendChild(iframe);
    document.querySelector("body").insertAdjacentElement("beforeend", mainWrap);

    window.addEventListener("message", function (event) {
      const data = event.data;
      if (data.flag === "changeOpen") {
        if (data.value == true) {
          mainWrap.style.width = "min(100% - 40px, 410px)";
          mainWrap.style.height = "min(100vh - 15%, 700px)";
        } else {
          mainWrap.style.width = "110px";
          mainWrap.style.height = "110px";
        }
      } else if (data.flag === "setData") {
        const values = data.items;
        values.map((ele) => localStorage.setItem(ele.key, ele.value));
      } else if (data.flag === "getData") {
        const d = {};
        data.keys.forEach((key) => {
          d[key] = localStorage.getItem(key);
        });
        iframe.contentWindow.postMessage({ flag: "returnData", items: d }, "*");
      }
    });
  }, 500);
};
