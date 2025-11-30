const {
  withAppBuildGradle,
  withGradleProperties,
  withPodfile,
} = require("@expo/config-plugins");

module.exports = function withIronSource(config) {
  // ANDROID: add IronSource maven repo
  config = withGradleProperties(config, (config) => {
    return config;
  });

  config = withAppBuildGradle(config, (config) => {
    const src = config.modResults.contents;

    // Add IronSource dependency
    if (!src.includes("com.ironsource.sdk:mediationsdk")) {
      config.modResults.contents = src.replace(
        "dependencies {",
        `dependencies {
           implementation 'com.ironsource.sdk:mediationsdk:7.9.0'
        `
      );
    }

    return config;
  });

  // iOS: add pod
  config = withPodfile(config, (config) => {
    if (!config.modResults.contents.includes("IronSourceSDK")) {
      config.modResults.contents += `
  pod 'IronSourceSDK', '~> 7.6.0'
      `;
    }
    return config;
  });

  return config;
};