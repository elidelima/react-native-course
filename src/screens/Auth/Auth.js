import React, { Component } from "react";
import { View, Button, StyleSheet, ImageBackground, Dimensions } from "react-native";
import startMainTabs from "../MaintTabs/startMainTabs";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import MainText from "../../components/UI/MainText/MainText";
import ButtonPrimary from "../../components/UI/ButtonPrimary/ButtonPrimary";
import backgroundImage from "../../assets/night.jpg";

class AuthScreen extends Component {

  state = {
    viewMode : Dimensions.get('window').height > 500 ? "portrait" : "landscape"
  }

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateStyles)
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateStyles);
  }

  updateStyles = dims => {
    this.setState({
      viewMode : dims.window.height > 500 ? "portrait" : "landscape"
    });
  }

  loginHandler = () => {
    startMainTabs();
  };

  render() {
    let headintText = null;

    if (Dimensions.get('window').height > 500) {
      headintText = (
        <MainText>
          <HeadingText>Please Sign In</HeadingText>
        </MainText>
      );
    }

    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <View style={styles.container}>
          {headintText}
          <ButtonPrimary color="#29aaf4">Switch to Login</ButtonPrimary>
          <View style={styles.inputContainer}>
            <DefaultInput
              placeholder="Your E-mail Address"
              placeholderTextColor="#fff"
            />
            <View style={ this.state.viewMode === "portrait" ? styles.portraitPasswordContainer : styles.landscapePasswordContainer }>
              <View style={ this.state.viewMode === "portrait" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper }>
                <DefaultInput placeholder="Password" placeholderTextColor="#fff" />
              </View>

              <View style={ this.state.viewMode === "portrait" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper }>
                <DefaultInput placeholder="Confirm Password" placeholderTextColor="#fff" />
              </View>  
            </View>
          </View>
          <ButtonPrimary color="#29aaf4" onPress={this.loginHandler}>
            Sumbit
          </ButtonPrimary>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  backgroundImage: {
    width: "100%",
    flex: 1
  },
  inputContainer: {
    width: "80%"
  },
  landscapePasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  portraitPasswordContainer: {
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  landscapePasswordWrapper: {
    width: "45%"
  },
  portraitPasswordWrapper: {
    width: "100%"
  }
});

export default AuthScreen;
