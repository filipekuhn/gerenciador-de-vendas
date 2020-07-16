import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

import Database from '../database/Product';

const db = new Database();

export default class RegisterProduct extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      idfileformat: '',
      name: '',
      code: '',
      measures: ''      
    };      
    
  }

  componentDidMount() {    
  }
  
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveProduct() {
    this.setState({
      isLoading: true,      
    });    
    let data = {      
      name: this.state.name,
      code: this.state.code,
      measures: this.state.measures      
    }
    db.addProduct(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Produtos",
        "O Cadastro foi salvo com sucesso!",
        [
          {
            text: "OK", 
            icon: "done",
            onPress: () => this.props.navigation.goBack(),            
          }
        ],
        { cancelable: false }
      );      
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
                placeholder="Código"
                style={styles.textInput}
                value={this.state.code}
                onChangeText={(text) => this.updateTextInput(text, 'code')}                
              />
              <TextInput
                placeholder="Medidas"
                keyboardType="numbers-and-punctuation"
                style={styles.textInput}
                value={this.state.measures}
                onChangeText={(text) => this.updateTextInput(text, 'measures')}                
              />               
              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Cadastrar"
                buttonStyle={styles.button}                
                onPress={() => this.saveProduct()}
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