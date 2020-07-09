import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import DatabaseFileFormat from '../database/FileFormat';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const db = new DatabaseFileFormat();

export default class SellingWays extends Component {

  constructor() {
    super();
    this.state = {
      isLoading: true,
      fileFormat: {},
      id: '',      
    };      
  }
  

 componentDidMount() {
      
    let fileFormat = {};     
    const { id } = this.props.route.params;    
    db.findFileFormatById(id).then((data) => {      
      fileFormat = data;
      this.setState({
        fileFormat,
        isLoading: false,
        id: fileFormat._id
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
            <Text>Formato de Arquivo: {this.state.fileFormat.name}</Text>
          </View>    
          <Button
            buttonStyle={styles.button}
            icon={{name: 'edit', color: '#FFF'}}
            title='Editar'
            onPress={() => db.editFileFormat(this.state.id) } />

          <Button
            buttonStyle={{ backgroundColor: '#FF0000', padding: 10, marginTop: 16, marginLeft: 35, marginRight: 35 }}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => db.deleteFileFormatById(this.state.id)} />      
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
  activity: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
});