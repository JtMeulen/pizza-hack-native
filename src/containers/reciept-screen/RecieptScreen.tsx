import React, { Component } from "react";
import { View, StyleSheet, Button, Text } from "react-native";

interface Props {
  navigation: any
}

export class RecieptScreen extends Component<Props> {
	goBack = () => {
		const { sessionId, userId } = this.props.navigation.state.params;
		this.props.navigation.navigate('Menu', { userId, sessionId });
	}

	getDeliveryDate = () => {
		const { estimatedTime } = this.props.navigation.state.params;
		const date = new Date(); 

		return date.setMinutes(date.getMinutes() + estimatedTime);;
	}

	render() {
		const { totalPrice, estimatedTime, toppings } = this.props.navigation.state.params;
		console.log('toppins', toppings);
		return (
			<View style={style.content}>
				<Text>{`Price ontime delivery: €${(totalPrice * 1.1).toFixed(2)}`}</Text>
				<Text>{`Price late delivery: €${(totalPrice / 2).toFixed(2)}`}</Text>
				<Text>{`Estimated delivery in: ${estimatedTime.toFixed(2)} minutes`}</Text>
				<Button title="Go Back" onPress={this.goBack}/>
			</View>
		);
	};
}

const style = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});
