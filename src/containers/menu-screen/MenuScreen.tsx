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

	// TODO clean up this part
	canAdd = (idx: number) => this.state.toppingsLeft > 0 && this.state.toppings[idx].value !== 'SOLD OUT' && !this.state.loading;
	canSubtract = (idx: number) => this.state.toppings[idx].amount > 0 && this.state.toppings[idx].value !== 'SOLD OUT' && !this.state.loading;

	placeOrder = () => {
		this.setState({ loading: true });

		const { sessionId, userId } = this.props.navigation.state.params;
		fetch(BASE_URL + 'order', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'User-Token': sessionId
			},
			body: JSON.stringify({ 
				uid: userId,
				pizza: this.getToppings()
			})
		})
			.then(response => response.json())
			.then(data => {
				console.log('Success', data);
				if(!data.message) {
					this.props.navigation.navigate('Reciept', { 
						estimatedTime: data.estimatedTime,
						totalPrice: this.getTotalPrice(),
						orderId: data.id,
						userId: userId,
						sessionId: sessionId
					});
				} else {
					this.setState({ loading: false, error: data.message });
				}
			})
			.catch((e) => {
				console.error('Error:', e);
				this.setState({ loading: false, error: 'Something went wrong.' });
			});
	}

	// TODO perhaps find a nicer way of adding the toppin names
	getToppings = () => {
		const addedToppings = this.state.toppings.filter((item) => item.amount > 0);
		const topArr:string[] = [];
		addedToppings.forEach((item) => {
			for(let i = 0; i < item.amount; i++) {
				topArr.push(item.key);
			}
		})
		return topArr;
	}

	getTotalPrice = () => {
		return this.state.toppings
			.filter((item) => item.amount > 0)
			.reduce((acc, item) => acc + (item.value * item.amount), 0)
	}

	render() {
		const { toppings, toppingsLeft, loading, error } = this.state;

		return (
			<View style={style.content}>
				{loading && <ActivityIndicator />}

				<Text style={style.bold}>{`Toppings left: ${toppingsLeft}`}</Text>
				<Text style={style.bold}>{`Topping Total: €${this.getTotalPrice()}`}</Text>
				{toppings.map((item, idx) => {
					return (
						<View key={item.key} style={style.itemRow}>
							<Text>{`${item.key} €${item.value} - Amount: ${item.amount}`}</Text>
							<Button title={'-'} disabled={!this.canSubtract(idx)} onPress={() => this.removeItem(idx)} />
							<Button title={'+'} disabled={!this.canAdd(idx)} onPress={() => this.addItem(idx)} />
						</View>
					)
				})}
										
				<Button title="Place Order" onPress={this.placeOrder} disabled={this.state.loading} />
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
	},
	bold: {
		fontSize: 14,
		fontWeight: '700'
	}
});
