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
		this.props.navigation.goBack();
	}

	render() {

		return (
			<View style={style.content}>
				{/* {loading && <ActivityIndicator />} */}
				
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
