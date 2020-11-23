import React, { Component } from "react";
import { View, StyleSheet, Text, TextInput, Button, ActivityIndicator } from "react-native";
import { BASE_URL, EMAIL_REGEX } from '../utils/constants';

interface Props {
  navigation: any
}

export class AuthScreen extends Component<Props> {
  state = {
    email: '',
    error: '',
    loading: false
  }

  register = () => {
    this.setState({loading: true})
    // We have to use the registration auth since we need the UID + sessionId to login, 
    // and UID/sessionId are only returned after registering. Login should require mail instead of UID in the api
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
          this.showError(data.message);
        } else {
          this.props.navigation.navigate('Menu', { userId: data.uid, sessionId: data.auth.userToken });
        }
      })
      .catch(() => this.showError('Something went wrong'));
  }

  showError = (message: string) => {
    this.setState({
      error: message,
      email: '',
      loading: false
    })
  }

  onChangeText = (text: string) => {
    this.setState({ email: text })
  }

  isEmailValid = () => {
    return EMAIL_REGEX.test(String(this.state.email).toLowerCase());
  }

  render() {
    return (
      <View style={style.content}>
        <Text style={style.title}>Register a new account here</Text>
        <TextInput
          style={style.input}
          onChangeText={text => this.onChangeText(text)}
          value={this.state.email}
          placeholder="your@email.com"
          autoCompleteType="email"
          autoCapitalize="none"
          autoFocus
        />
        <Button title={"Register"} onPress={this.register} disabled={!this.isEmailValid() || this.state.loading} />

        {this.state.loading && <ActivityIndicator />}
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
  title: {
    fontSize: 16,
    fontWeight: '700'
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
