import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import styles from '../stylesheet/stylesheet';
import moment from 'moment';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { ThemeProvider } from 'styled-components';
import SelectBox from 'react-native-multi-selectbox';
import CustomerDatabase from '../database/Customer';
import CityDatabase from '../database/City';
import SellingWayDatabase from '../database/SellingWay';
import FileFormatDatabase from '../database/FileFormat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputMask } from 'react-native-masked-text';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}
const db = new CustomerDatabase();
const dbCity = new CityDatabase();
const dbSellingWay = new SellingWayDatabase();
const dbFileFormat = new FileFormatDatabase();
export default class RegisterCostumer extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      idcustomer: '',
      name: '',
      email: '',
      phone: '',
      idfileformat: '',
      idcity: '',
      idsellingway: '',
      comments: '',
      registrationdate: '',
      isLoading: '',
      cities: [{item: 'Cidades', id: 0}],
      selectedLocations: [{item: 'Cidades', id: 0}],
      sellingWays: [{item: 'Origem do Cliente', id: 0}],
      selectedSellingWay: [{item: 'Origem do Cliente', id: 0}],
      fileFormats: [{item: 'Formato do Arquivo', id: 0}],
      selectedFileFormats: [{item: 'Formato do Arquivo', id: null}]
    };      
    
  }

  componentDidMount() {    
    this.getCities();
    this.getSellingWays();
    this.getFileFormats();
  }
  comp
  componentWillUnmount() {
    this.setState({
      idcustomer: '',
      name: '',
      email: '',
      phone: '',
      idfileformat: '',
      idcity: '',
      idsellingway: '',
      registrationdate: '',
      isLoading: '',
      cities: [{item: 'Cidades', id: null}],
      selectedLocations: [],
      sellingWays: [{item: 'Origem do Cliente', id: null}],
      selectedSellingWay: [],
      fileFormats: [{item: 'Formato do Arquivo', id: null}],
      selectedFileFormats: []
    });
  }

  getCities() {
    let cities = [];
    dbCity.listCities().then((data) => {
      cities = data;      
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
    let todayDate = moment(new Date()).format("DD-MM-YYYY");
    let cityId = null;
    let sellingWayId = null;
    let fileFormatId = null;    
    this.setState({
      isLoading: true,      
    });    
    if(this.state.selectedLocations[0].id > 0) {
      cityId = this.state.selectedLocations[0].id
    }
    if(this.state.selectedSellingWay[0].id > 0) {
      sellingWayId = this.state.selectedSellingWay[0].id
    }
    if(this.state.selectedFileFormats[0].id > 0) {
      fileFormatId = this.state.selectedFileFormats[0].id      
    }
    let data = {      
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,      
      idcity: cityId,
      idsellingway: sellingWayId,
      idfileformat: fileFormatId,
      comments: this.state.comments,
      registrationdate: todayDate
    }
    db.addCustomer(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      if(result) {
        Alert.alert(
          "Cadastro de Usuário",
          "O Cadastro foi salvo com sucesso!",
          [
            {
              text: "OK", 
              onPress: () => this.props.navigation.navigate('Customers', { update: true }), 
              icon: "done"
            }
          ],
          { cancelable: false }
        );
      }else {
        Alert.alert(
          "Cadastro de Usuário",
          "Não foi possível realizar o cadastro!",
          [
            {
              text: "OK", 
              onPress: () => this.props.navigation.navigate('Customers', { update: true }), 
              icon: "done"
            }
          ],
          { cancelable: false }
        );
      }
      
      //this.props.navigation.navigate('Main');
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Usuário",
        "Não foi possível realizar o cadastro! - " + err,
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.navigate('Customers', { update: true }), 
            icon: "done"
          }
        ],
        { cancelable: false }
      );
    });
  }

  render() {    
    return(      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="position"
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
              <TextInputMask
                placeholder="Telefone"
                type={'cel-phone'}
                options={{
                  maskType: 'BRL',
                  withDDD: true,
                  dddMask: '(99) '
                }}
                style={styles.textInput}
                value={this.state.phone}                
                onChangeText={(text) => this.updateTextInput(text, 'phone')}                             
              />       
              <TextInput
                placeholder="Observações"
                multiline={true}
                style={styles.textInput}
                value={this.state.comments}
                onChangeText={(text) => this.updateTextInput(text, 'comments')}
              />             
          </KeyboardAvoidingView>          
        </ScrollView>        
        <ThemeProvider theme={Colors} style={{ marginTop: 10 }}>
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
        </ScrollView>
      </SafeAreaView>
    );
  }
}