import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, Button, Text } from "react-native";
import { BASE_URL } from '../utils/constants';

interface Props {
  navigation: any
}

interface Toppings {
	key: string
	value: any
	amount: number
}

interface State {
  toppingsLeft: number
  toppings: Toppings[]
	loading: boolean
	error: string
}

export class MenuScreen extends Component<Props, State> {
	constructor(props: Props) {
    super(props);

    this.state = {
			toppingsLeft: 3,
			toppings: [],
			loading: true,
			error: ''
		}
  }

	componentDidMount() {
		const { sessionId, userId } = this.props.navigation.state.params;

		fetch(BASE_URL + 'menu')
			.then(response => response.json())
			.then(data => {
				if(!data.message) {
					// convert to array, for better usability
					const toppingsArr = Object.entries(data.toppings).map(([key, value]) => ({key, value, amount: 0}));
					this.setState({
						loading: false,
						toppings: toppingsArr
					});
				} else {
					this.setState({ error: data.message });
				}
			})
			.catch(() => {
				this.setState({
					loading: false,
					error: 'Something went wrong'
				});
			});
	}

	addItem = (idx: number) => {
		const newToppings = [...this.state.toppings];
		newToppings[idx].amount++;
		this.setState(prevState => ({ 
			toppings: newToppings, 
			toppingsLeft: prevState.toppingsLeft - 1 
		}));
	}

	removeItem = (idx: number) => {
		const newToppings = [...this.state.toppings];
		newToppings[idx].amount--;
		this.setState(prevState => ({ 
			toppings: newToppings, 
			toppingsLeft: prevState.toppingsLeft + 1 
		}));
	}

	canAdd = () =>  this.state.toppingsLeft > 0;
	canSubtract = (idx: number) => Boolean(this.state.toppings[idx].amount > 0);

	placeOrder = () => {
		const { sessionId, userId } = this.props.navigation.state.params;
		console.log('PROPS', sessionId, ' + ', userId);
		fetch(BASE_URL + 'order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Token': sessionId
			},
			body: JSON.stringify({ 
				uid: userId,
				pizza: ['Meat', 'Bacon', 'Cheese']
			})
		})
			.then(response => response.json())
			.then(data => {
				console.log('Success', data);
				if(!data.message) {
					this.props.navigation.navigate('Reciept', { 
						estimatedTime: data.estimatedTime,
						orderId: data.id,
						userId: userId,
						sessionId: sessionId
					});
				} else {
					this.setState({ error: data.message });
				}
			})
			.catch((e) => {
				console.error('Error:', e);
				this.setState({ error: 'Something went wrong.' });
			});
	}

	render() {
		const { toppings, toppingsLeft, loading, error } = this.state;

		return (
			<View style={style.content}>
				{loading && <ActivityIndicator />}
				{/* TODO: Add total cost amount */}
				{/* TODO: Add error text if menu call fails */}
				<Text>{`Toppings left: ${toppingsLeft}`}</Text>

				{toppings.map((item, idx) => {
					return (
						<View key={item.key} style={style.itemRow}>
							<Text>{`${item.key} €${item.value} - Amount: ${item.amount}`}</Text>
							<Button title={'-'} disabled={!this.canSubtract(idx)} onPress={() => this.removeItem(idx)} />
							<Button title={'+'} disabled={!this.canAdd()} onPress={() => this.addItem(idx)} />
						</View>
					)
				})}
										
				<Button title="Place Order" onPress={this.placeOrder}/>
				<Text style={style.error}>{error}</Text>
			</View>
		);
	};
}

const style = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	itemRow: {
		flexDirection: "row",
		alignItems: "center"
	},
	error: {
		color: 'red'
	}
});
