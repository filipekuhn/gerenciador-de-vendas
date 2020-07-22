import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';
import { Picker } from '@react-native-community/picker';
import Database from '../../database/City';

const db = new Database();

export default class RegisterCity extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      id: '',
      name: '',
      uf: ''      
    };          
  }
  
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveCity() {
    this.setState({
      isLoading: true,      
    });    
    let data = {      
      name: this.state.name,      
      uf: this.state.uf
    }
    if(this.state.uf != '') {
      db.addCity(data).then((result) => {
        console.log(result);
        this.setState({
          isLoading: false,
        });
        Alert.alert(
          "Cadastro de Cidade",
          "O Cadastro foi salvo com sucesso!",
          [
            {
              text: "OK", 
              onPress: () => this.props.navigation.navigate('Cities', {
                update: true
              }),             
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
    } else {
      Alert.alert(
        "Cadastro de Cidade",
        "Por favor selecione um estado para a cidade!",
        [
          {
            text: "OK"
          }
        ],
        { cancelable: true }
      )
    }
    
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
              <Text style={{ marginLeft: 30 }}>
                Selecione o Estado
              </Text>
              <Picker                                
                selectedValue={this.state.uf}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ uf: itemValue })
                }>                
                <Picker.Item label="AC" value="AC" />
                <Picker.Item label="AL" value="AL" />
                <Picker.Item label="AP" value="AP" />
                <Picker.Item label="AM" value="AM" />
                <Picker.Item label="BA" value="BA" />
                <Picker.Item label="CE" value="CE" />
                <Picker.Item label="DF" value="DF" />
                <Picker.Item label="ES" value="ES" />
                <Picker.Item label="GO" value="GO" />
                <Picker.Item label="MA" value="MT" />
                <Picker.Item label="MS" value="MS" />
                <Picker.Item label="MG" value="MG" />
                <Picker.Item label="PA" value="PA" />
                <Picker.Item label="PB" value="PB" />
                <Picker.Item label="PR" value="PR" />
                <Picker.Item label="PE" value="PE" />
                <Picker.Item label="PI" value="PI" />
                <Picker.Item label="RJ" value="RJ" />
                <Picker.Item label="RN" value="RN" />
                <Picker.Item label="RS" value="RS" />
                <Picker.Item label="RO" value="RO" />
                <Picker.Item label="RR" value="RR" />
                <Picker.Item label="SC" value="SC" />
                <Picker.Item label="SP" value="SP" />
                <Picker.Item label="SE" value="SE" />
                <Picker.Item label="TO" value="TO" />
              </Picker> 

              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Cadastrar"
                buttonStyle={styles.button}
                onPress={() => this.saveCity()}
              />  
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}