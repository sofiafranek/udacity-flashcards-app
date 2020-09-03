import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import FlipCard from 'react-native-flip-card';

import styles from '../utils/stylesheet';

import { getDeck } from '../utils/helper';
import { createLocalNotification, removeNotifications } from '../utils/notificationHandler';
import TextButton from '../components/TextButton';

const Quiz = (props) => {
  const [deckData, setDeckData] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [error, setError] = useState(null);
  async function getData() {
    try {
      const { deckTitle } = props.route.params;
      const deckDataFunc = await getDeck(deckTitle).catch((error) => {
        console.log('Questions could not be loaded', error);
      });

      if (deckDataFunc !== undefined) {
        const totalQuestions = deckDataFunc.questions.length;
        setDeckData(deckDataFunc);
        setTotalQuestions(totalQuestions);
      }
    } catch (e) {
      setError(e);
      console.log(e, 'error');
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleReset = () => {
    setAnsweredQuestions(0);
    setCorrectAnswers(0);
  };

  const handleCorrect = () => {
    setAnsweredQuestions(answeredQuestions + 1);
    setCorrectAnswers(correctAnswers - 1);
    setShowAnswer(false);
  };

  const handleIncorrect = () => {
    setAnsweredQuestions(answeredQuestions + 1);
    setShowAnswer(false);
  };

  if (deckData === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Something went wrong. Please try again later.</Text>
        <TextButton name="Return" onPress={() => props.navigation.goBack()} />
      </View>
    );
  }

  if (totalQuestions === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>
          There are no cards in this deck. Try adding some cards first.
        </Text>
        <TextButton name="Return" onPress={() => props.navigation.goBack()} />
      </View>
    );
  }

  if (answeredQuestions === totalQuestions) {
    return (
      <View style={styles.container}>
        <Text style={[styles.infoText, styles.greetText]}>
          Congratulations!! You have completed the quiz.
        </Text>
        <Text style={[styles.infoText, { fontSize: 23, fontWeight: 'bold' }]}>
          You scored {correctAnswers} out of {totalQuestions}.
        </Text>
        <Text style={[styles.infoText, { color: '#10A5F5' }]}>Keep Praciticing!!</Text>
        <View>
          <TextButton name="Retake Quiz" onPress={handleReset} />
          <TextButton name="Return" onPress={() => props.navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.plainText}>
        Question {answeredQuestions + 1} / {totalQuestions}
      </Text>

      <FlipCard style={styles.cardContainer}>
        <View style={[styles.card, styles.card1]}>
          <Text style={styles.label}>{deckData.questions[answeredQuestions].question}</Text>
          <Text style={styles.normalText}> Tap on card to show answer</Text>
        </View>

        <View style={[styles.card, styles.card2]}>
          <Text style={styles.label}>{deckData.questions[answeredQuestions].answer}</Text>
          <Text style={styles.normalText}> Tap on card to show question</Text>
        </View>
      </FlipCard>

      <TextButton name="Correct" onPress={() => handleCorrect()} />
      <TextButton name="Incorrect" onPress={() => handleIncorrect()} />
    </View>
  );
};

export default Quiz;
