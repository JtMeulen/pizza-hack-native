import React, { Component } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";
import { BASE_URL } from '../utils/constants';

interface Props {
  navigation: any
}

export class AuthScreen extends Component<Props> {
	state = {
		email: '',
		error: ''
	}

	register = () => {
		// We have to use the registration auth since we need the UID to login, 
		// and UID is only returned after registering. Login should require mail instead of UID in the api
		fetch(BASE_URL + 'user', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ mail: this.state.email }),
		})
			.then(response => response.json())
			.then(data => {
				if(data && data.message) {
					// since the api doesnt return an error on existing accounts but just a string on a success message
					// we are trying to catch it here
					this.setState({
						error: data.message,
						email: ''
					})
				} else {
					this.props.navigation.navigate('Menu', { userId: data.uid, sessionId: data.auth.userToken });
				}
			})
			.catch((e) => {
				console.error('Error:', e);
			});
	}

	onChangeText = (text: string) => {
		this.setState({ email: text })
	}

	isEmailValid = () => {
		// this should be improved to do some email validating.
		// maybe regex?
		return this.state.email.length > 3;
	}

	render() {
		return (
			<View style={style.content}>
				<Text>Login in here!</Text>
				<TextInput
					style={style.input}
					onChangeText={text => this.onChangeText(text)}
					value={this.state.email}
					placeholder="your@email.com"
					autoCompleteType="email"
					autoCapitalize="none"
					autoFocus
				/>
				<Button title={"Register"} onPress={this.register} disabled={!this.isEmailValid()} />

				<Text style={style.error}>{this.state.error}</Text>
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
	input: { 
		height: 40, 
		borderColor: 'gray', 
		borderWidth: 1, 
		alignSelf: 'stretch',
		margin: 20,
		paddingLeft: 20
	},
	error: {
		color: 'red'
	}
});
