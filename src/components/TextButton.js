import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import styles from '../utils/stylesheet';

const TextButton = ({ onPress, color, name }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={color ? [styles.btnSub, { backgroundColor: color }] : [styles.btnSub]}
    >
      <Text style={styles.btnTxt}>{name}</Text>
    </TouchableOpacity>
  );
};

export default TextButton;
