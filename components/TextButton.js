import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  btnSub: {
    backgroundColor: '#0275d8',
    width: 250,
    alignItems: 'center',
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  btnTxt: {
    fontSize: 16,
    color: '#f7f7f7',
  },
});

export default TextButton;
