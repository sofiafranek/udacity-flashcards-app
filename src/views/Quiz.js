// import React, { useState, useEffect } from 'react';
// import { View, Text } from 'react-native';
// import FlipCard from 'react-native-flip-card';

// import styles from '../utils/stylesheet';

// import { getDeck } from '../utils/helper';
// import { createLocalNotification, removeNotifications } from '../utils/notificationHandler';
// import TextButton from '../components/TextButton';

// const Quiz = (props) => {
//   const [deckData, setDeckData] = useState(null);
//   const [totalQuestions, setTotalQuestions] = useState(0);
//   const [answeredQuestions, setAnsweredQuestions] = useState(0);
//   const [correctAnswers, setCorrectAnswers] = useState(0);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [showQuestion, setShowQuestion] = useState(true);

//   const [error, setError] = useState(null);
//   async function getData() {
//     try {
//       const { deckTitle } = props.route.params;
//       const deckDataFunc = await getDeck(deckTitle).catch((error) => {
//         console.log('Questions could not be loaded', error);
//       });

//       if (deckDataFunc !== undefined) {
//         const totalQuestions = deckDataFunc.questions.length;
//         setDeckData(deckDataFunc);
//         setTotalQuestions(totalQuestions);
//       }
//     } catch (e) {
//       setError(e);
//       console.log(e, 'error');
//     }
//   }

//   useEffect(() => {
//     getData();
//   }, []);

//   const handleReset = () => {
//     setAnsweredQuestions(0);
//     setCorrectAnswers(0);
//   };

//   const handleCorrect = () => {
//     setAnsweredQuestions(answeredQuestions + 1);
//     setCorrectAnswers(correctAnswers - 1);
//     console.log(showAnswer, showQuestion, 'correct');
//   };

//   const handleIncorrect = () => {
//     setAnsweredQuestions(answeredQuestions + 1);
//     console.log(showAnswer, showQuestion, 'incorrect');
//   };

//   if (deckData === null) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.infoText}>Something went wrong. Please try again later.</Text>
//         <TextButton name="Return" onPress={() => props.navigation.goBack()} />
//       </View>
//     );
//   }

//   if (totalQuestions === 0) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.infoText}>
//           There are no cards in this deck. Try adding some cards first.
//         </Text>
//         <TextButton name="Return" onPress={() => props.navigation.goBack()} />
//       </View>
//     );
//   }

//   if (answeredQuestions === totalQuestions) {
//     return (
//       <View style={styles.container}>
//         <Text style={[styles.infoText, styles.greetText]}>
//           Congratulations!! You have completed the quiz.
//         </Text>
//         <Text style={[styles.infoText, { fontSize: 23, fontWeight: 'bold' }]}>
//           You scored {correctAnswers} out of {totalQuestions}.
//         </Text>
//         <Text style={[styles.infoText, { color: '#10A5F5' }]}>Keep Praciticing!!</Text>
//         <View>
//           <TextButton name="Retake Quiz" onPress={handleReset} />
//           <TextButton name="Return" onPress={() => props.navigation.goBack()} />
//         </View>
//       </View>
//     );
//   }

//   const RenderFront = () => {
//     return (
//       <View style={[styles.card, styles.card1]}>
//         <Text style={styles.label}>{deckData.questions[answeredQuestions].question}</Text>
//         <Text style={styles.normalText}> Tap on card to show answer</Text>
//       </View>
//     );
//   };

//   const RenderBack = () => {
//     return (
//       <View style={[styles.card, styles.card2]}>
//         <Text style={styles.label}>{deckData.questions[answeredQuestions].answer}</Text>
//         <Text style={styles.normalText}> Tap on card to show question</Text>
//       </View>
//     );
//   };

//   const toggleTrueFalse = () => setShowAnswer(!true);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.plainText}>
//         Question {answeredQuestions + 1} / {totalQuestions}
//       </Text>

//       <FlipCard style={styles.cardContainer} onClick={() => toggleTrueFalse()}>
//         <RenderFront />
//         <RenderBack />
//       </FlipCard>

//       <TextButton name="Correct" onPress={() => handleCorrect()} />
//       <TextButton name="Incorrect" onPress={() => handleIncorrect()} />
//     </View>
//   );
// };

// export default Quiz;

/* Unfortunately couldn't get flipcard to work using hooks so for now converted back to class.
In the future I hope I can overcome the errors but for now class will prevail :( ) */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CardFlip from 'react-native-card-flip';

import styles from '../utils/stylesheet';

import { getDeck } from '../utils/helper';
import { setLocalNotification, clearLocalNotification } from '../utils/notificationHandler';
import TextButton from '../components/TextButton';

export default class QuizView extends React.Component {
  state = {
    deckData: null,
    totalQuestions: 0,
    answeredQuestions: 0,
    correctAnswers: 0,
    showAnswer: false,
    flipIndex: 0,
  };

  async componentDidMount() {
    const { deckTitle } = this.props.route.params;
    const deckData = await getDeck(deckTitle).catch((error) => {
      console.log('Questions could not be loaded', error);
    });
    if (deckData !== undefined) {
      const totalQuestions = deckData.questions.length;
      this.setState({
        deckData,
        totalQuestions,
      });
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
