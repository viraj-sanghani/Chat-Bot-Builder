import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const options = {
  position: "top-center",
  autoClose: 3000,
  closeOnClick: false,
};

export function success(mes) {
  toast(mes, {
    type: "success",
    ...options,
  });
}

export function error(mes) {
  toast(mes, {
    type: "error",
    ...options,
  });
}

export function warning(mes) {
  toast(mes, {
    type: "warning",
    ...options,
  });
}
