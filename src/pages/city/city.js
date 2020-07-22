import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import Database from '../../database/City';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';
 
const db = new Database();

export default class City extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      city: {},
      id: '',      
    };      
  }
  
 componentDidMount() {
      this.getCity();
  }

  getCity() {
    let city = {};     
    const { id } = this.props.route.params;    
    db.findCityById(id).then((data) => {      
      city = data;
      this.setState({
        city,
        isLoading: false,
        id: city._id
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
            <Text>Cidade: {this.state.city.name}</Text>
          </View>
          <View>  
            <Text>UF: {this.state.city.uf}</Text>
          </View>    
          <Button
            buttonStyle={styles.button}
            icon={{name: 'edit', color: '#FFF'}}
            title='Editar'
            onPress={() => this.props.navigation.navigate('EditCity', {
              id: `${this.state.id}`
            }) } />

          <Button
            buttonStyle={styles.deleteButton}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => Alert.alert(
              "Exclusão de Cidade",
              `Você tem certeza que deseja excluir a cidade ${this.state.city.name}?`,
              [
                {
                  text: "Sim", 
                  onPress: () => db.deleteCity(this.state.id).then(() => this.props.navigation.navigate('Cities', {
                    update: true
                  })),                   
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