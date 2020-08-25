import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CardFlip from 'react-native-card-flip';

import { getDeck } from '../utils/helper';
import { setLocalNotification, clearLocalNotification } from '../utils/notificationHandler';
import TextButton from './TextButton';

export default class Quiz extends React.Component {
  state = {
    deckData: null,
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    showAnswer: false,
    flipIndex: 0,
  };

  async componentDidMount() {
    try {
      const { deckTitle } = this.props.route.params;
      const deckDataFunc = await getDeck(deckTitle).catch((error) => {
        console.log('Questions could not be loaded', error);
      });
      if (deckDataFunc !== undefined) {
        const totalQuestions = deckDataFunc.questions.length;
        this.setState({
          deckData: deckDataFunc,
          totalQuestions,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  handleReset = () => {
    this.setState(() => ({
      answeredQuestions: 0,
      correctAnswers: 0,
    }));
  };

  handleOnFlip = (flipIndex) => {
    this.setState({
      flipIndex,
    });
  };

  handleCorrect = () => {
    this.setState((prevState) => ({
      answeredQuestions: prevState.answeredQuestions + 1,
      correctAnswers: prevState.correctAnswers + 1,
      showAnswer: false,
    }));
    if (this.state.flipIndex === 1) {
      this.card.flip();
    }
  };

  handleIncorrect = () => {
    this.setState((prevState) => ({
      answeredQuestions: prevState.answeredQuestions + 1,
      showAnswer: false,
    }));
    if (this.state.flipIndex === 1) {
      this.card.flip();
    }
  };

  render() {
    const { deckData, totalQuestions, answeredQuestions, correctAnswers } = this.state;

    if (deckData === null) {
      return (
        <View style={styles.container}>
          <Text style={styles.infoText}>Something went wrong. Please try again later.</Text>
          <TextButton name="Return" onPress={() => this.props.navigation.goBack()} />
        </View>
      );
    }

    if (totalQuestions === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.infoText}>
            There are no cards in this deck. Try adding some cards first.
          </Text>
          <TextButton name="Return" onPress={() => this.props.navigation.goBack()} />
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
            <TextButton name="Retake Quiz" onPress={this.handleReset} />
            <TextButton name="Return" onPress={() => this.props.navigation.goBack()} />
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
          onFlip={this.handleOnFlip}
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

        <TextButton name="Correct" onPress={() => this.handleCorrect()} />
        <TextButton name="Incorrect" onPress={() => this.handleIncorrect()} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
  },
  plainText: {
    alignSelf: 'flex-start',
    fontSize: 18,
    padding: 5,
    fontWeight: '700',
  },
  infoText: {
    fontSize: 21,
    margin: 10,
    marginBottom: 20,
    padding: 10,
  },
  greetText: {
    textAlign: 'center',
    backgroundColor: '#7AD7F0',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 20,
    padding: 10,
    margin: 50,
    width: 300,
    maxHeight: 400,
  },
  card: {
    flex: 1,
    padding: 20,
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  card1: {
    backgroundColor: '#FE474C',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
    flex: 1,
    paddingTop: 60,
    justifyContent: 'flex-end',
    textAlign: 'center',
    fontSize: 21,
    fontFamily: 'System',
    color: '#f7f7f7',
    backgroundColor: 'transparent',
  },
  newContainer: {
    flex: 1,
    borderWidth: 1,
    margin: 10,
    padding: 10,
    width: 270,
    maxHeight: 300,
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FE474C',
  },
  mainText: {
    padding: 10,
    color: '#f7f7f7',
    fontSize: 21,
    textAlign: 'center',
  },
  normalText: {
    color: '#f7f7f7',
    fontSize: 16,
    textAlign: 'center',
  },
});
