import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, TouchableNativeFeedback, Platform} from "react-native";

const primaryButton = props => {
  const content = (
    <View style={[styles.primaryButton, { backgroundColor: props.color }]}>
      <Text>{props.children}</Text>
    </View>
  )

  if (Platform.OS === 'android') {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    );
  }
  return (<TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>);
}
  

const styles = StyleSheet.create({
  primaryButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "black"
  }
});

export default primaryButton;
