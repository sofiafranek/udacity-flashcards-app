import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import styles from '../utils/stylesheet';

const Card = (props) => {
  return (
    <TouchableOpacity
      key={props.title}
      style={styles.card}
      onPress={() => props.navigation.navigate('Deck', { deckTitle: props.title })}
    >
      <Text style={styles.cardTitle}>{props.title}</Text>
      <Text style={styles.cardText}>
        {props.questions.length <= 1
          ? `${props.questions.length} Question`
          : `${props.questions.length} Questions`}
      </Text>
    </TouchableOpacity>
  );
};

export default Card;
