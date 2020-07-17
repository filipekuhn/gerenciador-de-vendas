import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import Database from '../database/Database';
import databaseSellingWay from '../database/SellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../stylesheet/stylesheet';

const db = new databaseSellingWay();
export default class SellingWays extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      sellingWay: {},
      id: '',      
    };      
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
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
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
            buttonStyle={styles.deleteButton}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => db.deleteSellingWayById(this.state.id)} />      
        </Card>


      </ScrollView>
    )
  } 
}