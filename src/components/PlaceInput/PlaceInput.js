import React, { Component } from "react";
import DefaultInput from "../UI/DefaultInput/DefaultInput";

const placeInput = props => (
  <DefaultInput
    placeholder="Place Name"
    value={props.placeData.value}
    touched={props.placeData.touched}
    valid={props.placeData.valid}
    onChangeText={props.onChangePlaceName}
  />
);

export default placeInput;
