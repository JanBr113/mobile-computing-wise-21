import React from "react";
import { View, Text, Alert, Image, ScrollView } from "react-native";
import { Searchbar, Card, Chip, ActivityIndicator } from "react-native-paper";
import { getProductByKeyword, getOptionsByKeyword } from "../api/express-api";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import StarRating from "react-native-star-rating-widget";
import { styles } from "../components/Styles";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [products, setProducts] = React.useState(undefined);
  const [options, setOptions] = React.useState(undefined);
  const navigation = useNavigation();
  const [activityIndicatorAnimation, setActivityIndicatorAnimation] =
    React.useState(false);

  const onSubmitSearch = async () => {
    setActivityIndicatorAnimation(true);
    const response = await getProductByKeyword(searchQuery); //gets products
    if (response.error) {
      Alert.alert("Error", response.error);
      return;
    }
    setProducts(response.products);

    const option_response = await getOptionsByKeyword(searchQuery); // gets options
    setActivityIndicatorAnimation(false);
    if (option_response.error) {
      Alert.alert("Error", option_response.error);
      return;
    }
    setOptions(option_response.options);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.header}>Produkt suchen</Text>
        <Searchbar
          placeholder="Produkt suchen"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={onSubmitSearch}
          style={styles.searchBar}
          iconColor="#febd69"
        />
        {options && (
          <View>
            {options.map((option, index) => (
              <View key={index}>
                <Text style={styles.optionTitle}>{option.option}</Text>
                <ScrollView horizontal="true">
                  <View style={styles.row}>
                    {option.choices.split(",").map((choice, index) => (
                      <Chip
                        key={index}
                        style={styles.chip}
                        mode="flat"
                        onPress={() => {
                          setSearchQuery(searchQuery + " " + choice);
                          onSubmitSearch();
                        }}
                      >
                        {choice}
                      </Chip>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ))}
          </View>
        )}

        {products && (
          <View>
            {products.map((product, index) => (
              <Card
                key={index}
                style={styles.card}
                onPress={() => {
                  navigation.navigate("Questions", {
                    product: product, //Param
                  });
                }}
              >
                <View style={styles.result}>
                  <Image source={{ uri: product.image }} style={styles.image} />
                  <View style={styles.item}>
                    <Text style={styles.title}>{product.title}</Text>
                    <StarRating
                      rating={product.star_rating}
                      onChange={() => {}}
                      maxStars={5}
                      starSize={22}
                      color={"orange"}
                      emptyColor={"orange"}
                      enableSwiping={false}
                    />
                    <Text style={styles.price}>{product.price} €</Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
        <ActivityIndicator
          animating={activityIndicatorAnimation}
          color={"#febd69"}
          size={"large"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
