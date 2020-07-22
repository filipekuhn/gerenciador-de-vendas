import React, { Component } from 'react';
import { View } from 'react-native';
import MyButton from './components/MyButton';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DB from '../database/Database';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const database = new DB();


export default class Main extends Component {
  constructor(props) {
    super(props);                             
  }

  render() {

    return (
      <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
        alignContent: 'space-around'
      }}>        
      <MyButton
          title="Clientes"
          customClick={ () => this.props.navigation.navigate('Customers')} />      
      <MyButton
          title="Formas de Venda"
          customClick={ () => this.props.navigation.navigate('SellingWays')} /> 
      <MyButton
          title="Formatos de Arquivos"
          customClick={ () => this.props.navigation.navigate('FileFormats')} />
      <MyButton
          title="Produtos"
          customClick={ () => this.props.navigation.navigate('Products')} />
      <MyButton
          title="Cidades"
          customClick={ () => this.props.navigation.navigate('Cities')} />
    </View>

    
    );
  }
}
