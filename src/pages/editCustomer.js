import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components';
import SelectBox from 'react-native-multi-selectbox';
import CustomerDatabase from '../database/Customer';
import CityDatabase from '../database/City';
import SellingWayDatabase from '../database/SellingWay';
import FileFormatDatabase from '../database/FileFormat';
import { SafeAreaView } from 'react-native-safe-area-context';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}
const db = new CustomerDatabase();
const dbCity = new CityDatabase();
const dbSellingWay = new SellingWayDatabase();
const dbFileFormat = new FileFormatDatabase();

export default class EditCostumer extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      customer: {},
      city: {},
      sellingWay: {},
      fileFormat: {},
      idcustomer: '',
      name: '',
      email: '',
      phone: '',
      idfileformat: '',
      idcity: '',
      idsellingway: '',  
      comments: '',    
      isLoading: '',
      cities: [{item: 'Cidades', id: 0}],
      selectedLocations: [{item: 'Cidades', id: 0}],
      sellingWays: [{item: 'Origem do Cliente', id: 0}],
      selectedSellingWay: [{item: 'Origem do Cliente', id: 0}],
      fileFormats: [{item: 'Formato do Arquivo', id: 0}],
      selectedFileFormats: [{item: 'Formato do Arquivo', id: 0}]
    };      
    
  }

  componentDidMount() {    
    this.getCustomer();
    this.getCities();
    this.getSellingWays();
    this.getFileFormats();
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
        id: customer._id
      });
      dbCity.findCityById(this.state.customer.idcity).then((data) => {
        city = data;
        this.setState({ 
          city,
          selectedLocations: [{ item: city.name + " - " + city.uf, id: city._id }],
          isLoading: false          
        });
        console.log("Ó AQUI Ó: ", city.name);
        
      }).catch((err) => {
        console.log(err);
        this.setState = ({
          isLoading: false
        });
      });
      dbSellingWay.findSellingWayById(this.state.customer.idsellingway).then((data) => {
        sellingWay = data;
        this.setState({
          sellingWay,
          selectedSellingWay: [{ item: sellingWay.name, id: sellingWay._id }],
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
          selectedFileFormats: [{ item: fileFomart.name, id: fileFomart._id }],
          isLoading: false
        });
      }).catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false
        });
      });
      this.setState({
        idcustomer: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        idcity: customer.idcity,
        idfileformat: customer.idfileformat,
        idsellingway: customer.idsellingway, 
        comments: customer.comments                      
      });
      console.log(`Esse são os dados setados de customer por id: ${customer._id} nome: ${customer.name}, cidade: ${city.name} estado: ${city.uf} origem: ${sellingWay.name} arquivo: ${fileFomart.name}` );
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getCities() {
    let cities = [];
    dbCity.listCities().then((data) => {
      cities = data;
      //selectedLocations = data;
      this.setState({
        cities,        
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getSellingWays() {
    let sellingWays = [];
    dbSellingWay.listSellingWaysItems().then((data) => {
      sellingWays = data;
      //selectedSellingWay = data;      
      this.setState({
        sellingWays,                
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }
  
  getFileFormats() {
    let fileFormats = [];
    dbFileFormat.listFileFormatsItems().then((data) => {
      fileFormats = data;
      //selectedFileFormats = data;      
      this.setState({
        fileFormats,                
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveCustomer() {    
    this.setState({
      isLoading: true,      
    });    
    let data = {            
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      idfileformat: this.state.selectedFileFormats[0].id,
      idcity: this.state.selectedLocations[0].id,
      idsellingway: this.state.selectedSellingWay[0].id,   
      comments: this.state.comments,   
      _id: this.state.customer._id
    }
    db.editCustomer(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Edição de Cadastro de Usuário",
        "O Cadastro foi alterado com sucesso!",
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.push('Customer', {
              id: `${this.state.customer._id}`
            }), 
            icon: "done"
          }
        ],
        { cancelable: false }
      );
      //this.props.navigation.navigate('Main');
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    });
  }

  render() {    
    return(      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ justifyContent: 'space-between' }}>
              <TextInput
                placeholder="Nome"
                style={styles.textInput}
                value={this.state.name}
                onChangeText={(text) => this.updateTextInput(text, 'name')}                
              />       
              <TextInput
                placeholder="E-mail"
                keyboardType={"email-address"}
                style={styles.textInput}
                value={this.state.email}
                onChangeText={(text) => this.updateTextInput(text, 'email')}                
              />
              <TextInput
                placeholder="Telefone"
                style={styles.textInput}
                value={this.state.phone}                
                onChangeText={(text) => this.updateTextInput(text, 'phone')}             
              />              
              <TextInput
                placeholder="Observações"
                style={styles.textInput}
                multiline={true}
                value={this.state.comments}
                onChangeText={(text) => this.updateTextInput(text, 'comments')}
              />     
          </KeyboardAvoidingView>
        </ScrollView>        
        <ThemeProvider theme={Colors}>
          <View style={{ marginTop: 1, marginBottom: 5, marginLeft: 20, marginRight: 20 }}>          
            <Text style={{ fontSize: 12, marginBottom: 5 }}>Selecione a Cidade</Text>
            <SelectBox
              label=""            
              options={this.state.cities}                          
              value={this.state.selectedLocations[0]}                    
              onChange={val => this.setState({ selectedLocations: [val]})}            
              hideInputFilter={false}
              viewMargin="00 0 10px 0"                                  
            />                  
          </View>
          <View style={{ marginTop: 5, marginBottom: 5, marginLeft: 20, marginRight: 20 }}>
            <Text style={{ fontSize: 12, paddingBottom: 5 }}>Selecione a Origem do Cliente</Text>
            <SelectBox
              label=""            
              options={this.state.sellingWays}            
              value={this.state.selectedSellingWay[0]}                    
              onChange={val => this.setState({ selectedSellingWay: [val]})}            
              hideInputFilter={false}
              viewMargin="00 0 10px 0"                
            />
          </View>
          <View style={{ marginTop: 5, marginBottom: 5, marginLeft: 20, marginRight: 20 }}>
            <Text style={{ fontSize: 12, paddingBottom: 5 }}>Formato de Arquivo</Text>
            <SelectBox
              label=""            
              options={this.state.fileFormats}            
              value={this.state.selectedFileFormats[0]}                    
              onChange={val => this.setState({ selectedFileFormats: [val]})}            
              hideInputFilter={false}
              viewMargin="00 0 10px 0"                
            />
          </View>
        </ThemeProvider>
        <ScrollView>
          <Button
            icon={{name: 'save', color: '#FFF'}}         
            title="Cadastrar"
            buttonStyle={styles.button}                
            onPress={() => this.saveCustomer()}
          />

          <Button
            icon={{name: 'warning', color: '#FFF'}}
            title="Apagar todos Clientes"
            buttonStyle={styles.button}
            onPress={() => db.deleteAllCustomer()}
          />    
        </ScrollView>
      </SafeAreaView>
    );
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
  icon: {
    color: '#FFF'
  },
  textInput: {    
    borderLeftColor: '#FFF',
    borderRightColor: '#FFF',    
    borderTopColor: '#FFF',
    borderBottomColor: '#5DADE2',
    borderWidth: 1,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
});