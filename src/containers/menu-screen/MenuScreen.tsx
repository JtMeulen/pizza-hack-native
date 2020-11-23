import React, { Component } from "react";
import { View, StyleSheet, ActivityIndicator, Button, Text } from "react-native";
import { BASE_URL, SOLD_OUT } from '../utils/constants';

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

  updateItem = (idx: number, add: number) => {
    const newToppings = [...this.state.toppings];
    newToppings[idx].amount += add;
    this.setState(prevState => ({ 
      toppings: newToppings, 
      toppingsLeft: prevState.toppingsLeft - add
    }));
  }

  canAdd = (idx: number, status: string) => this.state.toppingsLeft > 0 && status !== SOLD_OUT && !this.state.loading;
  canSubtract = (idx: number, status: string) => this.state.toppings[idx].amount > 0 && status !== SOLD_OUT && !this.state.loading;

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
        if(!data.message) {
          this.props.navigation.navigate('Reciept', { 
            userId: userId,
            sessionId: sessionId,
            estimatedTime: data.estimatedTime,
            totalPrice: this.getTotalPrice(),
            toppings: this.getToppings()
          });
        } else {
          this.setState({ loading: false, error: data.message });
        }
      })
      .catch((e) => {
        this.setState({ loading: false, error: 'Something went wrong.' });
      });
  }

  getToppings = () => {
    return this.state.toppings
      .filter((item) => item.amount > 0)
      .reduce((acc:string[], item) => {
        for(let i = 0; i < item.amount; i++) {
          acc.push(item.key);
        }
        return acc;
      }, [])
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
        <Text style={style.bold}>{`Topping Total: €${this.getTotalPrice().toFixed(2)}`}</Text>

        {toppings.map((item, idx) => {
          return (
            <View key={item.key} style={style.itemRow}>
              <Text style={style.name}>{`${item.key} - ${item.value != SOLD_OUT && '€'}${item.value}`}</Text>
              <Button 
                title={'-'} 
                disabled={!this.canSubtract(idx, item.value)} 
                onPress={() => this.updateItem(idx, -1)} 
              />
              <Text>{item.amount}</Text>
              <Button 
                title={'+'} 
                disabled={!this.canAdd(idx, item.value)} 
                onPress={() => this.updateItem(idx, 1)} 
              />
            </View>
          )
        })}
                    
        <Button 
          title="Place Order" 
          disabled={loading || toppingsLeft >= 3} 
          onPress={this.placeOrder}
        />
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
    alignItems: "center",
    height: 40
  },
  name: {
    flex: 0.6
  },
  error: {
    color: 'red'
  },
  bold: {
    fontSize: 14,
    fontWeight: '700'
  }
});
