import {
  SIGNUP,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  SIGNIN,
  SIGNIN_SUCCESS,
  AUTHENTICATED,
  SIGNOUT,
  LOADING,
  SIGNIN_FAIL,
} from "../constants/Auth";

export const signUp = (data) => {
  return {
    type: SIGNUP,
    payload: data,
  };
};

export const signUpSuccess = () => {
  return {
    type: SIGNUP_SUCCESS,
  };
};

export const signUpFail = () => {
  return {
    type: SIGNUP_FAIL,
  };
};

export const signIn = (data) => {
  return {
    type: SIGNIN,
    payload: data,
  };
};

export const signInSuccess = (profile, token) => {
  return {
    type: SIGNIN_SUCCESS,
    profile,
    token,
  };
};

export const signInFail = () => {
  return {
    type: SIGNIN_FAIL,
  };
};

export const authenticated = (profile, token) => {
  return {
    type: AUTHENTICATED,
    profile,
    token,
  };
};

export const signOut = () => {
  return {
    type: SIGNOUT,
  };
};

export const setLoading = (loading) => {
  return {
    type: LOADING,
    loading,
  };
};
