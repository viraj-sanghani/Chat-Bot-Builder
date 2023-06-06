export const validate = (mes, type) => {
  let error;
  if (type == "name" && !isMesValid.name(mes)) {
    error =
      "Oops, it doesn't look like a valid name. Please try one more time.";
  } else if (type == "email" && !isMesValid.email(mes)) {
    error =
      "Oops, it doesn't look like a valid email. Please try one more time.";
  } else if (type == "mobile" && !isMesValid.mobile(mes)) {
    error =
      "Oops, it doesn't look like a valid mobile number. Please try one more time.";
  } else if (type == "number" && !isMesValid.number(mes)) {
    error = "Please enter valid number";
  } else if (type == "date" && !isMesValid.date(mes)) {
    error = "Please enter valid date";
  } else if (type == "time" && !isMesValid.time(mes)) {
    error = "Please enter valid time";
  }
  return error || false;
};

const isMesValid = {
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
