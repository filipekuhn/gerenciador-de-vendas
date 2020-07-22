import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, StyleSheet, Text } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { TextInput, TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../stylesheet/stylesheet';
import Database from '../database/Product';

const db = new Database();

export default class EditProduct extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      idproduct: '',
      name: '',
      code: '',
      measures: '',      
      product: {},
      isLoading: false      
    };      
    
  }

  componentDidMount() {   
    this.getProduct(); 
  }

  getProduct() {
    let product = {};
    const { id } = this.props.route.params;

    db.findProductById(id).then((data) => {      
      product = data;
      this.setState({
        product,        
        isLoading: false,
        idproduct: product._id,        
        name: product.name,
        code: product.code,
        measures: product.measures
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

  saveProduct() {
    this.setState({
      isLoading: true,      
    });    
    let data = {            
      name: this.state.name,
      code: this.state.code,
      measures: this.state.measures,
      _id: this.state.idproduct     
    }
    db.editProduct(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      if(result) {
        Alert.alert(
          "Alteração de Produto",
          "A alteração foi salva com sucesso!",
          [
            {
              text: "OK", 
              onPress: () => this.props.navigation.navigate('Products', {
                update: true
              }), 
              icon: "done"
            }
          ],
          { cancelable: false }
        );      
      } else {
        Alert.alert(
          "Alteração de Produto",
          "A alteração não pode ser salva, ocorreu um erro ao tentar atualizar o produto!",
          [
            {
              text: "OK", 
              icon: "done"
            }
          ],
          { cancelable: false }
        );      
      }
      
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
                style={styles.textInput}
                value={this.state.measures}
                onChangeText={(text) => this.updateTextInput(text, 'measures')}                
              />                         
              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Salvar"
                buttonStyle={styles.button}
                onPress={() => this.saveProduct()}
              />  
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}