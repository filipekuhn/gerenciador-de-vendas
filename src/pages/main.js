/*import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import Database from '../database/Database';

const db = new Database();

export default class Main extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: 'Customer List',
      headerRight: (
        <Button
          buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
          icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 28 } }}
          onPress={() => { 
            navigation.navigate('RegisterCustomer', {
              onNavigateBack: this.handleOnNavigateBack
            }); 
          }}
        />
      ),
    };
  };

  constructor() {
    super();
    this.state = {
      isLoading: true,
      products: [],
      notFound: 'Customers not found.\nPlease click (+) button to add it.'      
    };
    this.getCustomers();  
  }

  componentDidMount() {
    this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getCustomers();
    });
  }

  getCustomers() {
    let customers = [];
    db.listCustomer().then((data) => {
      customers = data;
      this.setState({
        customers,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      leftAvatar={{
        //source: item.prodImage && { uri: item.prodImage },
        title: item.name[0]
      }}
      onPress={() => {
        this.props.navigation.navigate('Customer', {
          idcostumer: `${item.idcostumer}`,
        });
      }}
      chevron
      bottomDivider
    />
  )

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
          <Button
          title="Clientes"
          onPress={ () => this.props.navigation.navigate('RegisterCustomer')} />
        </View>
      )
    }
    if(this.state.customers.length === 0){
      return(
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>          
          <Button
            title="Add Clientes"
            onPress={ () => this.props.navigation.navigate('RegisterCustomer')} />
        </View>
        
        
      )
    }
    return (
      <View>
        <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.customers}
        renderItem={this.renderItem}
      />
        <Button
          title="Clientes"
          onPress={ () => this.props.navigation.navigate('RegisterCustomer')} />
      </View>
      
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  message: {
    padding: 16,
    fontSize: 18,
    color: 'red'
  }
});
*/

import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MyButton from './components/MyButton';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SQLite, openDatabase } from 'react-native-sqlite-storage';
import Cities from '../utils/cities.json';
import DB from '../database/Database';

const Stack = createStackNavigator();
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
    </View>
    );
  }
}
