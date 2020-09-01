import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';

import { _store_data, getDecks } from '../utils/helper';
import styles from '../utils/stylesheet';

import Card from '../components/Card';

const DeckList = (props) => {
  const [decks, setDecks] = useState({});

  try {
    const { navigation } = props;
    navigation.addListener('focus', async () => {
      const result = await getDecks().catch((error) => {
        console.error('Deck Data could not be fetched', error);
      });
      setDecks(result);
    });
  } catch (error) {
    console.log(error);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardList}>
        {Object.keys(decks).map((title) => {
          const questions = decks[title].questions;
          return <Card questions={questions} title={title} {...props} key={title} />;
        })}
      </ScrollView>
    </View>
  );
};

export default DeckList;
