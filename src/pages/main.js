import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MyButton from './components/MyButton';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SQLite, openDatabase } from 'react-native-sqlite-storage';
import Cities from '../utils/cities.json';
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
      }}>        
      <MyButton
          title="Clientes"
          customClick={ () => this.props.navigation.navigate('Customers')} />
      <MyButton
          title="Vendas"
          customClick={ () => this.props.navigation.navigate('Sales')} /> 
      <MyButton
          title="Formas de Venda"
          customClick={ () => this.props.navigation.navigate('SellingWays')} /> 
      <MyButton
          title="Formatos de Arquivos"
          customClick={ () => this.props.navigation.navigate('FileFormats')} />
      <MyButton
          title="Produtos"
          customClick={ () => this.props.navigation.navigate('Products')} /> 
    </View>

    
    );
  }
}
