import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

import { getDeck, deleteDeck } from '../utils/helper';
import TextButton from './TextButton';

import styles from '../utils/stylesheet';

const Deck = (props) => {
  const [deckData, setDeckData] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isAvailable, setIsAvailable] = useState(true);

  props.navigation.addListener('focus', async () => {
    const { deckTitle } = props.route.params;
    const deckData = await getDeck(deckTitle).catch((error) => {
      console.error('Individual Deck data could not be received ', error);
    });
    if (deckData !== undefined) {
      const totalQuestions = deckData.questions.length;
      setDeckData(deckData);
      setTotalQuestions(totalQuestions);
    } else {
      setIsAvailable(false);
    }
  });

  const handleDeleteDeck = async () => {
    const { deckTitle } = props.route.params;
    await deleteDeck(deckTitle).catch(() => {
      Alert.alert(
        'Action could not be completed',
        'The Deck could not be deleted. Please try again'
      );
    });
    props.navigation.navigate('Home');
  };

  const { deckTitle } = props.route.params;

  if (!isAvailable) {
    return (
      <View>
        <Text>No Data found for this Deck. Please try adding this deck again.</Text>
      </View>
    );
  }

  if (deckData === null) {
    return (
      <View>
        <Text>No Data found for this Deck. Please try adding this deck again.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <Text style={styles.title}>{`${deckData.title}`}</Text>
        <Text style={styles.content}>
          {totalQuestions <= 1 ? `${totalQuestions} Card` : `${totalQuestions} Cards`}
        </Text>
      </View>
      <View>
        <TextButton
          name="Add Card"
          onPress={() => props.navigation.navigate('AddCard', { deckTitle })}
        />
        <TextButton
          name="Take Quiz"
          onPress={() => props.navigation.navigate('Quiz', { deckTitle })}
        />
        <TextButton name="Delete Deck" color="red" onPress={handleDeleteDeck} />
      </View>
    </View>
  );
};

export default Deck;
