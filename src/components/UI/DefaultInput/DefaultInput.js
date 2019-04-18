import React from "react";
import { TextInput, StyleSheet } from "react-native";

const defaultInput = props => (
  <TextInput
    underlineColorAndroid="transparent"
    {...props}
    style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]}
  />
);

const styles = StyleSheet.create({
  input: {
    color: "#a1a1a1",
    width: "100%",
    minWidth: "45%",
    borderWidth: 1,
    borderColor: "#eee",
    padding: 5,
    marginTop: 8,
    marginBottom: 8,
    borderRadius: 3
  },
  invalid: {
    backgroundColor: '#f9c0c0',
    borderColor: "red"
  }
});
export default defaultInput;
