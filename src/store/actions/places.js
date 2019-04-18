import { SET_PLACES, DELETE_PLACE, PLACE_ADDED, START_ADD_PLACE} from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index'

export const startAddPlace = () => {
  return {
    type: START_ADD_PLACE
  };
}

export const addPlace = (placeName, location, image) => {
    return dispatch => {
      let authToken;
      dispatch(authGetToken())
      .then(token => {
        authToken = token;
        dispatch(uiStartLoading());
        return fetch("https://us-central1-rn-course-237221.cloudfunctions.net/storeImage", {
            method: "POST",
            body: JSON.stringify({
              image: image.base64
            }),
            headers: {
              "authorization": "Bearer " + token
            }
        })
      })
      .catch(err => {
        console.log(err);
        alert("No valid token found!");
        dispatch(uiStopLoading());
      })
      .then(res => res.json())
      .then(parsedRes => {
        const placeData = {
          name : placeName,
          location: location,
          image: parsedRes.imageUrl,
          imagePath: parsedRes.imagePath
        }
        return fetch("https://rn-course-237221.firebaseio.com/places.json?auth="+authToken, {
          method: "POST",
          body: JSON.stringify(placeData)
        });
      })
      .then(res => res.json())
      .then(parsedRes => {
        console.log(parsedRes);
        dispatch(placeAdded());
        dispatch(uiStopLoading());
      })
      .catch(err => {
        console.log(err);
        alert("Something went wrong, please try again!")
        dispatch(uiStopLoading());
      });
    };
};

export const placeAdded = () => {
  return {
    type: PLACE_ADDED
  };
}

export const deletePlace = key => {
    return dispatch => {
      dispatch(authGetToken())
      .then(token => {
        dispatch({type: DELETE_PLACE, placeKey: key});
        return fetch("https://rn-course-237221.firebaseio.com/places/"+key+".json?auth="+token, {method: "DELETE"});
      })
      .catch(() => alert("No valid token found!"))
      .then(res => res.json())
      .then(parsedRes => {
        console.log("Done!");
      })
      .catch(err => {
        alert("Oh snap, something went wrong.")
      });
    };
};

export const getPlaces = () => {
  return dispatch => {
    dispatch(authGetToken())
    .then(token => {
      return fetch("https://rn-course-237221.firebaseio.com/places.json?auth="+token);
    })
    .catch(() => alert("No valid token found!"))
    .then(res => res.json())
    .then(resParsed => {
      const places = [];
      for (let key in resParsed) {
        places.push({
          ...resParsed[key],
          image: {
            uri: resParsed[key].image
          },
          key: key
        });
      }
      dispatch(setPlaces(places));
    })
    .catch(err => {
      alert("Oh snap, something went wrong.")
    });
  };
};

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places: places
  };
};