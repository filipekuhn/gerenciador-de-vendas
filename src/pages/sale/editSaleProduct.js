import React, { Component } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import { Picker } from '@react-native-community/picker'
import { Button } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import styles from '../../stylesheet/stylesheet';
import ProductSale from '../../database/ProductSale';
import Product from '../../database/Product';
import SellingWay from '../../database/SellingWay'

const ProductSaleDB = new ProductSale();
const ProductDB = new Product();
const SellingWayDB = new SellingWay();

export default class EditProductSale extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      idProductSale: '',
      idSellingWay: '',      
      idProduct: '',
      idsale: '',
      product: {},
      sellingWay: {},
      salePrice: '',
      siteCommission: '',
      netPrice: '',
      originalSalePrice: '',
      originalSiteCommission: '',
      originalNetPrice: '',
      productSellingWayName: ''
    }
  }

  componentDidMount() {    
    this.setState({ 
      idsale: this.props.route.params.idSale,
      idProductSale: this.props.route.params.id,
      idSellingWay: this.props.route.params.idSellingWay,
      idProduct: this.props.route.params.idProduct,
      productSellingWayName: this.props.route.params.productSellingWayName
    });
    console.log("AQUIII ", this.props.route.params.idProduct);
    console.log("AQUIII ", this.state.idProduct);
    this.getProductSale();
  }

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  getProductSale() {
    let product = {};
    ProductDB.findProductById(this.props.route.params.idProduct).then((data) => {
      product = data;
      this.setState({
        product        
      });
      let sellingWay = {};
      SellingWayDB.findSellingWayById(this.props.route.params.idSellingWay).then((data) => {
        sellingWay = data;
        this.setState({
          sellingWay          
        })
      })        
      let productValues = {};      
      ProductSaleDB.findProductSale(this.props.route.params.id).then((data) => {
      productValues = data;
      let originalSiteCommission = parseFloat(productValues.productprice).toFixed(2) - parseFloat(productValues.netprice).toFixed(2)      
      this.setState({
        product: productValues,
        originalSalePrice: productValues.productprice,
        originalSiteCommission: originalSiteCommission,
        originalNetPrice: productValues.netprice,
        salePrice: productValues.productprice,
        siteCommission: originalSiteCommission,
        netPrice: productValues.netprice,
        isLoading: false        
        });
      });            
    }).catch((err) => {
      console.log(err);
    });    
  }

  saveSaleProduct() {
    this.setState({
      isLoading: true,      
    });    

    let salePriceValue = this.state.salePrice;
    salePriceValue = String(salePriceValue).replace("R$ ", "").replace(",", ".");
    salePriceValue = parseFloat(salePriceValue).toFixed(2);
    let siteCommissionValue = this.state.siteCommission;
    siteCommissionValue = String(siteCommissionValue).replace("R$ ", "").replace(",", ".");        
    siteCommissionValue = parseFloat(siteCommissionValue).toFixed(2);

    let netPriceValue = parseFloat(salePriceValue) - parseFloat(siteCommissionValue);
    netPriceValue = netPriceValue.toFixed(2);

    let data = {   
      id: this.props.route.params.id,       
      productPrice: salePriceValue,      
      netPrice: netPriceValue
    }
    console.log("AQUI O DATA DO PRODUCT SALE", data);
    ProductSaleDB.editProductSale(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Alteração de Produto",
        "O produto foi alterado com sucesso!",
        [
          {
            text: "OK",             
            onPress: () => this.props.navigation.navigate('RegisterSale', {
              id: `${this.state.idsale}`,  
              originalSalePrice: `${this.state.originalSalePrice}`,
              originalNetPrice: `${this.state.originalNetPrice}`,
              productPrice: `${salePriceValue}`,
              netPrice: `${netPriceValue}`,                          
              edit: true,
              update: false
            })
          }
        ],
        { cancelable: false }
      );      
    }).catch((err) => {
      console.log(err);
      this.setState({
        isLoading: false,
      });
    });
  }  

  render() {
    return(
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            behavior="padding"
            style={{ flex: 1, justifyContent: 'space-between' }}>
              
              <Text style={{ textAlign: "center", fontSize: 24, fontWeight: "bold", marginTop: 20, marginBottom: 10 }}>
                {this.props.route.params.productSellingWayName}
              </Text>            
              <Text style={{  marginLeft: 20 }}>Valor de Venda</Text>
              <TextInputMask       
                placeholder="R$ 0,00"         
                style={styles.textInput}
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}                
                value={this.state.salePrice}
                onChangeText={(text) => this.updateTextInput(text, 'salePrice')}                  
                ref={(ref) => this.salePriceField = ref}              
              />
              <Text style={{  marginLeft: 20 }}>Valor de Comissão do Site</Text>
              <TextInputMask                   
                placeholder="R$ 0,00"                             
                style={styles.textInput}
                type={'money'}
                options={{
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
                }}                
                value={this.state.siteCommission}
                onChangeText={(text) => this.updateTextInput(text, 'siteCommission')}                
                ref={(ref) => this.comissionField = ref}
              /> 
              <View style={{ marginLeft: 20}}>
                <Button
                  icon={{ name: 'save', color: '#FFF' }}                
                  title="Salvar"
                  buttonStyle={styles.button}                               
                  onPress={() => this.saveSaleProduct()}                
                /> 
              </View> 
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }  
}