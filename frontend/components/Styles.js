import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
    marginBottom: 10,
  },
  result: {
    flexDirection: "row",
    width: "100%",
    margin: 5,
    alignItems: "center",
  },
  item: {
    flexDirection: "column",
    paddingLeft: 10,
  },
  card: {
    marginBottom: 10,
  },
  searchBar: {
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: "bold",
    maxWidth: "84%",
  },
  price: {
    fontWeight: "bold",
    fontSize: 18,
  },
  text: {
    margin: 10,
  },
  ///////////
  optionTitle: {
    margin: 4,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  chip: {
    margin: 4,
  },
  tiny: {
    marginVertical: 2,
    marginRight: 2,
    marginLeft: 2,
    minHeight: 19,
    lineHeight: 19,
  },
  bigTextFlex: {
    flex: 1,
  },
  bigTextStyle: {
    flex: -1,
  },
  fullWidthChip: {
    marginVertical: 4,
    marginHorizontal: 12,
  },
});

export { styles };
