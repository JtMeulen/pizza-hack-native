import React from "react";
import { shallow } from "enzyme";
import { TestScreen } from "./../../src/containers/test-screen/TestScreen";

describe("TestScreen Tests", () => {
	it("should render a dummy test", () => {
		const wrapper = shallow(<TestScreen />);
		const text = wrapper
			.find("Text")
			.childAt(0)
			.text();
		expect(text).toBe("I am a test screen");
	});
});
