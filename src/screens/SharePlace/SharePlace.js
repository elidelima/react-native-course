import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import validate from "../../utility/validation"

import PlaceInput from "../../components/PlaceInput/PlaceInput";
import PickImage from "../../components/PickImage/PickImage";
import PickLocation from "../../components/PickLocation/PickLocation";

import MainText from "../../components/UI/MainText/MainText";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import { addPlace } from "../../store/actions/index";

class SharePlaceScreen extends Component {

  static navigatorStyle = {
    navBarButtonColor: "orange"
  }

  state = {
    controls : {
      placeName: {
        value : "",
        valid : false,
        touched : false,
        validationRules : {
          notEmpty : true
        }
      },
      location: {
        value: null,
        valid: false
      },
      image: {
        value: null,
        valid: false
      }
    }
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "NavBarButtonPress") {
      if (event.id === "sideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }
    }
  };

  placeNameChangeHandler = val => {
    this.setState(previousState => {
      return {
        controls: {
          ...previousState.controls,
          placeName : {
            ...previousState.controls.placeName,
            value: val,
            valid : validate(val, previousState.controls.placeName.validationRules),
            touched : true
          }
        }
      }
    });
  };

  placeAddedHandler = () => {
    const placeName = this.state.controls.placeName.value;
    if (placeName.trim() !== "" && this.state.controls.location.value && this.state.controls.image.value) {
      this.props.onAddPlace(placeName, this.state.controls.location.value, this.state.controls.image.value);
    }
  };

  locationPickedHandler = location => {
    this.setState(previousState => {
      return {
        controls: {
          ...previousState.controls,
          location : {
            value: location,
            valid: true
          }
        }
      };
    });
  }

  imagePickedHandler = image => {
    console.log(image);
    this.setState(previousState => {
      return {
        controls: {
          ...previousState.controls,
          image : {
            value: image,
            valid: true
          }
        }
      };
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <MainText>
            <HeadingText>Share a Place with us!</HeadingText>
          </MainText>
          <PickImage onImagePicked={this.imagePickedHandler}/>
          <PickLocation onLocationPicked={this.locationPickedHandler}/>
          <PlaceInput
            placeData={this.state.controls.placeName}
            onChangePlaceName={this.placeNameChangeHandler}
          />
          <View style={styles.button}>
            <Button 
              title="Share" 
              onPress={this.placeAddedHandler} 
              disabled={!this.state.controls.placeName.valid 
              || !this.state.controls.location.valid
              || !this.state.controls.image.valid}/>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: (placeName, location, image) => dispatch(addPlace(placeName, location, image))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(SharePlaceScreen);
