import React, { Component } from "react";
import { View, StyleSheet, ImageBackground, Dimensions, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ActivityIndicator} from "react-native";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import MainText from "../../components/UI/MainText/MainText";
import ButtonPrimary from "../../components/UI/ButtonPrimary/ButtonPrimary";
import backgroundImage from "../../assets/night.jpg";
import validate from "../../utility/validation";
import { connect } from "react-redux";
import { tryAuth, authAutoSignIn } from "../../store/actions/index"

class AuthScreen extends Component {

  state = {
    viewMode: Dimensions.get('window').height > 500 ? "portrait" : "landscape",
    authMode: "login",
    controls: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched : false
      },
      password: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 6
        },
        touched : false
      },
      confirmPassword: {
        value: "",
        valid: false,
        validationRules: {
          equalTo: 'password'
        },
        touched : false
      }
    }
  }

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateStyles);
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateStyles);
  }

  componentDidMount() {
    this.props.onAuthAutoSignIn();
  }

  switchAuthModeHandler = () => {
    this.setState(previousState => {
      return {
        authMode: previousState.authMode === "login" ? "signup" : "login"
      };
    });
  }

  updateStyles = dims => {
    this.setState({
      viewMode : dims.window.height > 500 ? "portrait" : "landscape"
    });
  }

  authHandler = () => {
    const authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value
    };
    this.props.onTryAuth(authData, this.state.authMode);
  };

  updateInputState = (key, value) => {
    let connectedValue = {};
    if (this.state.controls[key].validationRules.equalTo) {
      const equalToControl = this.state.controls[key].validationRules.equalTo;
      const equalToValue = this.state.controls[equalToControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalToValue
      }
    }
    if (key === 'password') {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      }
    }

    this.setState((previousState) => {
      return {
        controls: {
          ...previousState.controls,
          confirmPassword: {
            ...previousState.controls.confirmPassword,
            valid:
              key === "password" 
                ? validate(
                  previousState.controls.confirmPassword.value, 
                  previousState.controls.confirmPassword.validationRules, 
                  connectedValue)
                : previousState.controls.confirmPassword.valid
          },
          [key] : {
            ...previousState.controls[key],
            value : value,
            valid : validate(value, previousState.controls[key].validationRules, connectedValue),
            touched: true
          },
        }
      }
    });
  }

  render() {
    let headintText = null;
    let confirmPasswordContent = null;
    let submitButton = (
      <ButtonPrimary color="#29aaf4" 
        disabled={!this.state.controls.email.valid 
          || !this.state.controls.password.valid 
          || (!this.state.controls.confirmPassword.valid && this.state.authMode === "signup")} 
        onPress={this.authHandler}
      >Sumbit</ButtonPrimary>)
    
    if (this.props.isLoading) {
      submitButton = (<ActivityIndicator />);
    }

    if (this.state.viewMode === "portrait") {
      headintText = (
        <MainText>
          <HeadingText>Please {this.state.authMode === "login" ? "Login" : "Sign up"}</HeadingText>
        </MainText>
      );
    }
    if (this.state.authMode === "signup") {
      confirmPasswordContent = (
        <View style={ this.state.viewMode === "portrait" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper }>
          <DefaultInput 
            placeholder="Confirm Password" 
            placeholderTextColor="#fff"
            value={this.state.controls.confirmPassword.value}
            onChangeText={(val) => {this.updateInputState('confirmPassword', val)}}
            valid={this.state.controls.confirmPassword.valid}
            touched={this.state.controls.confirmPassword.touched}
            secureTextEntry
          />
        </View>  
      );
    }

    return (
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          {headintText}

          <ButtonPrimary color="#29aaf4" onPress={this.switchAuthModeHandler}>
            Switch to {this.state.authMode === "login" ? "Sign Up" : "Login"}
          </ButtonPrimary>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inputContainer}>
              <DefaultInput
                placeholder="Your E-mail Address"
                placeholderTextColor="#fff"
                value={this.state.controls.email.value}
                onChangeText={(value) => {this.updateInputState('email', value)}}
                valid={this.state.controls.email.valid}
                touched={this.state.controls.email.touched}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              <View style={ this.state.viewMode === "portrait" || this.state.authMode === "login" ? styles.portraitPasswordContainer : styles.landscapePasswordContainer }>
                <View style={ this.state.viewMode === "portrait" || this.state.authMode === "login" ? styles.portraitPasswordWrapper : styles.landscapePasswordWrapper }>
                  <DefaultInput 
                    placeholder="Password" 
                    placeholderTextColor="#fff"
                    value={this.state.controls.password.value}
                    onChangeText={(val) => {this.updateInputState('password', val)}}
                    valid={this.state.controls.password.valid}
                    touched={this.state.controls.password.touched}
                    secureTextEntry
                  />
                </View>

                {confirmPasswordContent}
              </View>
            </View>
          </TouchableWithoutFeedback>
          {submitButton}
        </KeyboardAvoidingView>
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

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    onAuthAutoSignIn : () => dispatch(authAutoSignIn())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
