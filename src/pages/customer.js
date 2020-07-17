import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Alert}  from 'react-native';
import { Card, Button } from 'react-native-elements';
import CustomerDatabase from '../database/Customer';
import City from '../database/City';
import SellingWay from '../database/SellingWay';
import FileFormat from '../database/FileFormat';
import styles from '../stylesheet/stylesheet';

const db = new CustomerDatabase();
const dbCity = new City();
const dbSellingWay = new SellingWay();
const dbFileFormat = new FileFormat();


export default class Customer extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      customer: {},
      id: '',
      city: {},
      sellingWay: {},
      fileFomart: {},
      formatedRegistrationDate: '',
      update: false
    };      
  }
    
 componentDidMount() {  
   this.getCustomer();  
  }

  getCustomer() {
    let customer = {};   
    let city = {};
    let sellingWay = {};
    let fileFomart = {};
    const { id } = this.props.route.params;    
    db.findCustomerById(id).then((data) => {      
      customer = data;
      this.setState({
        customer,
        isLoading: false,
        id: customer._id,
        formatedRegistrationDate: String(customer.registrationdate).replace("-", "/").replace("-", "/")      
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
      dbFileFormat.findFileFormatById(this.state.customer.idfileformat).then((data) => {
        fileFomart = data;
        this.setState({
          fileFomart,
          isLoading: false
        });
      }).catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false
        });
      });
      console.log(`Esse são os dados setados de customer por id: ${customer._id} nome: ${customer.name}, cidade: ${city.name} estado: ${city.uf} origem: ${sellingWay.name} arquivo: ${fileFomart.name}` );
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
    if(this.props.route.params.update){            
      this.props.route.params.update = false;
      this.getCustomer();
    }
    return (
      <ScrollView>
        <Card style={{ fontSize: 28 }}>
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
          <View>  
            <Text>Formato de Arquivo: {this.state.fileFomart.name}</Text>
          </View>
          <View>  
            <Text>Data de Registro: {this.state.formatedRegistrationDate}</Text>
          </View>
          <View>  
            <Text>Observações:</Text>
          </View>                   
          <View>
              <Text style={{ fontSize: 14}}>{this.state.customer.comments}</Text>                  
          </View>

          <Button
            buttonStyle={styles.button}
            icon={{name: 'edit', color: '#FFF'}}
            title='Editar'
            onPress={() => this.props.navigation.navigate('EditCustomer', {
              id: `${this.state.id}`              
            })} />

          <Button
            buttonStyle={styles.deleteButton}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'            
            onPress={() => Alert.alert(
              "Exclusão de Usuário",
              `Você tem certeza que deseja excluir o usuário ${this.state.customer.name}?`,
              [
                {
                  text: "Sim", 
                  onPress: () => db.deleteCustomerById(this.state.id).then(() => this.props.navigation.navigate('Customers', {
                    update: true
                  })), 
                  icon: "done"
                },
                {
                  text: "Cancelar",                   
                }
              ],
              { cancelable: true }
            )}
            />      
        </Card>
      </ScrollView>
    )
  }
}