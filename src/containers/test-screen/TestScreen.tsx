import React, { Component } from "react";
import { View, StyleSheet, Text } from "react-native";

export class TestScreen extends Component {
	public render = () => {
		return (
			<View style={style.content}>
				<Text>I am a test screen</Text>
			</View>
		);
	};
}

const style = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
