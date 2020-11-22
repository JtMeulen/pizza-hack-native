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
	error: boolean
}

export class MenuScreen extends Component<Props, State> {
	constructor(props: Props) {
    super(props);

    this.state = {
			toppingsLeft: 3,
			toppings: [],
			loading: true,
			error: false
		}
  }

	componentDidMount() {
		fetch(BASE_URL + 'menu')
			.then(response => response.json())
			.then(({ toppings }) => {
				// convert to array, for better usability
				const toppingsArr = Object.entries(toppings).map(([key, value]) => ({key, value, amount: 0}));
				this.setState({
					loading: false,
					toppings: toppingsArr
				});
			})
			.catch(() => {
				this.setState({
					loading: false,
					error: true
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
		console.log('PROPS', this.props.navigation.state.params);
		const { sessionId, userId } = this.props.navigation.state.params;

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
				if(!data.message) {
					console.log('Success', data);
					this.props.navigation.navigate('Reciept', { estimatedTime: data.estimatedTime });
				}
			})
			.catch((e) => {
				console.error('Error:', e);
			});
	}

	render() {
		const { toppings, toppingsLeft, loading, error } = this.state;

		return (
			<View style={style.content}>
				{loading && <ActivityIndicator />}
				{error && <Text style={style.error}>{'Something went wrong, come back later'}</Text>}
				
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
