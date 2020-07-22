import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { Card, Button } from 'react-native-elements';
import Database from '../database/Product';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../stylesheet/stylesheet';

const db = new Database();

export default class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      product: {},
      id: '',      
    };      
  }
  

 componentDidMount() {
      
    let product = {};     
    const { id } = this.props.route.params;    
    db.findProductById(id).then((data) => {      
      product = data;
      this.setState({
        product,
        isLoading: false,
        id: product._id
      });            
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })  
  }

  render() {    
    if(this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    return (
      <ScrollView>
        <Card>          
          <View>  
            <Text>Produto: {this.state.product.name}</Text>
          </View>
          <View>  
            <Text>Código: {this.state.product.code}</Text>
          </View>    
          <View>  
            <Text>Medidas: {this.state.product.measures}</Text>
          </View>          

          <Button
            buttonStyle={styles.button}
            icon={{name: 'edit', color: '#FFF'}}
            title='Editar'
            onPress={() => this.props.navigation.navigate('EditProduct', {
              id: `${this.state.id}`
            }) } />

          <Button
            buttonStyle={styles.deleteButton}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => Alert.alert(
              "Exclusão de Usuário",
              `Você tem certeza que deseja excluir o produto ${this.state.product.name}?`,
              [
                {
                  text: "Sim", 
                  onPress: () => db.deleteProductById(this.state.id).then(() => this.props.navigation.navigate('Products', {
                    update: true
                  })), 
                  icon: "done"
                },
                {
                  text: "Cancelar",                   
                }
              ],
              { cancelable: true }
            )}
            />      
        </Card>


      </ScrollView>
    )
  } 
}