import React from "react";
import { StyleSheet, View } from "react-native";
import { Color } from "./Colors";

const HorizontalLine = ({lineStyle}) =>{
    return(  <View style={[styles.horizontalLine,lineStyle]}></View>)
}

const styles = StyleSheet.create({
    horizontalLine: {
        borderWidth: 0.5,
        borderColor: Color('ratingStar'),
        opacity: 0.5
    },

})
 export default  HorizontalLine;