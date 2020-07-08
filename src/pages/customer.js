import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator}  from 'react-native';
import { Card, Button } from 'react-native-elements';
import CustomerDatabase from '../database/Customer';
import City from '../database/City';
import SellingWay from '../database/SellingWay';
import { route } from '@react-navigation/native';

const db = new CustomerDatabase();
const dbCity = new City();
const dbSellingWay = new SellingWay();


export default class Customer extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      customer: {},
      id: '',
      city: {},
      sellingWay: {}
    };      
  }
    
 componentDidMount() {      
    let customer = {};   
    let city = {};
    let sellingWay = {};
    const { id } = this.props.route.params;    
    db.findCustomerById(id).then((data) => {      
      customer = data;
      this.setState({
        customer,
        isLoading: false,
        id: customer._id
      });
      dbCity.findCityById(this.state.customer.idcity).then((data) => {
        city = data;
        this.setState({ 
          city,
          isLoading: false,
        });
      }).catch((err) => {
        console.log(err);
        this.setState = {
          isLoading: false
        }
      });
      dbSellingWay.findSellingWayById(this.state.customer.idsellingway).then((data) => {
        sellingWay = data;
        this.setState({
          sellingWay,
          isLoading: false
        });
      }).catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false
        });
      });
      console.log(`Esse são os dados setados de customer por id: ${customer._id} nome: ${customer.name}, cidade: ${city.name} estado: ${city.uf} origem: ${sellingWay.name}`);
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
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      <ScrollView>
        <Card>
          <View>  
            <Text>Id: {this.state.customer._id}</Text>
          </View>
          <View>  
            <Text>Nome: {this.state.customer.name}</Text>
          </View>
          <View>  
            <Text>E-mail: {this.state.customer.email}</Text>
          </View>
          <View>  
            <Text>Telefone: {this.state.customer.phone}</Text>
          </View>
          <View>  
            <Text>Cidade: {this.state.city.name} - {this.state.city.uf}</Text>
          </View>
          <View>  
            <Text>Origem: {this.state.sellingWay.name}</Text>
          </View>
          <Button
            buttonStyle={styles.button}
            icon={{name: 'edit', color: '#FFF'}}
            title='Editar'
            onPress={() => (this.state.id)} />

          <Button
            buttonStyle={{ backgroundColor: '#FF0000', padding: 10, marginTop: 16, marginLeft: 35, marginRight: 35 }}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => db.deleteCustomerById(this.state.id)} />      
        </Card>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#5390fe',
    color: '#5390fe',
    padding: 10,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
  },
  text: {
    color: '#FFF',
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
});