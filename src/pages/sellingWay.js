import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import Database from '../database/Database';
import databaseSellingWay from '../database/SellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

//const db = new Database();
const db = new databaseSellingWay();


export default class SellingWays extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      sellingWay: {},
      id: '',      
    };  
    //console.log(route.params.id);
    //const idParam = route.params.id;
    //this.findCustomerData(idParam);    
  }
  

 componentDidMount() {
      
    let sellingWay = {};     
    const { id } = this.props.route.params;    
    db.findSellingWayById(id).then((data) => {      
      sellingWay = data;
      this.setState({
        sellingWay,
        isLoading: false,
        id: sellingWay._id
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
        <View>
          <Text>Carregando</Text>
        </View>
      )
    }
    return (
      <ScrollView>
        <Card>          
          <View>  
            <Text>Forma de Venda: {this.state.sellingWay.name}</Text>
          </View>    
          <Button
            buttonStyle={styles.button}
            icon={{name: 'edit', color: '#FFF'}}
            title='Editar'
            onPress={() => db.editSellingWayById(this.state.id)} />

          <Button
            buttonStyle={{ backgroundColor: '#FF0000', padding: 10, marginTop: 16, marginLeft: 35, marginRight: 35 }}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => db.deleteSellingWayById(this.state.id)} />      
        </Card>


      </ScrollView>
    )
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
});