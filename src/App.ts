import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { AuthScreen } from "./containers/auth-screen/AuthScreen";
import { TestScreen } from "./containers/test-screen/TestScreen";

const TestNavigation = createSwitchNavigator({
	Auth: { screen: AuthScreen },
	Test: { screen: TestScreen }
});

export default createAppContainer(TestNavigation);
