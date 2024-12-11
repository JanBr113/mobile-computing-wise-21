import * as React from "react";
import { BottomNavigation } from "react-native-paper";
import Search from "../screens/Search";
import Imprint from "../screens/Imprint";
import Settings from "../screens/Settings";

const BottomNavigationFooter = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "search", title: "Produkt suchen", icon: "magnify" },
    { key: "settings", title: "Einstellungen", icon: "cog" },
    { key: "imprint", title: "Impressum", icon: "account-box" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    search: Search,
    settings: Settings,
    imprint: Imprint,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      barStyle={{ backgroundColor: "#37475a" }}
      activeColor="#febd69"
    />
  );
};

export default BottomNavigationFooter;
