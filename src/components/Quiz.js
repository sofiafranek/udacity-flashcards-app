import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CardFlip from 'react-native-card-flip';

import styles from '../utils/stylesheet';

import { getDeck } from '../utils/helper';
import { setLocalNotification, clearLocalNotification } from '../utils/notificationHandler';
import TextButton from './TextButton';

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Quiz = (props) => {
  const [deckData, setDeckData] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flipIndex, setFlipIndex] = useState(0);

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
    }
  }

  useEffect(() => {
    getData();
  }, []);

  const handleReset = () => {
    setAnsweredQuestions(0);
    setCorrectAnswers(0);
  };

  const handleOnFlip = (flipIndex) => {
    setFlipIndex(flipIndex);
  };

  const handleCorrect = () => {
    setAnsweredQuestions(usePrevious(answeredQuestions + 1));
    setCorrectAnswers(usePrevious(correctAnswers - 1));
    setShowAnswer(false);
    if (flipIndex === 1) {
      this.card.flip();
    }
  };

  const handleIncorrect = () => {
    setAnsweredQuestions(usePrevious(answeredQuestions + 1));
    setShowAnswer(false);
    if (flipIndex === 1) {
      this.card.flip();
    }
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
    clearLocalNotification().then(setLocalNotification);
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

      <CardFlip
        style={styles.cardContainer}
        ref={(card) => (this.card = card)}
        duration={250}
        onFlip={handleOnFlip}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.card, styles.card1]}
          onPress={() => this.card.flip()}
        >
          <Text style={styles.label}>{deckData.questions[answeredQuestions].question}</Text>
          <Text style={styles.normalText}> Tap on card to show answer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          style={[styles.card, styles.card2]}
          onPress={() => this.card.flip()}
        >
          <Text style={styles.label}>{deckData.questions[answeredQuestions].answer}</Text>
          <Text style={styles.normalText}> Tap on card to show question</Text>
        </TouchableOpacity>
      </CardFlip>

      <TextButton name="Correct" onPress={() => handleCorrect()} />
      <TextButton name="Incorrect" onPress={() => handleIncorrect()} />
    </View>
  );
};

export default Quiz;
