import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';


const listItem = (props) => (
    <TouchableOpacity onPress={props.onItemPressed}>
        <View style={styles.listItem}>
            <Image resizeMode="cover" source={props.placeImage} style={styles.placeImage}></Image>
            <Text>{props.placeName}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        padding: 10,
        marginTop: 2,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
    },
    placeImage: {
        marginRight: 8,
        height: 30,
        width: 30,
    }
});

export default listItem;