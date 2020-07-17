import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text } from 'react-native';
import { ListItem, Button } from 'react-native-elements';
import databaseFileFormats from '../database/FileFormat';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../stylesheet/stylesheet';

const db = new databaseFileFormats();
export default class FileFormats extends Component {  
  
  constructor(props) {
    super(props);
    this.state = {
      fileFormats: [],
      isLoading: true,
      notFound: 'Please click (+) button to add it.'      
    };    
  }

  componentDidMount() {
    /*this._subscribe = this.props.navigation.addListener('didFocus', () => {
      this.getSellingWays();
    });*/
    this.getFileFormats();      
  }

  getFileFormats() {
    let fileFormats = [];
    db.listFileFormat().then((data) => {
      fileFormats = data;
      this.setState({
        fileFormats,
        isLoading: false,
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}      
      leftAvatar={{
        //source: item.prodImage && { uri: item.prodImage },
        source: require('../images/fileformat.png'),
        title: item.name[0],                
      }}
      onPress={() => {
        this.props.navigation.navigate('FileFormat', {
          id: `${item._id}`                   
        });
      }}
      chevron
      bottomDivider
    />
    
  )

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.state.fileFormats.length === 0){
      return(
        <View>
          <Text style={styles.message}>{this.state.notFound}</Text>          
          <Button
            buttonStyle={styles.button}
            icon={{ name: 'add-circle-outline', color: '#FFF' }}
            title="Adicionar Formatos de Arquivos"
            onPress={ () => this.props.navigation.navigate('RegisterFileFormat')} />
        </View>                  
      )
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.fileFormats}
        renderItem={this.renderItem}
      />
        <Button
          buttonStyle={styles.button}
          title="Cadastrar Formatos"
          icon={{ name: 'add-circle-outline', color: '#FFF' }}
          onPress={ () => this.props.navigation.navigate('RegisterFileFormat')} />
      </SafeAreaView>
      
      
    );
  }
}