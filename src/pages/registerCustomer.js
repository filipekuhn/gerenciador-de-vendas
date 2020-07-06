import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import MyButton from './components/MyButton';
import CitiesSelectBox from './components/CitiesSelectBox';
import moment from 'moment';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components';
import SelectBox from 'react-native-multi-selectbox';
import CustomerDatabase from '../database/Customer';
import CityDatabase from '../database/City';
import SellingWayDatabase from '../database/SellingWay';
import { SafeAreaView } from 'react-native-safe-area-context';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}
const db = new CustomerDatabase();
const dbCity = new CityDatabase();
const dbSellingWay = new SellingWayDatabase();

export default class RegisterCostumer extends Component {
  static navigationOptions = {
    title: 'Add Cliente'
  };
  constructor() {
    super();    
    this.state = {
      idcustomer: '',
      name: '',
      email: '',
      phone: '',
      idfileformat: '',
      idcity: '',
      idsellingway: '',
      registrationdate: '',
      isLoading: '',
      cities: [{item: 'Cidades', id: 0}],
      selectedLocations: [{item: 'Cidades', id: 0}],
      sellingWays: [{item: 'Origem do Cliente', id: 0}],
      selectedSellingWay: [{item: 'Origem do Cliente', id: 0}]
    };      
    
  }

  componentDidMount() {    
    this.getCities();
    this.getSellingWays();
  }

  getCities() {
    let cities = [];
    dbCity.listCities().then((data) => {
      cities = data;
      selectedLocations = data;
      this.setState({
        cities,
        selectedLocations,
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
      selectedSellingWay = data;      
      this.setState({
        sellingWays,        
        selectedSellingWay,
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
    let todayDate = moment(new Date()).format("DD-MM-YYYY");
    this.setState({
      isLoading: true,      
    });    
    let data = {      
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      idfileformat: this.state.idfileformat,
      idcity: this.state.selectedLocations[0].id,
      idsellingway: this.state.selectedSellingWay[0].id,
      registrationdate: todayDate
    }
    db.addCustomer(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Usuário",
        "O Cadastro foi salvo com sucesso!",
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.navigate('Main'), 
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
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
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
                mask="(00) 00000 - 0000"
                onChangeText={(text) => this.updateTextInput(text, 'phone')}             
              />
              <SafeAreaView style={{ flex: 1 }}>
              <ThemeProvider theme={Colors} style={{ flex: 1 }}>
                <View style={{ margin: 30 }}>          
                  <Text style={{ fontSize: 15, paddingBottom: 10 }}>Selecione a Cidade</Text>
                  <SelectBox
                    label=""            
                    options={this.state.cities}            
                    value={this.state.selectedLocations[0]}                    
                    onChange={val => this.setState({ selectedLocations: [val]})}            
                    hideInputFilter={false}
                    viewMargin="00 0 20px 0"
                  />                  
                </View>
              
                <View style={{ margin: 30 }}>
                  <Text style={{ fontSize: 15, paddingBottom: 10 }}>Selecione a Origem do Cliente</Text>
                  <SelectBox
                    label=""            
                    options={this.state.sellingWays}            
                    value={this.state.selectedSellingWay[0]}                    
                    onChange={val => this.setState({ selectedSellingWay: [val]})}            
                    hideInputFilter={false}
                    viewMargin="00 0 20px 0"
                  />
                </View>
              </ThemeProvider>       
              </SafeAreaView>                  
              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Cadastrar"
                buttonStyle={styles.button}
                //customClick={this.register_customer.bind(this)}
                //onPress={() => this.saveCustomer()}
                onPress={() => this.saveCustomer()}
              />

              <Button
                icon={{name: 'warning', color: '#FFF'}}
                title="Apagar todos Clientes"
                buttonStyle={styles.button}
                //customClick={this.register_customer.bind(this)}
                //onPress={() => this.saveCustomer()}
                onPress={() => db.deleteAllCustomer()}
              />                         
              <Button                
                leftIcon={{name: 'save'}}
                title="Listar"                
                buttonStyle={styles.button}
                //customClick={this.db.listCustomer()}
                //onPress={() => this.saveCustomer()}
                onPress={() => db.listCustomer()}
              />              
              <Button
                leftIcon={{name: 'save'}}
                title="Apagar a tabela Customer"
                buttonStyle={styles.button}
                //customClick={this.register_customer.bind(this)}
                //onPress={() => this.saveCustomer()}
                onPress={() => db.dropTableCustomer()}
              />
              <Button
                leftIcon={{name: 'save'}}
                title="Log da cidade"
                buttonStyle={styles.button}
                //customClick={this.register_customer.bind(this)}
                //onPress={() => this.saveCustomer()}
                onPress={() => this.log()}
              />

            </KeyboardAvoidingView>
        </ScrollView>
      </View>
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