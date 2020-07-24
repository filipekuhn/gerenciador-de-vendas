import React, { Component } from 'react';
import { ActivityIndicator, View, Text, Alert } from 'react-native';
import { Card, Button, ListItem } from 'react-native-elements';
import Database from '../../database/Product';
import ProductSellingWay from '../../database/ProductSellingWay';
import { ScrollView } from 'react-native-gesture-handler';
import styles from '../../stylesheet/stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';

const db = new Database();
const dbProductSellingWay = new ProductSellingWay();

export default class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      product: {},
      id: '',  
      productSellingWays: []    
    };      
  }
  

 componentDidMount() {
      this.getProduct();
  }

  getProduct() {
    let product = {};     
    let productSellingWays = [];
    const { id } = this.props.route.params;    
    db.findProductById(id).then((data) => {      
      product = data;      
      this.setState({
        product,        
        id: product._id
      });            
      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });
    dbProductSellingWay.listProductSellingWay(id).then((data) => {
      productSellingWays = data;    
      this.setState({
        productSellingWays,
        isLoading: false
      });
      console.log("AQUI ", productSellingWays);
    });  
  }

  render() {    
    if(this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    if(this.props.route.params.update){
      this.props.route.params.update = false;
      this.getProduct();
    }
    return (
      <ScrollView>              
        <Card>          
          <View style={{ flexDirection: "row" }}>  
            <Text style={{ fontWeight: "bold" }}>Produto: </Text>
            <Text>{this.state.product.name}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>  
            <Text style={{ fontWeight: "bold" }}>Código: </Text>
            <Text>{this.state.product.code}</Text>
          </View>    
          <View style={{ flexDirection: "row" }}>  
            <Text style={{ fontWeight: "bold" }}>Medidas: </Text>
            <Text>{this.state.product.measures}</Text>
          </View>  
        </Card>
        <View style={{ flexDirection: "row", marginHorizontal: 30 }}>
          <View style={{ width: 150 }}>
            <Button
              buttonStyle={styles.editRowButton}
              icon={{name: 'edit', color: '#FFF'}}
              title='Editar'
              onPress={() => this.props.navigation.navigate('EditProduct', {
                id: `${this.state.id}`
              }) } />
          </View>
          <View style={{ width: 150 }}>
            <Button
              buttonStyle={styles.deleteRowButton}
              icon={{name: 'delete', color: '#FFF'}}
              title='Deletar'
              onPress={() => Alert.alert(
                "Exclusão de Produto",
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
          </View>
        </View>
        <Card>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 5 }}>
              Valores do Produto
            </Text>
          </View>
          <View>
            {
              this.state.productSellingWays?.map((l, i) => (
                <ListItem                  
                  key={i}
                  title={l.sellingWay.name}
                  titleStyle={{ fontWeight: "bold", fontSize: 18 }}
                  subtitle={"Valor de Venda: " + l.saleprice + "\nComissão do Site: " + l.sitecommission + "\nValor Líquido: " + l.netprice}                  
                  onPress={() => this.props.navigation.navigate('EditProductSellingWay', {
                    id: `${l._id}`
                  })}                  
                  bottomDivider 
                  chevron                 
                />
              ))
            }
          </View>        
        </Card>    
   
        <Button
          icon={{name: 'add-circle-outline', color: '#FFF'}}                
          title="Incluir Valores"
          buttonStyle={styles.button}
          onPress={() => this.props.navigation.navigate('RegisterProductSellingWay', {
            id: `${this.state.id}`,
            name: `${this.state.product.name}`
          })}
        />        
      </ScrollView>
    )
  } 
}