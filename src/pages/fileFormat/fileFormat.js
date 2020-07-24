import React, { Component } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, View, Text, Alert } from 'react-native';
import { Card, Button } from 'react-native-elements';
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
          <View style={{ flexDirection: "row" }}>  
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>Formato de Arquivo: </Text>
            <Text style={{ fontSize: 16 }}>{this.state.fileFormat.name}</Text>
          </View>       
          <View style={{ flexDirection: "row" }}>
          <View style={{ width: 150 }}>
            <Button
              buttonStyle={styles.editRowButton}
              icon={{name: 'edit', color: '#FFF'}}
              title='Editar'
              onPress={() => this.props.navigation.navigate('EditFileFormat', {
                id: `${this.state.id}`
              }) } />
          </View>
          <View style={{ width: 150 }}>
            <Button
              buttonStyle={styles.deleteRowButton}
              icon={{name: 'delete', color: '#FFF'}}
              title='Deletar'
              onPress={() => Alert.alert(
                "Exclusão de Formato de Arquivo",
                `Você tem certeza que deseja excluir o formato ${this.state.fileFormat.name}?`,
                [
                  {
                    text: "Sim", 
                    onPress: () => db.deleteFileFormatById(this.state.id).then(() => this.props.navigation.navigate('FileFormats', {
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
          </View>
        </View>
        </Card>
      </ScrollView>
    )
  } 
}