import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator}  from 'react-native';
import { Card, Button } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import MyButton from './components/MyButton';
import CustomerDatabase from '../database/Customer';
import { route } from '@react-navigation/native';

const db = new CustomerDatabase();


export default class Customer extends Component {
  static navaigationOptions = {
    title: 'Dados do Cliente'
  }

  constructor() {
    super();
    this.state = {
      isLoading: true,
      customer: {},
      id: '',
    };  
    //console.log(route.params.id);
    //const idParam = route.params.id;
    //this.findCustomerData(idParam);    
  }
  

 componentDidMount() {
      
    let customer = {};   
    const { id } = this.props.route.params;    
    db.findCustomerById(id).then((data) => {      
      customer = data;
      this.setState({
        customer,
        isLoading: false,
        id: customer._id
      });
      console.log(`Esse são os dados setados de customer por id: ${customer._id} nome: ${customer.name}`);
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  
  }

  render() {    
    if(this.state.isLoading){
      return (
        <View>
          <Text>Carregando</Text>
        </View>
      )
    }
    return (
      <ScrollView>
        <Card>
          <View>  
            <Text>Id Cliente: {this.state.customer._id}</Text>
          </View>
          <View>  
            <Text>Nome Cliente: {this.state.customer.name}</Text>
          </View>
          <View>  
            <Text>E-mail Cliente: {this.state.customer.email}</Text>
          </View>
          <Button
            leftIcon={{name: 'delete'}}
            title='Deletar'
            onPress={() => db.deleteCustomerById(this.state.id)} />

        </Card>
      </ScrollView>
    )

    /*return (
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
    );*/
  }
}
