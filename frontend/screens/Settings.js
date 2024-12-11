import * as React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Switch, Card } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { setGlobalState, useGlobalState } from "../components/GlobalState";

const SettingsScreen = () => {
  const tts = useGlobalState("tts")[0];
  const onToggleTTSSwitch = () => {
    setGlobalState("tts", !tts);
  };

  return (
    <SafeAreaView>
      <Text style={styles.header}>Einstellungen</Text>
      <Card style={styles.card}>
        <View style={styles.setting}>
          <Text style={styles.text}> Sprachausgabe</Text>
          <Switch
            value={useGlobalState("tts")[0]}
            onValueChange={onToggleTTSSwitch}
            color="#febd69"
          />
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    color: "black",
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  card: {
    marginBottom: 10,
  },
});
