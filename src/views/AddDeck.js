import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';

import { saveDeckTitle } from '../utils/helper';
import TextButton from '../components/TextButton';

import styles from '../utils/stylesheet';

const AddDeck = (props) => {
  const [deckName, setDeckName] = useState('');

  const saveDeck = () => {
    if (deckName.trim() !== '') {
      saveDeckTitle(deckName.trim());
      setDeckName('');
      props.navigation.navigate('Deck', { deckTitle: deckName });
    } else {
      Alert.alert('Deck title missing', 'Please enter a correct name for your deck');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}> Add Deck </Text>
      <Text style={styles.subTitle}>Enter a name for your Deck</Text>
      <TextInput
        style={styles.textInput}
        value={deckName}
        placeholder="Enter a name"
        onChangeText={(deckName) => {
          setDeckName(deckName);
        }}
      ></TextInput>
      <TextButton name="Submit" onPress={saveDeck} />
    </View>
  );
};

export default AddDeck;
