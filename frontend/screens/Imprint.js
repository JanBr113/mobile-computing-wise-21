import * as React from "react";
import {
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const emailJB = "jan-niclas.bracht@stud.hs-ruhrwest.de";
const emailRS = "raphael.sacher@stud.hs-ruhrwest.de";

const onPressEmailClick = (email) => {
  Linking.openURL("mailto:" + email);
};

const ImprintScreen = () => (
  <ScrollView>
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Impressum</Text>
      <Text style={styles.underlineText}>Angaben gem. § 5 TMG:</Text>
      <Text>Jan-Niclas Bracht und Raphael Sacher</Text>
      <Text>Duisburger Str. 100, 45479 Mülheim an der Ruhr{"\n"}</Text>
      <Text style={styles.underlineText}>Kontaktaufnahme:</Text>
      <TouchableOpacity onPress={() => onPressEmailClick(emailJB)}>
        <Text style={styles.email}>{emailJB}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPressEmailClick(emailRS)}>
        <Text style={styles.email}>{emailRS}</Text>
      </TouchableOpacity>
      <Image style={styles.image} source={require("../assets/HRW.jpg")} />
    </SafeAreaView>
  </ScrollView>
);

export default ImprintScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  underlineText: {
    textDecorationLine: "underline",
  },
  email: {
    fontWeight: "bold",
  },
});
