const API_URL = "http://localhost:5000/";
const PATH = "http://127.0.0.1:5500/";
const DEFAULT_LOGO = API_URL + "/api/bot/icon/default.gif";
const DEFAULT_BTN_IMG = API_URL + "/api/bot/icon/default.gif";
const CLIENT_IMG = API_URL + "/api/bot/icon/customer.png";
const POWERED_BY_LOGO = API_URL + "/api/bot/icon/powerd_by.png";

window.onload = async () => {
  const apiKey = document.querySelector("#quickConnect").dataset["apiKey"];

  if (!apiKey) {
    return;
  }

  function callChatBotAPI(url, method, params = {}) {
    return new Promise(async (resolve, reject) => {
      let data = [];
      for (const p in params) {
        const encKey = encodeURIComponent(p);
        const encValue = encodeURIComponent(params[p]);
        data.push(encKey + "=" + encValue);
      }
      data = data.join("&");
      try {
        const options = {
          method: method,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        };
        if (method !== "GET") options.body = data;

        await fetch(url, options).then((response) => resolve(response.text()));
      } catch (err) {
        reject(err);
      }
    });
  }

  let response;

  try {
    response = await callChatBotAPI(
      `${API_URL}chat/questions/${apiKey}/${cId}`,
      "GET"
    );
  } catch (err) {
    console.log(err);
    return;
  }

  response = JSON.parse(response);
  if (!response.success) {
    console.error(response.message);
    return;
  }

  const resData = response.data;

  let list = response.data.list;

  if (resData.bg_color && resData.font_color) {
    const rootStyle = document.querySelector(":root");
    rootStyle.style.setProperty("--chat-bot-bg", resData.bg_color);
    rootStyle.style.setProperty("--chat-font-color", resData.font_color);
  }

  const popup = `<div class="chat-popup ${
    resData.show_right == 1 ? "align-right" : "align-left"
  } d-none">
    <div class="chat-header">
        <div class="img-wrap">
          <img src="${
            resData.company_logo
              ? resData.img_url + resData.company_logo
              : DEFAULT_LOGO
          }" alt="" >
        </div>
        <h3>${resData.topbar_name}</h3>
    </div>
    <div class="chat-container">
      
    </div>
    <div class="chat-footer">
        <input type="text" class="chat-text-box" id="messageChatInput" placeholder="Type your message here...">
        <button class="send-btn" id="send">
            <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
        </button>
    </div>
    <div class="pow-wrap"><a href="https://chatbot.vvelocity.com/" target="blank">Powerd By <img src="${POWERED_BY_LOGO}"></a></div>
  </div>`;

  const popup_btn = `<div class="chat-popup-btn-wrap d-none">
    <div class="chat-popup-btn">
      
          <img class="close-popup-icon" src="${
            resData.company_logo
              ? resData.img_url + resData.company_logo
              : DEFAULT_BTN_IMG
          }" alt="" >
     
      <div class="open-popup-icon d-none">
          <svg style="width:30px;height:30px" viewBox="0 0 24 24">
              <path fill="currentColor"
                  d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
          </svg>
      </div>
    </div>
    <div class="wel-mes-box">
      <div class="wel-mes-inner-box">
        ${resData.intro_text}
      </div>
    </div>
  </div>`;

  const links = `<link rel="stylesheet" href="${PATH}css/style.css">`;

  document
    .querySelector("body")
    .insertAdjacentHTML("beforeend", popup + popup_btn);
  document.querySelector("head").insertAdjacentHTML("beforeend", links);

  const mesInput = document.querySelector("#messageChatInput");
  const chatContainer = document.querySelector(".chat-container");

  mesInput.disabled = true;

  let counter = 0;
  const res_id = (Date.now() + Math.random()).toString().split(".").join("");

  const createChat = (mes, p = "r", effect = false, options = []) => {
    mesInput.disabled = true;

    let chatCon = document.createElement("div");
    let icon = document.createElement("div");
    let img = document.createElement("img");
    let chat = document.createElement("div");

    icon.className = "chat-icon";
    chat.className = "chat-mes bg";

    if (p == "l") {
      img.src = resData.agent_logo
        ? resData.img_url + resData.agent_logo
        : DEFAULT_LOGO;
      img.alt = "";
      chatCon.className = " chat-left";
    } else {
      img.src = CLIENT_IMG;
      img.alt = "";
      chatCon.className = " chat-right";
    }
    chat.innerHTML = '<div class="chat-bot-loading-text"></div>';
    let t = setTimeout(() => {
      if (options.length > 0) {
        chat.innerHTML = `${mes}`;

        const optionWrap = document.createElement("div");
        optionWrap.className = "option-wrap";
        optionWrap.innerHTML = options
          .map((option) => {
            return `<button class="option-btn" data-v="${option}">${option}</button>`;
          })
          .join("");

        optionWrap.addEventListener("click", handleBtnClick);

        function handleBtnClick(e) {
          if (e.target.className === "option-btn") {
            const mes = e.target.getAttribute("data-v");
            storeChat(mes)
              .then(() => {
                createChat(mes);
                counter++;
                if (counter < list.length) {
                  mesInput.disabled = false;
                  mesInput.focus();
                  if (list[counter].opt) {
                    createChat(list[counter].q, "l", true, list[counter].opt);
                  } else createChat(list[counter].q, "l", true);
                } else {
                  mesInput.remove();
                  document
                    .querySelector(".chat-footer")
                    .classList.add("d-none");
                  createChat(resData.thank_you_msg, "l", true);
                }
              })
              .catch(() => {});

            optionWrap.removeEventListener("click", handleBtnClick);
            optionWrap.remove();
          }
        }

        chat.appendChild(optionWrap);
      } else if (effect) {
        let count = 0;
        chat.innerHTML = mes[count];
        let timer = setInterval(() => {
          if (count < mes.length - 1) {
            count++;
            chat.innerHTML += mes[count];
          } else {
            clearInterval(timer);
            mesInput.disabled = false;
            mesInput.focus();
          }
        }, 100);
      } else {
        chat.innerHTML = mes;
      }
    }, 1000);

    icon.appendChild(img);
    chatCon.appendChild(icon);
    chatCon.appendChild(chat);
    chatContainer.appendChild(chatCon);
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 1000);
  };

  const initChat = () => {
    list[counter].opt
      ? createChat(list[counter].q, "l", false, list[counter].opt)
      : createChat(list[counter].q, "l", true);
    if (counter === list.length - 1) {
      document.querySelector(".chat-footer").classList.add("d-none");
    }
  };

  const storeChat = (mes) => {
    return new Promise(async (resolve, reject) => {
      if (!isMesValid(mes, list[counter]?.type)) {
        return reject();
      }

      let complete = false;

      if (counter === list.length - 1) {
        complete = true;
      }

      let res;

      try {
        res = await callChatBotAPI(`${API_URL}chat`, "POST", {
          apiKey,
          cId,
          q: list[counter].id,
          answer: mes,
          res_id,
          complete,
        });
      } catch (err) {
        console.log(err);
      }

      let data = JSON.parse(res);
      if (data.success) {
        resolve(complete);
      } else {
        reject();
        alert("Something went wrong");
      }
    });
  };

  document.querySelector("#send").addEventListener("click", () => {
    if (mesInput.value) {
      storeChat(mesInput.value)
        .then(() => {
          createChat(mesInput.value);
          counter++;
          if (counter < list.length) {
            if (list[counter].opt) {
              createChat(list[counter].q, "l", true, list[counter].opt);
            } else createChat(list[counter].q, "l", true);
          } else {
            mesInput.remove();
            document.querySelector(".chat-footer").classList.add("d-none");
            createChat(resData.thank_you_msg, "l", true);
          }
          mesInput.value = "";
          mesInput.focus();
        })
        .catch(() => {});
    } else mesInput.focus();
  });

  document
    .querySelector("#messageChatInput")
    .addEventListener("keypress", (e) => {
      e.key == "Enter" && document.querySelector("#send").click();
    });

  const isMesValid = (mes, type) => {
    let error;
    if (type == "name" && !validateName(mes)) {
      error = "Please enter valid name";
    } else if (type == "email" && !validateEmail(mes)) {
      error = "Please enter valid email";
    } else if (type == "mobile" && !validateMobile(mes)) {
      error = "Please enter valid mobile number";
    } else if (type == "number" && !validateNumber(mes)) {
      error = "Please enter valid number";
    }
    error && createChat(error, "l", true);
    return error ? false : true;
  };

  const validateName = (mes) => {
    let re = /^[a-zA-Z ]{2,30}$/;
    return re.test(String(mes));
  };

  const validateEmail = (mes) => {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(mes).toLowerCase());
  };

  const validateMobile = (mes) => {
    let re = /^[6-9]\d{9}$/;
    return re.test(String(mes));
  };

  const validateNumber = (mes) => {
    let re = /^[0-9]\d{0,}$/;
    return re.test(String(mes));
  };

  /****************************************************
   * Popup btn
   ****************************************************/

  let isOpen = false;
  document
    .querySelector(".chat-popup-btn")
    .addEventListener("click", async () => {
      chatPopup(!isOpen);
    });

  const chatPopup = (open = false) => {
    isOpen = open;
    const chatPopup = document.querySelector(".chat-popup");
    const chatPopupIcon = document.querySelector(".open-popup-icon");
    const closePopupIcon = document.querySelector(".close-popup-icon");

    if (open) {
      chatPopup.classList.remove("d-none");
      chatPopupIcon.classList.remove("d-none");
      closePopupIcon.classList.add("d-none");
      mesInput.focus();
    } else {
      localStorage.setItem("vvelocity-chat-bot-close", true);
      chatPopup.classList.add("d-none");
      chatPopupIcon.classList.add("d-none");
      closePopupIcon.classList.remove("d-none");
    }
  };

  setTimeout(() => {
    document.querySelector(".chat-popup-btn-wrap").classList.remove("d-none");
  }, 30);

  setTimeout(() => {
    let myDate = new Date();
    let hrs = myDate.getHours();
    let greet;

    if (hrs < 12) greet = "Welcome, Good Morning";
    else if (hrs >= 12 && hrs <= 17) greet = "Welcome, Good Afternoon";
    else if (hrs >= 17 && hrs <= 24) greet = "Welcome, Good Evening";

    createChat(greet, "l", true);
    setTimeout(() => {
      initChat();
    }, 4000);

    const pop_close = localStorage.getItem("vvelocity-chat-bot-close");
    !pop_close && chatPopup(true);
  }, 60);
};
