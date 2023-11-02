import appsFlyer from "react-native-appsflyer";

appsFlyer.initSdk(
  {
    devKey: "YOUR_DEV_KEY",
    appId: "YOUR_APP_ID",
  },
  (result) => {
    console.log(result);
  },
  (error) => {
    console.error(error);
  }
);
