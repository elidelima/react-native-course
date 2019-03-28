/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Button, Platform, StyleSheet, TextInput, Text, View } from 'react-native';
import PlaceInput from './src/components/PlaceInput/PlaceInput';
import PlaceList from './src/components/PlaceList/PlaceList';
// import placeImage from './src/assets/lisbon.jpg'
import PlaceDetail from './src/components/PlaceDetail/PlaceDetail';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  state = {
    places: [],
    selectedPlace: null
  }

  onPlaceAdded = (placeName) => {
    this.setState(previousState => {
      return { 
        places: previousState.places.concat(
          { key: Math.random(), 
            name: placeName,
            image: {
              "uri" : "data:image/jpeg;base64,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"
            }
          })
      };
    });
  }

  onItemSelected = (key) => {
    this.setState(previousState => {
      return {
        selectedPlace: previousState.places.find(place => {
          return place.key === key;
        })
      };
    });
    
  }

  onPlaceDeleted = () => {
    this.setState(previousState => {
      return {
        places: previousState.places.filter(place => {
          return previousState.selectedPlace.key !== place.key;
        }),
        selectedPlace: null
      }
    })
  }

  onModalClose = () => {
    this.setState(previousState => {
      return { 
        selectedPlace : null
      };
    });
  }

  render() {
    
    return (
      <View style={styles.container}>
        
        <PlaceDetail 
          selectedPlace={this.state.selectedPlace}
          onModalClose={this.onModalClose} 
          onPlaceDeleted={this.onPlaceDeleted}/>

        <PlaceInput onPlaceAdded={this.onPlaceAdded} />

        <PlaceList places={this.state.places} onItemSelected={this.onItemSelected}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
