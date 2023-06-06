const API_URL = "http://localhost:5000/";
const PATH = "http://127.0.0.1:5500/";
const DEFAULT_LOGO = API_URL + "bot/static/icon/default.gif";
const DEFAULT_BTN_IMG = API_URL + "bot/static/icon/default.gif";
let AGENT_IMG = API_URL + "bot/static/avatar/default-male.png";
const CUSTOMER_IMG = API_URL + "bot/static/avatar/customer.png";
const SEND_AUDIO = new Audio(API_URL + "bot/static/audio/send-message.mp3");
const RECEIVE_AUDIO = new Audio(
  API_URL + "bot/static/audio/receive-message.mp3"
);

window.onload = async () => {
  const apiKey = window.name;
  let userId, botId, agentId, roomId, clientApi;
  let isInit = false;
  let isLiveChat = false;
  let infoForm = false;
  let mainMenuStack = [];
  let prevMenuStack = [];

  if (!apiKey) {
    return;
  }

  function apiFun() {
    return {
      get: (url) =>
        new Promise(async (resolve, reject) => {
          try {
            const { data } = await axios.get(url);
            data.success ? resolve(data.data) : reject(data.message);
          } catch (err) {
            reject(err);
          }
        }),
    };
  }
  const api = apiFun();
  let botDetails;

  try {
    const r = await api.get(`${API_URL}bot/info/${apiKey}`);
    botDetails = r.bot;
    clientApi = r.apiKey;
  } catch (err) {
    console.log(err);
    return;
  }

  botId = botDetails.botId;
  infoForm = botDetails?.infoForm;
  const menu = {};
  let crtId = 0;
  for (let i = 0; i < botDetails.menu.length; i++)
    if (botDetails.menu[i] !== undefined)
      menu[botDetails.menu[i].id] = botDetails.menu[i];

  if (
    localStorage.getItem("userId") &&
    localStorage.getItem("apiKey") == apiKey &&
    localStorage.getItem("botId") == botId
  ) {
    userId = parseInt(localStorage.getItem("userId"));
  } else {
    userId = parseInt(
      (Date.now() + Math.random()).toString().split(".").join("")
    );
    localStorage.setItem("userId", userId);
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("botId", botId);
  }

  if (botDetails.background) {
    const rootStyle = document.querySelector(":root");
    rootStyle.style.setProperty("--chat-bot-bg", botDetails.background);
    rootStyle.style.setProperty("--chat-font-color", "#FFF");
  }

  const botHtml = `<div class="chat-popup ${
    botDetails.align == "Right" ? "align-right" : "align-left"
  } d-none hide-item">
                <div class="chat-header">
                  <div class="img-wrap">
                    <img src="${API_URL}bot/static/icon/${
    botDetails.icon
  }" alt="" />
                  </div>
                  <h2>${
                    botDetails.botName
                  } <br/><span class="agent-name"></span></h2>
                  <div class="bot-sound-btn">
                    <svg id="mute-btn" class="d-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    <svg id="unmute-btn" class="d-none" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6"/></svg>
                  </div>
                  <div class="bot-close-btn">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </div>
                </div>

                <div class="chat-intro-sec  ${!infoForm && "d-none"}">
                  <div class="intro-header">
                    <div class="itr-hdr-logo">
                      <img
                        src="${API_URL}bot/static/icon/${botDetails.icon}"
                        alt=""
                      />
                    </div>
                    <p class="itr-txt">
                      Please fill out the form below to start chatting.
                    </p>
                  </div>
                  <div class="intro-form">
                    <input type="text" name="" id="custName" placeholder="Name" />
                    <span id="custNameErr"></span>
                    <input type="text" name="" id="custEmail" placeholder="Email Id" />
                    <span id="custEmailErr"></span>
                    <input type="text" name="" id="custMobile" placeholder="Mobile No" />
                    <span id="custMobileErr"></span>
                    <button id="startChat">
                      <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M2,21L23,12L2,3V10L17,12L2,14V21Z"
                        />
                      </svg>
                      <p>Start Chat</p>
                    </button>
                  </div>
                </div>

                <div class="chat-container ${infoForm && "d-none"}">
                  
                </div>
                <div class="chat-footer ${infoForm && "d-none"}">
                  <input
                    type="text"
                    class="chat-text-box"
                    id="messageChatInput"
                    placeholder="Type your message here"
                    autocomplete="off"
                  />
                  <input type="text" id="datePicker" autocomplete="off" />
                  <button class="send-btn" id="send">
                    <svg style="width: 24px; height: 24px" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                    </svg>
                  </button>
                  <div class="ui-timepicker-container d-none">
                    <div>
                      <ul class="ui-timepicker-viewport">
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">7:00 AM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">8:00 AM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">9:00 AM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">10:00 AM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">11:00 AM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">12:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">1:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">2:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">3:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">4:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">5:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">6:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">7:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">8:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">9:00 PM</a>
                        </li>
                        <li class="ui-menu-item">
                          <a class="ui-corner-all">10:00 PM</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="pow-wrap">
                  Powerd by
                  <a href="http://localhost:3000" target="blank">QuickConnect</a>
                </div>
              </div>
              <div class="chat-popup-btn-wrap">
                <div class="chat-popup-btn">
                  <img class="close-popup-icon" src="${API_URL}bot/static/icon/${
    botDetails.icon
  }" alt="" />
                </div>
              </div>`;

  document.querySelector("body").insertAdjacentHTML("beforeend", botHtml);

  const introSec = document.querySelector(".chat-intro-sec");
  const chatContainer = document.querySelector(".chat-container");
  const chatFooter = document.querySelector(".chat-footer");
  const mesInput = document.querySelector("#messageChatInput");
  const datePicker = document.querySelector("#datePicker");
  const timePicker = document.querySelector(".ui-timepicker-container");
  const custName = document.querySelector("#custName");
  const custEmail = document.querySelector("#custEmail");
  const custMobile = document.querySelector("#custMobile");
  const custNameErr = document.querySelector("#custNameErr");
  const custEmailErr = document.querySelector("#custEmailErr");
  const custMobileErr = document.querySelector("#custMobileErr");
  const startChat = document.querySelector("#startChat");
  const sendBtn = document.querySelector("#send");
  const muteBtn = document.querySelector("#mute-btn");
  const unmuteBtn = document.querySelector("#unmute-btn");
  const agentName = document.querySelector(".agent-name");
  let isMute = localStorage.getItem("isMute") === "true";

  isMute
    ? unmuteBtn.classList.remove("d-none")
    : muteBtn.classList.remove("d-none");
  mesInput.disabled = true;

  $(datePicker).datepicker({
    dateFormat: "yy-mm-dd",
  });

  const createChat = (mes, p = "r", effect = false, options = []) => {
    let chatCon = document.createElement("div");
    let icon = document.createElement("div");
    let img = document.createElement("img");
    let chat = document.createElement("div");

    icon.className = "chat-icon";
    chat.className = "chat-mes";

    if (p == "l") {
      img.src = AGENT_IMG;
      img.alt = "";
      chatCon.className = "chat-left";
    } else {
      img.src = CUSTOMER_IMG;
      img.alt = "";
      chatCon.className = "chat-right";
    }

    chat.innerHTML = '<div class="chat-bot-loading-text"></div>';

    let t = setTimeout(() => {
      chat.classList = "chat-mes bg";
      if (options.length > 0) {
        chat.innerHTML = `${mes}`;

        const optionWrap = document.createElement("div");
        optionWrap.className = "option-wrap";
        optionWrap.innerHTML = options
          .map((option) => {
            return `<button class="option-btn" data-v="${option?.val}" data-n="${option?.next}">${option?.val}</button>`;
          })
          .join("");

        optionWrap.addEventListener("click", handleBtnClick);

        function handleBtnClick(e) {
          if (e.target.className === "option-btn") {
            let mes = e.target.getAttribute("data-v");
            let nxt = e.target.getAttribute("data-n");

            sendMes(mes, true);
            createChat(mes);
            optionWrap.removeEventListener("click", handleBtnClick);
            optionWrap.remove();
            setTimeout(() => {
              if (isLiveChat && mes === "Yes") {
                initLiveChat(botDetails.botName);
                return;
              } else if (nxt === "mainMenu") {
                nxt = mainMenuStack.pop();
                next(nxt?.id);
              } else if (nxt === "prevMenu") {
                nxt = prevMenuStack.pop();
                next(nxt?.id);
              } else next(nxt);
            }, 2000);
          }
        }

        chatCon.appendChild(optionWrap);
      } else if (effect) {
        let count = 0;
        chat.innerHTML = mes[count];
        let timer = setInterval(() => {
          if (count < mes.length - 1) {
            count++;
            chat.innerHTML += mes[count];
          } else {
            clearInterval(timer);
            mesInput.focus();
            if (p == "l" && menu[crtId]?.wait) {
              mesInput.disabled = false;
              mesInput.focus();
            } else {
              mesInput.disabled = true;
            }
          }
        }, 100);
      } else {
        chat.innerHTML = isURL(mes)
          ? `<a href="${mes}" target="_blank">${mes}</a>`
          : mes;
        if (p == "l" && menu[crtId]?.wait) {
          mesInput.disabled = false;
          mesInput.focus();
        } else {
          mesInput.disabled = !isLiveChat || !agentId ? true : false;
        }
      }
    }, 100);
    setTimeout(() => {
      if (!effect && !isMute) {
        p === "r" ? SEND_AUDIO.play() : RECEIVE_AUDIO.play();
      }
    }, 500);

    icon.appendChild(img);
    chatCon.appendChild(icon);
    chatCon.appendChild(chat);
    chatContainer.appendChild(chatCon);
    setTimeout(() => {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 100);
  };

  const initChat = () => {
    initSocket();
    const keys = Object.keys(menu);
    if (keys.length > 0)
      // for (const [key] of keys) {
      for (const key of keys) {
        if (menu[key]?.start) {
          next(key);
          break;
        }
      }
    else next("");
  };

  const next = (id) => {
    if (id) {
      crtId = id;
      if (menu[crtId]?.mainMenu) {
        mainMenuStack.push(menu[crtId]);
      }
      if (menu[crtId]?.prevMenu) {
        prevMenuStack.push(menu[crtId]);
      }
      if (menu[crtId]?.liveChat) {
        isLiveChat = true;
      } else {
        isLiveChat = false;
      }
      sendMes(menu[crtId]?.mes, false);
      createChat(menu[crtId]?.mes, "l", false, menu[crtId]?.opt || []);
      setTimeout(() => {
        !menu[crtId]?.wait && next(menu[crtId]?.next);
      }, 1500);
    }
  };

  const handleSendBtn = () => {
    if (mesInput.value) {
      if (!isLiveChat) {
        if (
          menu[crtId]?.valid &&
          !isMesValid(mesInput.value, menu[crtId].valid)
        ) {
          return;
        }
        sendMes(mesInput.value, true);
        createChat(mesInput.value);
        setTimeout(() => {
          next(menu[crtId]?.next);
        }, 150);
      } else {
        sendMes(mesInput.value, true);
        createChat(mesInput.value);
      }
      mesInput.value = "";
    } else mesInput.focus();
  };

  startChat.addEventListener("click", () => {
    if (!validate.name(custName.value)) {
      custName.focus();
      custNameErr.innerHTML = "Please Enter Valid Name";
      return;
    } else custNameErr.innerHTML = "";
    if (!validate.email(custEmail.value)) {
      custEmail.focus();
      custEmailErr.innerHTML = "Please Enter Valid Email Id";
      return;
    } else custEmailErr.innerHTML = "";
    if (!validate.mobile(custMobile.value)) {
      custMobile.focus();
      custMobileErr.innerHTML = "Please Enter Valid Mobile No";
      return;
    } else custMobileErr.innerHTML = "";
    chatContainer.classList.remove("d-none");
    chatFooter.classList.remove("d-none");
    introSec.classList.add("d-none");
    initChat();
  });

  sendBtn.addEventListener("click", () => {
    handleSendBtn();
  });

  mesInput.addEventListener("keypress", (e) => {
    e.key == "Enter" && handleSendBtn();
  });

  mesInput.addEventListener("focus", (e) => {
    setTimeout(() => {
      if (menu[crtId]?.valid === "date") {
        datePicker.focus();
      } else if (menu[crtId]?.valid === "time") {
        timePicker.classList.remove("d-none");
      }
    }, 200);
  });

  $(document).on("change", "#datePicker", function () {
    mesInput.value = this.value;
  });

  $(document).on("click", ".ui-menu-item a", function () {
    $(".ui-menu-item a").removeClass("ui-state-active");
    this.classList.add("ui-state-active");
    mesInput.value = this.innerHTML;
    timePicker.classList.add("d-none");
  });

  muteBtn.addEventListener("click", () => {
    muteBtn.classList.add("d-none");
    unmuteBtn.classList.remove("d-none");
    localStorage.setItem("isMute", true);
    isMute = true;
  });
  unmuteBtn.addEventListener("click", () => {
    muteBtn.classList.remove("d-none");
    unmuteBtn.classList.add("d-none");
    localStorage.setItem("isMute", false);
    isMute = false;
  });

  function isURL(str) {
    let pattern = new RegExp(
      "^(https?:\\/\\/)|(http?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(str);
  }

  const isMesValid = (mes, type) => {
    let error;
    if (type == "name" && !validate.name(mes)) {
      error =
        "Oops, it doesn't look like a valid name. Please try one more time.";
    } else if (type == "email" && !validate.email(mes)) {
      error =
        "Oops, it doesn't look like a valid email. Please try one more time.";
    } else if (type == "mobile" && !validate.mobile(mes)) {
      error =
        "Oops, it doesn't look like a valid mobile number. Please try one more time.";
    } else if (type == "number" && !validate.number(mes)) {
      error = "Please enter valid number";
    } else if (type == "date" && !validate.date(mes)) {
      error = "Please enter valid date";
    } else if (type == "time" && !validate.time(mes)) {
      error = "Please enter valid time";
    }
    error && createChat(error, "l");
    return error ? false : true;
  };

  const validate = {
    name: (mes) => {
      let re = /^[a-zA-Z]{2,30}$/;
      return re.test(String(mes));
    },
    email: (mes) => {
      let re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(mes).toLowerCase());
    },
    mobile: (mes) => {
      let re = /^[6-9]\d{9}$/;
      return re.test(String(mes));
    },
    number: (mes) => {
      let re = /^[0-9]\d{0,}$/;
      return re.test(String(mes));
    },
    date: (mes) => {
      let re = /^[0-9]\d{3}-[0-9]\d{1}-[0-9]\d{1}$/;
      return re.test(String(mes));
    },
    time: (mes) => {
      let re = /^[0-9]\d{1}:[0-9]\d{1}\spm|am|PM|AM$/;
      return re.test(String(mes));
    },
  };

  /****************************************************
   * Socket
   ****************************************************/

  let socket;

  const initSocket = () => {
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      socket.emit("join", {
        botId,
        userId,
        name: custName?.value,
        email: custEmail?.value,
        mobile: custMobile?.value,
        isAgent: false,
      });
    });

    socket.on("receiveMes", function (data) {
      data?.sender !== socket.id && createChat(data?.mes, "l");
    });

    socket.on("agentAllocated", function (data) {
      roomId = data?.roomId;
      agentId = data?.agentId;
      agentName.innerHTML = data?.fullName;
      data?.picture &&
        (AGENT_IMG = API_URL + "api/agent/picture/50/" + data?.picture);
      createChat(data?.fullName + " is connected", "l");
    });

    socket.on("sendMessage", function (data) {
      /* createChat(data.mes);
      setTimeout(() => {
        next(menu[crtId]?.next);
      }, 1500); */
    });
  };

  function sendMes(mes, fromUser) {
    !isLiveChat
      ? socket.emit("newChat", {
          botId,
          userId,
          mes,
          fromUser,
        })
      : socket.emit("liveChat", {
          apiKey: clientApi,
          botId,
          userId,
          agentId,
          roomId,
          mes,
          fromUser,
        });
  }

  function initLiveChat(botName) {
    socket.emit("initLiveChat", {
      apiKey: clientApi,
      botId,
      botName,
      userId,
    });
  }

  /****************************************************
   * Popup btn
   ****************************************************/

  document
    .querySelector(".chat-popup-btn")
    .addEventListener("click", async () => {
      chatPopup(true);
    });
  document
    .querySelector(".bot-close-btn")
    .addEventListener("click", async () => {
      chatPopup(false);
    });

  const bot = document.querySelector(".chat-popup");
  const openBtn = document.querySelector(".chat-popup-btn-wrap");

  const chatPopup = (open = false) => {
    localStorage.setItem("isOpen", open);
    if (open) {
      openBtn.classList.add("hide-item");
      bot.classList.remove("d-none");

      setTimeout(() => {
        bot.classList.remove("hide-item");
      }, 100);

      setTimeout(() => {
        openBtn.classList.add("d-none");
        mesInput.focus();

        if (!isInit && !infoForm) {
          isInit = true;
          initChat();
        }
      }, 1000);
    } else {
      openBtn.classList.remove("d-none");
      bot.classList.add("hide-item");

      setTimeout(() => {
        openBtn.classList.remove("hide-item");
      }, 100);

      setTimeout(() => {
        bot.classList.add("d-none");
      }, 1000);
    }
  };

  setTimeout(() => {
    openBtn.classList.remove("d-none");
  }, 30);

  setTimeout(() => {
    const o = localStorage.getItem("isOpen") === "true";
    o && chatPopup(true);
  }, 60);
};
