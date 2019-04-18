import React, { Component } from "react";
import { View, Button, StyleSheet, Text, Dimensions, Platform} from "react-native";
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

class PickLocation extends Component {
  
  componentWillMount() {
    this.reset();
  }

  reset = () => {
    this.setState({
      focusedLocation : {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0122,
        longitudeDelta: 
          Dimensions.get('window').width / Dimensions.get('window').height * 0.0122
      },
      locationChosen: false
    });
  }

  pickLocationHandler = event => {
    const coords = event.nativeEvent.coordinate;
    this.map.animateToRegion({
        ...this.state.focusedLocation,
        latitude: coords.latitude,
        longitude: coords.longitude
    }, 500)
    this.setState(previousState => {
      return {
        focusedLocation : {
          ...previousState.focusedLocation,
          latitude: coords.latitude,
          longitude: coords.longitude
        },
        locationChosen: true
      };
    });

    this.props.onLocationPicked({
      latitude: coords.latitude,
      longitude: coords.longitude
    })
  }

  getLocationHandler = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const coordsEvents = {
          nativeEvent : {
            coordinate : {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          }
        };
        this.pickLocationHandler(coordsEvents);
      }, err => {
        console.log(err);
        alert("Fetching the position failed, please pick one manually.")
      }
    );
  }

  render() {

    let marker = null;
    if (this.state.locationChosen) {
      marker = <MapView.Marker coordinate={this.state.focusedLocation} />
    }

    return (
      <View style={styles.container}>
        <MapView 
          ref={ref => this.map = ref} 
          onPress={this.pickLocationHandler} 
          initialRegion={this.state.focusedLocation}
          region={!this.state.locationChosen ? this.state.focusedLocation : null}
          style={styles.map}>{marker}
        </MapView>
        <View style={styles.button}>
          <Button title="Locate Me" onPress={this.getLocationHandler} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center"
  },
  map: {
    width: "100%",
    height: 250
  },
  button: {
    margin: 8
  }
});

export default PickLocation;
