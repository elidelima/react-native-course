import React, { Component } from 'react';
import { View, Button, TextInput, StyleSheet } from 'react-native';

class PlaceInput extends Component {
    
    state = {
        placeName: '',
    }

    onChangePlaceNameHandler = (value) => {
        this.setState({ placeName: value })
    }
    
    placeSubmitHandler = () => {
        if (this.state.placeName === "") return;
        this.props.onPlaceAdded(this.state.placeName);
        this.setState(previousState => {
            return { placeName : ''};
        });
    }

    render() {
        return(
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.placeInput}
                    placeholder="An awesome place..."
                    value={this.state.placeName}
                    onChangeText={this.onChangePlaceNameHandler} />

                <Button
                    title="Add"
                    style={styles.placeButton} 
                    onPress={this.placeSubmitHandler}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    inputContainer: {
        // flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "85%"
    },
    placeInput: {
        width: "70%",
    },
    placeButton: {
        width: "30%",
    },
});

export default PlaceInput;