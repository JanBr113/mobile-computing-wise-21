import React from "react";
import PaperOnboarding from "@gorhom/paper-onboarding";
import { useNavigation } from "@react-navigation/native";
import { Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const data = [
  {
    title: "Hallo",
    description:
      "Schön, das du dich für die Product Finder App entschieden hast!",
    backgroundColor: "#37475a",
    image: (
      <Image
        source={require("../assets/target.png")}
        style={{ height: 200, width: 200 }}
        resizeMode="cover"
      />
    ),
    icon: (props) => <Ionicons name="home" size={30} color="#000000" />,
  },
  {
    title: "Einfache Suche",
    description:
      "Finde mit wenig Suchaufwand, das richtige Produkt bei Amazon.",
    backgroundColor: "#37475a",
    image: (
      <Image
        source={require("../assets/find.png")}
        style={{ height: 200, width: 200 }}
        resizeMode="cover"
      />
    ),
    icon: (props) => <Ionicons name="logo-amazon" size={30} color="#000000" />,
  },
  {
    title: "Intelligenter Assistent",
    description:
      "Diese App unterstützt dich bei deiner Produktauswahl und Kaufentscheidung.",
    backgroundColor: "#37475a",
    image: (
      <Image
        source={require("../assets/bot.png")}
        style={{ height: 200, width: 200 }}
        resizeMode="cover"
      />
    ),
    icon: (props) => <Ionicons name="basket" size={30} color="#000000" />,
  },
];

const OnBoarding = () => {
  const navigation = useNavigation();
  const handleOnClosePress = () => navigation.navigate("BottomNavigation");
  return (
    <PaperOnboarding
      data={data}
      onCloseButtonPress={handleOnClosePress}
      closeButtonText="WEITER" /*closeButton={(props) => null}*/
    />
  );
};

export default OnBoarding;
