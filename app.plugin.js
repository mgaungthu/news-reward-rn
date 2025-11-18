const { withAppBuildGradle, withDangerousMod } = require("@expo/config-plugins");

module.exports = function withFacebookMediation(config) {
  // ✅ Inject Facebook adapter into the app-level build.gradle
  config = withAppBuildGradle(config, (gradleConfig) => {
    if (gradleConfig.modResults.language === "groovy") {
      const dependencyLine =
        "    implementation 'com.google.ads.mediation:facebook:6.16.0.0'";
      const metaSDKLine = "    implementation 'com.facebook.android:audience-network-sdk:6.21.0'";
      if (!gradleConfig.modResults.contents.includes(dependencyLine)) {
        gradleConfig.modResults.contents = gradleConfig.modResults.contents.replace(
          /dependencies\s?{/,
          `dependencies {\n${dependencyLine}`
        );
        console.log("✅ Added Facebook mediation dependency to app/build.gradle");
      }
      if (!gradleConfig.modResults.contents.includes(metaSDKLine)) {
        gradleConfig.modResults.contents = gradleConfig.modResults.contents.replace(
          /dependencies\s?{/,
          `dependencies {\n${dependencyLine}\n${metaSDKLine}`
        );
        console.log("✅ Added Facebook Audience Network SDK dependency to app/build.gradle");
      }
    }
    return gradleConfig;
  });

  // ✅ Optionally inject iOS Pod for EAS build
  config = withDangerousMod(config, [
    "ios",
    async (modConfig) => {
      const fs = require("fs");
      const path = require("path");
      const podfilePath = path.join(modConfig.modRequest.platformProjectRoot, "Podfile");
      let podfile = fs.readFileSync(podfilePath, "utf-8");

      if (!podfile.includes("GoogleMobileAdsMediationFacebook")) {
        podfile += `\npod 'GoogleMobileAdsMediationFacebook'`;
        fs.writeFileSync(podfilePath, podfile);
        console.log("✅ Added Facebook mediation Pod to iOS/Podfile");
      }
      if (!podfile.includes("FBAudienceNetwork")) {
        podfile += `\npod 'FBAudienceNetwork'`;
        fs.writeFileSync(podfilePath, podfile);
        console.log("✅ Added FBAudienceNetwork Pod to iOS/Podfile");
      }

      return modConfig;
    },
  ]);

  return config;
};