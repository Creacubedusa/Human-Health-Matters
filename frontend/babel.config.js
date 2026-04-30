module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }]],
    plugins: [
      [
        "module-resolver",
        {
          root: ["."],
          alias: {
            "@features": "./src/features",
            "@shared": "./src/shared",
            "@design": "./src/design",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
