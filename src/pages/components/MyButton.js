import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const MyButton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.customClick}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',    
    backgroundColor: '#5390fe',
    color: '#5390fe',
    padding: 15,
    marginTop: 30,
    marginLeft: 35,
    marginRight: 35,
    borderRadius: 20
  },
  text: {
    color: '#FFF',
    fontSize: 18
  },
});

export default MyButton;