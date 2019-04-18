import { AsyncStorage } from 'react-native';

import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from "../../screens/MaintTabs/startMainTabs";
import App from "../../../App";

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
        dispatch(authStoreToken(
          parsedRes.idToken, 
          parsedRes.expiresIn,
          parsedRes.refreshToken));
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

export const authSetToken = (token, expiryDate) => {
  return {
    type : AUTH_SET_TOKEN,
    token: token,
    expiryDate: expiryDate

  }
}

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem("rc:auth:token", token);
    AsyncStorage.setItem("rc:auth:expiryDate", expiryDate.toString());
    AsyncStorage.setItem("rc:auth:refreshToken", refreshToken);
  }
}

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      let token = getState().auth.token;
      let expiryDate = getState().auth.expiryDate;
      if (!token || new Date(expiryDate) <= new Date()) {
        AsyncStorage.getItem("rc:auth:token")
          .catch( err => reject())
          .then(tokenFromStorage => {
            if (!tokenFromStorage) {
              reject();
              return;
            }
            token = tokenFromStorage;
            return AsyncStorage.getItem("rc:auth:expiryDate");
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(token));
              resolve(token);
            } else {
              reject();
            }
          })
          .catch(err => reject());
      } else {
        resolve(token);
      }
    });
    return promise.catch(err => {
      return AsyncStorage.getItem("rc:auth:refreshToken")
        .then(refreshToken => {
          return fetch("https://securetoken.googleapis.com/v1/token?key="+API_KEY, {
            method: "POST",
            headers: { 
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "grant_type=refresh_token&refresh_token="+refreshToken
          })
        })
        .then(res => res.json())
        .then(parsedRes => {
          if(parsedRes.id_token) {
            console.log("refreshing token");
            dispatch(authStoreToken(parsedRes.id_token, parsedRes.expires_in, parsedRes.refresh_token));
            return parsedRes.id_token;
          } else {
            authClearStorage();
          }
        })
        .then(token => {
          if (token) {
            return token;
          } else {
            throw new Error();
          }
        });
    });
  }
}

export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(authGetToken())
    .then(token => {
      startMainTabs();
    })
    .catch(err => {console.log("Failed to fetch token!", err)})
  }
}

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem("rc:auth:token");
    AsyncStorage.removeItem("rc:auth:expiryDate");
    return AsyncStorage.removeItem("rc:auth:refreshToken");
  }
}

export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage())
      .then(() => {
        App();
      });
    dispatch(authRemoveToken());
  }
}

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  }
}