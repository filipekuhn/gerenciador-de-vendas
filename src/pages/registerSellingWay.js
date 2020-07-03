import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

import SellingWayDatabase from '../database/SellingWay';

const db = new SellingWayDatabase();

export default class RegisterSellingWay extends Component {
  static navigationOptions = {
    title: 'Add Forma de Pagamento'
  };
  constructor() {
    super();    
    this.state = {
      idsellingway: '',
      name: ''      
    };      
    
  }

  componentDidMount() {    
  }
  
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveSellingWay() {
    this.setState({
      isLoading: true,      
    });    
    let data = {      
      name: this.state.name      
    }
    db.addSellingWay(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Forma de Venda",
        "O Cadastro foi salvo com sucesso!",
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.navigate('SellingWays'), 
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
              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Cadastrar"
                buttonStyle={styles.button}
                //customClick={this.register_customer.bind(this)}
                //onPress={() => this.saveSellingWay()}
                onPress={() => this.saveSellingWay()}
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