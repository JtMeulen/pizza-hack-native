import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { AuthScreen } from "./containers/auth-screen/AuthScreen";
import { MenuScreen } from "./containers/menu-screen/MenuScreen";
import { RecieptScreen } from "./containers/reciept-screen/RecieptScreen";

const TestNavigation = createSwitchNavigator({
	Auth: { screen: AuthScreen },
	Menu: { screen: MenuScreen },
	Reciept: { screen: RecieptScreen }
});

export default createAppContainer(TestNavigation);
