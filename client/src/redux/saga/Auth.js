import { all, takeEvery, put, fork, call } from "redux-saga/effects";
import {
  SIGNUP,
  SIGNIN,
  SIGNOUT,
  AUTH_DATA,
  AUTH_TOKEN,
} from "../constants/Auth";
import {
  signInFail,
  signInSuccess,
  signUpFail,
  signUpSuccess,
} from "../actions/Auth";
import { call as axios, login, register } from "../axios";
import { error, success } from "components/shared-components/Toast/Toast";

export function* signUp() {
  yield takeEvery(SIGNUP, function* ({ payload }) {
    try {
      const r = yield axios(register(payload));
      success("Create Account Successful");
      yield put(signUpSuccess());
    } catch (err) {
      yield put(signUpFail());
      yield error(err);
    }
  });
}

export function* signIn() {
  yield takeEvery(SIGNIN, function* ({ payload }) {
    try {
      const r = yield axios(login(payload));
      localStorage.setItem(AUTH_DATA, JSON.stringify({ ...r.data }));
      localStorage.setItem(AUTH_TOKEN, r.token);
      success("Login Successful");
      yield put(signInSuccess(r.profile, r.token));
    } catch (err) {
      yield put(signInFail());
      yield error(err);
    }
  });
}

export function* signOut() {
  yield takeEvery(SIGNOUT, function* () {
    localStorage.removeItem(AUTH_DATA);
    localStorage.removeItem(AUTH_TOKEN);
    success("Logout Successfully");
    // yield put(action.signOut());
  });
}

export default function* rootSaga() {
  yield all([fork(signIn), fork(signOut), fork(signUp)]);
}
