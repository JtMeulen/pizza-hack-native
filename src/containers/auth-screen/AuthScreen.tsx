import React, { Component } from "react";
import { View, StyleSheet, Text, TextInput, Button } from "react-native";

interface Props {
  navigation: any
}

export class AuthScreen extends Component<Props> {
	state = {
		email: ''
	}

	login = () => {
		// make post request to /login
		// .then(() => navigate here)
		this.props.navigation.navigate('Test', { userId: 'loginUserID', sessionId: '5678' });
	}

	register = () => {
		// make post request to /register
		// .then(() => navigate here)
		this.props.navigation.navigate('Test', { userId: 'registerUserID', sessionId: '5678' });
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
				<Button title={"Login"} onPress={this.login} disabled={!this.isEmailValid()} />
				<Button title={"Register"} onPress={this.register} disabled={!this.isEmailValid()} />
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
	}
});
