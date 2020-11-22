import { createSwitchNavigator, createAppContainer } from "react-navigation";
import { TestScreen } from "./containers/test-screen/TestScreen";

const TestNavigation = createSwitchNavigator({
	Test: { screen: TestScreen },
});

export default createAppContainer(TestNavigation);
