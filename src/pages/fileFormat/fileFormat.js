import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text } from 'react-native';
import { Card, Button, Icon } from 'react-native-elements';
import DatabaseFileFormat from '../../database/FileFormat';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';

const db = new DatabaseFileFormat();

export default class FileFormat extends Component {

  constructor(props) {
    super(props);
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
            onPress={() => this.props.navigation.navigate('EditFileFormat', {
              id: `${this.state.id}`
            }) } />

          <Button
            buttonStyle={styles.deleteButton}
            icon={{name: 'delete', color: '#FFF'}}
            title='Deletar'
            onPress={() => db.deleteFileFormatById(this.state.id)} />      
        </Card>


      </ScrollView>
    )
  } 
}