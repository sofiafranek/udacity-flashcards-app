import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';

import TextButton from '../components/TextButton';
import { saveQuestion } from '../utils/helper';

import styles from '../utils/stylesheet';

const AddCard = (props) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleCardSubmit = () => {
    const { deckTitle } = props.route.params;
    if (question.trim() !== '' && answer.trim() !== '') {
      const card = {
        question: question.trim(),
        answer: answer.trim(),
      };
      saveQuestion(deckTitle, card).catch(() => {
        Alert.alert(
          'Action could not be completed',
          'Your card was not saved succcessfully. Please try again.'
        );
      });
      props.navigation.navigate('Deck');
    } else {
      Alert.alert('Data missing', 'Please fill all the details');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subTitle}>Add a new Card to your Deck</Text>
      <Text style={styles.text}>Add your Question</Text>
      <TextInput
        style={styles.textInput}
        value={question}
        onChangeText={(question) => {
          setQuestion(question);
        }}
        placeholder="Enter your Question"
      />
      <Text style={styles.text}>Add your Answer</Text>
      <TextInput
        style={styles.textInput}
        value={answer}
        onChangeText={(answer) => {
          setAnswer(answer);
        }}
        placeholder="Enter your Question"
      />
      <TextButton name="Submit" onPress={handleCardSubmit} />
    </View>
  );
};

export default AddCard;
