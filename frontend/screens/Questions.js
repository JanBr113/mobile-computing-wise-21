import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Linking,
  BackHandler,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import {
  Searchbar,
  ActivityIndicator,
  Card,
  Paragraph,
  Title,
  Button,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { useGlobalState } from "../components/GlobalState";
import {
  getAnswersToProductQuestions,
  addOneLikeToQuestion,
  substractOneLikeFromQuestion,
  deleteQuestion,
} from "../api/express-api";
import StarRating from "react-native-star-rating-widget";
import { styles } from "../components/Styles";

const QuestionScreen = ({ route }) => {
  const [text, setText] = React.useState("");
  const [answerID, setAnswerID] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchTitle, setSearchTitle] = React.useState("");
  const [amountLikes, setAmountLikes] = React.useState("");
  const [showLikes, setShowLikes] = useState(false);
  const tts = useGlobalState("tts");
  const { product } = route.params;
  const [activityIndicatorAnimation, setActivityIndicatorAnimation] =
    React.useState(false);
  const [RatingButton, setRatingButton] = React.useState(true);

  const onSubmitSearch = async () => {
    setActivityIndicatorAnimation(true);
    const response = await getAnswersToProductQuestions(product, searchQuery);
    setActivityIndicatorAnimation(false);
    if (response.error) {
      Alert.alert("Error", response.error);
      return;
    }
    setRatingButton(false);
    setShowLikes(true);
    setSearchTitle(searchQuery);
    setText(response.answer.answer);
    setAnswerID(response.answer.id);
    Speech.stop();
    if (tts[0]) {
      //Ist die Sprachausgabe in Settings aktiviert?
      Speech.speak(response.answer.answer);
    }
  };

  const onLike = async (optionID) => {
    setActivityIndicatorAnimation(true);
    const response = await addOneLikeToQuestion(optionID);
    setActivityIndicatorAnimation(false);
    if (response.error) {
      Alert.alert("Error", response.error);
      return;
    }
    setAmountLikes(response.likes.likes);
    Alert.alert("LIKE", "Vielen Dank für das Feedback!");
  };

  const onDislike = async (optionID) => {
    setActivityIndicatorAnimation(true);
    const response = await substractOneLikeFromQuestion(optionID);
    setActivityIndicatorAnimation(false);
    if (response.error) {
      Alert.alert("Error", response.error);
      return;
    }
    setAmountLikes(null);
    setActivityIndicatorAnimation(true);
    const deleteResponse = await deleteQuestion(optionID);
    setActivityIndicatorAnimation(false);
    if (deleteResponse.error) {
      Alert.alert("Error", deleteResponse.error);
      return;
    }
    onSubmitSearch();

    Alert.alert("DISLIKE", "Vielen Dank für das Feedback!");
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Speech.stop();
        false;
      }
    );
    return () => backHandler.remove();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <Text style={styles.header}>Fragen zum Produkt?</Text>
        <Searchbar
          placeholder="Frage zum Produkt stellen"
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={onSubmitSearch}
          style={styles.searchBar}
          icon="help"
          iconColor="#febd69"
        />
        <Card
          key={product.asin}
          style={styles.card}
          onPress={() => {
            Linking.openURL(
              "https://www.amazon.de/dp/" + product.asin + "?tag=website0612-21"
            );
            Speech.stop();
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
        <ActivityIndicator
          animating={activityIndicatorAnimation}
          color={"#febd69"}
          size={"large"}
        />
        <Card>
          <Card.Content>
            <Title>{searchTitle}</Title>
            <Paragraph>{text}</Paragraph>
          </Card.Content>
        </Card>
        <View style={styles.button}>
          {showLikes ? (
            <View>
              <Text style={styles.text}>War die Antwort hilfreich?</Text>
              <Button
                disabled={RatingButton}
                hidden={true}
                icon="thumb-up"
                mode="outlined"
                onPress={() => {
                  onLike(answerID);
                }}
                color="#febd69"
              >
                {amountLikes}
              </Button>
              <Button
                disabled={RatingButton}
                icon="thumb-down"
                mode="outlined"
                onPress={() => {
                  onDislike(answerID);
                }}
                color="black"
              ></Button>
            </View>
          ) : null}
          <Button
            mode="contained"
            onPress={() => {
              Linking.openURL(
                "https://www.amazon.de/dp/" +
                  product.asin +
                  "?tag=website0612-21"
              );
              Speech.stop();
            }}
            color="#febd69"
          >
            BEI Amazon KAUFEN
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default QuestionScreen;
