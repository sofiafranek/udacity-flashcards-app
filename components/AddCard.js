import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';

import TextButton from './TextButton';
import { saveQuestion } from '../utils/helper';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  textInput: {
    width: 250,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    margin: 10,
    color: 'black',
    backgroundColor: '#f7f7f7',
  },
  subTitle: {
    padding: 10,
    margin: 10,
    textAlign: 'center',
    color: 'black',
    backgroundColor: '#f7f7f7',
    fontSize: 22,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
  },
});

export default AddCard;
