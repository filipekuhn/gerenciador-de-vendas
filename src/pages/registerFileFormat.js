import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../stylesheet/stylesheet';
import FileFormatDatabase from '../database/FileFormat';

const db = new FileFormatDatabase();

export default class RegisterFileFormat extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      idfileformat: '',
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

  saveFileFormat() {
    this.setState({
      isLoading: true,      
    });    
    let data = {      
      name: this.state.name      
    }
    db.addFileFormat(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Formato de Arquivo",
        "O Cadastro foi salvo com sucesso!",
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.navigate('FileFormats', {
              update: true
            }), 
            icon: "done"
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
              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Cadastrar"
                buttonStyle={styles.button}
                //customClick={this.register_customer.bind(this)}
                //onPress={() => this.saveSellingWay()}
                onPress={() => this.saveFileFormat()}
              />  
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}