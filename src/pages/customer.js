import React, { Component } from 'react';
import { View, Text}  from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import MyButton from './components/MyButton';

const Stack = createStackNavigator();

export default class Customer extends Component {
  render() {
    return (
      <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
      }}>        
      <MyButton
          title="Registrar Cliente"
          customClick={ () => this.props.navigation.navigate('RegisterCustomer')} />      
      <MyButton
          title="Visualizar Clientes"
          customClick={ () => this.props.navigation.navigate('Customers')} /> 
    </View>
    );
  }
}
