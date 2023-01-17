const apiKey = document.querySelector("#quickConnect").getAttribute("apiKey");

const mainWrap = document.createElement("div");
mainWrap.style.cssText =
  "border: 0px;background-color: transparent;pointer-events: none;z-index: 9999999999;position: fixed;bottom: 0;width: min(100% - 40px, 410px);height: min(calc(100vh - 15%), 700px);overflow: hidden;opacity: 1;max-width: 100%;max-height: 100%;ALIGN_TO: 0;";

const iframe = document.createElement("iframe");
iframe.src = "http://localhost:5000/bot/static/html/bot.html";
iframe.frameborder = 0;
iframe.style.cssText =
  "pointer-events: all;background: none;border: 0px;float: none;position: absolute;inset: 0px;width: 100%;height: 100%;overflow:hidden;margin: 0px;padding: 0px;min-height: 0px;";
iframe.name = apiKey;

mainWrap.appendChild(iframe);
document.querySelector("body").insertAdjacentElement("beforeend", mainWrap);
