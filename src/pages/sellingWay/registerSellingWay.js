import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';

import SellingWayDatabase from '../../database/SellingWay';

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
            onPress: () => this.props.navigation.navigate('SellingWays', {
              update: true
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