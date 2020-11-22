import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { AuthScreen } from "./containers/auth-screen/AuthScreen";
import { MenuScreen } from "./containers/menu-screen/MenuScreen";

const TestNavigation = createSwitchNavigator({
	Auth: { screen: AuthScreen },
	Menu: { screen: MenuScreen }
});

export default createAppContainer(TestNavigation);
