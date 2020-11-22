import { createSwitchNavigator, createAppContainer } from "react-navigation";
import PizzaApp from "./src/App";

const mainNavigator = createSwitchNavigator({
	Test: {
		screen: PizzaApp,
	},
});

export default createAppContainer(mainNavigator);
