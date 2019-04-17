import { TRY_AUTH, AUTH_SET_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from "../../screens/MaintTabs/startMainTabs";

const API_KEY = "AIzaSyD2TAyHc4hLmxjobysYOVhAJIObM1Kx3_o";
const SIGNIN = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`
const SIGNUP = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading());
    let url = authMode === "login" ? SIGNIN : SIGNUP
    
    fetch(url,
      {
        method: "POST",
        body: JSON.stringify({
          email: authData.email,
          password: authData.password,
          returnSecureToken: true
        }),
        headers: {
          "Content-Type" : "application/json"
        }
      }
    )
    .then(res => res.json())
    .then(parsedRes => {
      dispatch(uiStopLoading());
      console.log(parsedRes);
      if (!parsedRes.idToken) {
        alert("Invalid Username/Password");
      } else {
        dispatch(authSetToken(parsedRes.idToken));
        startMainTabs();
      }
    })
    .catch(err => {
      console.log(err)
      alert("Something went wrong. Please try again.");
      dispatch(uiStopLoading());
    });
  };
}

export const authSetToken = (token) => {
  return {
    type : AUTH_SET_TOKEN,
    token: token
  }
}

export const authGetToken = () => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const token = getState().auth.token;
      if (!token) {
        reject();
      } else {
        resolve(token);
      }
    })
  }
}