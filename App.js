import { Navigation } from "react-native-navigation";
import { Provider } from "react-redux";

import AuthScreen from "./src/screens/Auth/Auth";
import SharePlaceScreen from "./src/screens/SharePlace/SharePlace";
import FindPlaceScreen from "./src/screens/FindPlace/FindPlace";
import PlaceDetailScreen from "./src/screens/PlaceDetail/PlaceDetail";
import SideDrawer from "./src/screens/SideDrawer/SideDrawer";
import configureStore from "./src/store/configureStore";

const store = configureStore();

// Register Screens
Navigation.registerComponent(
  "awesome-places.AuthScreen",
  () => AuthScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.SharePlaceScreen",
  () => SharePlaceScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.FindPlaceScreen",
  () => FindPlaceScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.PlaceDetailScreen",
  () => PlaceDetailScreen,
  store,
  Provider
);
Navigation.registerComponent(
  "awesome-places.SideDrawer",
  () => SideDrawer
)

// Start a App
Navigation.startSingleScreenApp({
  screen: {
    screen: "awesome-places.AuthScreen",
    title: "Login"
  }
});



//OLD STUFF
// import React, { Component } from "react";
// import { StyleSheet, View } from "react-native";
// import { connect } from "react-redux";

// import PlaceInput from "./src/components/PlaceInput/PlaceInput";
// import PlaceList from "./src/components/PlaceList/PlaceList";
// import PlaceDetail from "./src/components/PlaceDetail/PlaceDetail";
// import {
//   addPlace,
//   deletePlace,
//   selectPlace,
//   unselectPlace
// } from "./src/store/actions/index";

// class App extends Component {

//   onPlaceAdded = (placeName) => {
//     this.props.onAddPlace(placeName);
//   }

//   onItemSelected = (key) => {
//     this.props.onSelectPlace(key);
//   }

//   onPlaceDeleted = () => {
//     this.props.onDeletePlace();
//   }

//   onModalClose = () => {
//     this.props.onUnselectPlace();
//   }

//   render() {
    
//     return (
//       <View style={styles.container}>
        
//         <PlaceDetail 
//           selectedPlace={this.props.selectedPlace}
//           onModalClose={this.onModalClose} 
//           onPlaceDeleted={this.onPlaceDeleted}/>

//         <PlaceInput onPlaceAdded={this.onPlaceAdded} />

//         <PlaceList places={this.props.places} onItemSelected={this.onItemSelected}/>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 40,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   }
// });

// const mapStateToProps = state => {
//   return {
//     places: state.places.places,
//     selectedPlace: state.places.selectedPlace
//   }
// }

// const mapDispatchToProps = dispatch => {
//   return {
//     onAddPlace: name => dispatch(addPlace(name)),
//     onDeletePlace: () => dispatch(deletePlace()),
//     onSelectPlace: key => dispatch(selectPlace(key)),
//     onUnselectPlace: () => dispatch(unselectPlace())
//   };
// }

// export default connect(mapStateToProps, mapDispatchToProps)(App);