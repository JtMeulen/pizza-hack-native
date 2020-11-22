import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, Button, Text } from "react-native";
import { BASE_URL } from '../utils/constants';

interface Props {
  navigation: any
}

export class RecieptScreen extends Component<Props> {
	componentDidMount() {
		console.log('PROPS', this.props.navigation.state.params);
		const { sessionId, userId, orderId } = this.props.navigation.state.params;

		fetch(`${BASE_URL}order/${userId}/${orderId}`, {
			method: 'GET',
			headers: {
				'User-Token': sessionId
			}
		})
			.then(response => response.json())
			.then((data) => {
				console.log('Success: ', data)
			})
			.catch((e) => {
				console.log('Error: ', e)
			});
	}

	goBack = () => {
		const { sessionId, userId } = this.props.navigation.state.params;
		this.props.navigation.navigate('Menu', { userId, sessionId });
	}

	getDeliveryDate = () => {
		const { estimatedTime } = this.props.navigation.state.params;
		
		let date = new Date(); 
		date.setMinutes(date.getMinutes() + estimatedTime);
		return date;
	}

	render() {
		const { totalPrice, estimatedTime } = this.props.navigation.state.params;
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
