import React, { Component } from "react";
import { View, Button, StyleSheet, Image } from "react-native";
import imagePlaceHolder from "../../assets/lisbon.jpg";
import ImagePicker from 'react-native-image-picker';

class PickImage extends Component {

  state = {
    pickedImage: null
  }

  reset = () => {
    this.setState({
      pickedImage : null
    })
  }

  pickImageHandler = () => {
    ImagePicker.showImagePicker(
      { 
        title: "Pick an Image",
        maxHeight: 500,
        maxWidth: 700
      }, 
      res => {
        if (res.didCancel) {
          console.log("User cancelled.");
        } else if (res.error) {
          console.log("Error.", res.error);
        } else {
          this.setState({
            pickedImage: { uri: res.uri},
          });
          this.props.onImagePicked({ 
            uri: res.uri,
            base64: res.data
          });
        }
      }
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.placeHolder}>
          <Image source={this.state.pickedImage} style={styles.previewImage} />
        </View>
        <View style={styles.button}>
          <Button title="Pick Image" onPress={this.pickImageHandler} />
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
  placeHolder: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eee",
    width: "80%",
    height: 150
  },
  button: {
    margin: 8
  },
  previewImage: {
    width: "100%",
    height: "100%"
  }
});

export default PickImage;
