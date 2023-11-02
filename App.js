import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [showWebView, setShowWebView] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [quizData, setQuizData] = useState({
    question: "Чи добре я зробив тестове завдання?",
    options: ["Так", "Ні", "Ну таке..."],
    correctAnswer: "Ні",
  });

  const checkWebsiteExistence = async (url) => {
    try {
      let response = await fetch(url);
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const handleQuizAnswer = (selectedAnswer) => {
    const isCorrect = selectedAnswer === quizData.correctAnswer;
    setQuizResult(isCorrect ? "Правильно!" : "Неправильно.");
    saveQuizResult(isCorrect);
  };

  const saveQuizResult = async (isCorrect) => {
    try {
      let quizResults = await AsyncStorage.getItem("quizResults");
      quizResults = quizResults ? JSON.parse(quizResults) : [];
      quizResults.push(isCorrect);
      await AsyncStorage.setItem("quizResults", JSON.stringify(quizResults));
    } catch (error) {
      console.error("Error saving quiz result: ", error);
    }
  };

  useEffect(() => {
    const checkWebsite = async () => {
      const url = "https://www.google.com.ua";
      const websiteExists = await checkWebsiteExistence(url);
      setShowWebView(websiteExists);
    };

    checkWebsite();
  }, []);

  return (
    <View style={styles.container}>
      {!showWebView ? (
        <WebView
          source={{ uri: "https://www.google.com.ua" }}
          style={styles.webView}
        />
      ) : (
        <View style={styles.quizContainer}>
          <Text style={styles.quizText}>{quizData.question}</Text>
          {quizData.options.map((option, index) => (
            <View key={index} style={styles.buttonWrapper}>
              <Button title={option} onPress={() => handleQuizAnswer(option)} />
            </View>
          ))}
          {quizResult && <Text style={styles.quizOther}>{quizResult}</Text>}
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  quizText: {
    marginBottom: 20,
  },
  webView: {
    flex: 1,
    width: "100%",
  },
  buttonWrapper: {
    marginTop: 10,
  },
  quizContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  quizOther: {
    marginTop: 10,
  },
});
