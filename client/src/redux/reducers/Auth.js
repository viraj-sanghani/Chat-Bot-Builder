import {
  SIGNUP,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  AUTHENTICATED,
  SIGNOUT,
  LOADING,
} from "../constants/Auth";

const initState = {
  loading: false,
  profile: "",
  token: "",
  redirect: "",
};

const auth = (state = initState, action) => {
  switch (action.type) {
    case SIGNUP:
      return {
        ...state,
        loading: true,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        loading: false,
        redirect: "./",
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        loading: false,
      };
    case SIGNIN:
      return {
        ...state,
        loading: true,
      };
    case SIGNIN_SUCCESS:
      return {
        ...state,
        loading: false,
        profile: action.profile,
        token: action.token,
      };
    case SIGNIN_FAIL:
      return {
        ...state,
        loading: false,
      };

    case AUTHENTICATED:
      return {
        ...state,
        profile: action.profile,
        token: action.token,
      };

    case SIGNOUT: {
      return {
        ...state,
        profile: null,
        token: null,
      };
    }
    case LOADING: {
      return {
        ...state,
        loading: action.loading,
      };
    }
    default:
      return state;
  }
};

export default auth;
