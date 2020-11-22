module.exports = {
	preset: "react-native",
	moduleFileExtensions: ["ts", "tsx", "js"],
	transform: {
		"^.*(.js)$": "babel-jest",
		"(^.?|.[^d]|[^.]d|[^.][^d]).ts$": "ts-jest",
		"^.*.tsx$": "ts-jest",
	},
	transformIgnorePatterns: [
		"^/node_modules/(?!(react-native.*))",
		"^/node_modules/(?!@goin/*.)",
		"^.*.d.ts$",
	],
	testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$",
	testPathIgnorePatterns: ["\\.snap$", "<rootDir>/node_modules/", "<rootDir>/lib/"],
	watchman: false,
	verbose: true,
	cacheDirectory: ".jest/cache",
	globals: {
		"ts-jest": {
			isolatedModules: true,
		},
	},
	snapshotSerializers: ["enzyme-to-json/serializer"],
	setupFiles: ["<rootDir>/setupEnzyme.js"],
};
