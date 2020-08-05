import React, { Component } from 'react';
import { FlatList, ActivityIndicator, View, Text , Image, TouchableOpacity} from 'react-native';
import { ListItem, Button, SearchBar } from 'react-native-elements';
import databaseFileFormats from '../../database/FileFormat';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../stylesheet/stylesheet';

const db = new databaseFileFormats();
export default class FileFormats extends Component {  
  
  constructor(props) {
    super(props);
    this.state = {
      fileFormats: [],
      isLoading: true,
      searc: '',
      notFound: 'Nenhum Formato de Arquivo foi encontrado'      
    };    
    this.arrayholder = [];
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
      },    
        function() {
          this.arrayholder = fileFormats;
        }      
      );
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getFileFormats() });
 }

  searchFilter(text) {
    const newData = this.arrayholder.filter(function(item) {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();      
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      fileFormats: newData,
      search: text
    });
  }


  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}      
      leftAvatar={{
        rounded: false,        
        size: "large",
        icon: { name: 'description', color: 'black'}              
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
        <SafeAreaView style ={{ flex: 1 }}>
          <SearchBar
            containerStyle={{ backgroundColor: '#5390fe', 
              borderBottomColor: '#5390fe', 
              borderTopColor: '#5390fe',                                    
            }}
            inputContainerStyle={{ backgroundColor: '#FFF', marginLeft: 20, marginRight: 20, borderRadius: 30 }}          
            placeholder="Buscar..."
            onChangeText={(text) => this.searchFilter(text)}
            value={this.state.search}                    
          />
          <View>
          <Text style={{ textAlign: 'center', marginTop: 20, fontWeight: 'bold' }}>{this.state.notFound}</Text>
          </View>
          <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterFileFormat')}
          title="+"
          style={styles.touchableOpacityStyle}>
            <Image
              source={require('../../images/add2.png')}
              style={styles.floatingButtonStyle}
              />
          </TouchableOpacity>
        </SafeAreaView>
      )
    }
    if(this.props.route.params.update){
      this.props.route.params.update = false;
      this.getFileFormats();
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <SearchBar
          containerStyle={{ backgroundColor: '#5390fe', 
            borderBottomColor: '#5390fe', 
            borderTopColor: '#5390fe',                                    
          }}
          inputContainerStyle={{ backgroundColor: '#FFF', marginLeft: 20, marginRight: 20, borderRadius: 30 }}          
          placeholder="Buscar..."
          onChangeText={(text) => this.searchFilter(text)}
          value={this.state.search}                    
        />
        <FlatList
        keyExtractor={this.keyExtractor}
        data={this.state.fileFormats}
        refreshing={this.state.isLoading}
        onRefresh={() => this.onRefresh()}
        renderItem={this.renderItem}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => this.props.navigation.navigate('RegisterFileFormat')}
          title="+"
          style={styles.touchableOpacityStyle}>
            <Image
              source={require('../../images/add2.png')}
              style={styles.floatingButtonStyle}
              />
        </TouchableOpacity>
      </SafeAreaView>
      
      
    );
  }
}