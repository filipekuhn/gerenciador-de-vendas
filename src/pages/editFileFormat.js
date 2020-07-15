import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';

import FileFormatDatabase from '../database/FileFormat';

const db = new FileFormatDatabase();

export default class EditFileFormat extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      idfileformat: '',
      name: '',
      fileFormat: {},
      isLoading: ''      
    };      
    
  }

  componentDidMount() {   
    this.getFileFormat(); 
  }

  getFileFormat() {
    let fileFormat = {};
    const { id } = this.props.route.params;

    db.findFileFormatById(id).then((data) => {      
      fileFormat = data;
      this.setState({
        fileFormat,        
        isLoading: false,
        idfileformat: fileFormat._id,
        name: fileFormat.name
      })
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

  saveFileFormat() {
    this.setState({
      isLoading: true,      
    });    
    let data = {      
      name: this.state.name ,
      _id: this.state.idfileformat     
    }
    db.editFileFormat(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Alteração de Formato de Arquivo",
        "A alteração foi salva com sucesso!",
        [
          {
            text: "OK", 
            onPress: () => this.props.navigation.navigate('FileFormats'), 
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
                title="Salvar"
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