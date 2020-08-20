import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Alert, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { TextInputMask } from 'react-native-masked-text';
import styles from '../../stylesheet/stylesheet';
import ProductSellingWay from '../../database/ProductSellingWay';
import moment from 'moment';

const db = new ProductSellingWay();

export default class RegisterProductSellingWay extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      isLoading: true,      
      productSellingWay: {},
      idProductSellingWay: '',  
      sellingWay: '',    
      siteInclusionDate: '',
      salePrice: '',
      siteCommission: '',
      netPrice: '',      
    };      
    
  }

  componentDidMount() {     
    this.getProductSellingWay();
  }
  
  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  getProductSellingWay() {
    let idProductSellingWay = this.props.route.params.id
    let productSellingWay = {};    
    console.log("ID ", idProductSellingWay);
    db.findProductSellingWay(idProductSellingWay).then((data) => {
      productSellingWay = data;
      this.setState({
        productSellingWay,
        siteInclusionDate: productSellingWay.siteinclusiondate,
        salePrice: productSellingWay.saleprice,
        siteCommission: productSellingWay.sitecommission,
        netPrice: productSellingWay.netprice,
        idProductSellingWay: idProductSellingWay,
        isLoading: false        
      });
    });
  }

  saveProductSellingWay() {    
    this.setState({
      isLoading: true,      
    });    
    if(this.siteInclusionDateField.isValid()){

    } else {
      Alert.alert(
        "Cadastro de Valores de Produto",
        "A data inserida como data de cadastro no site é inválida!",
        [
          {
            text: "OK"
          }
        ],
        { cancelable: true }
      )
    }

    let salePrice = this.state.salePrice;
    salePrice = String(salePrice).replace("R$ ", "").replace(",", ".");
    salePrice = parseFloat(salePrice).toFixed(2);
    let siteCommission = this.state.siteCommission;
    siteCommission = String(siteCommission).replace("R$ ", "").replace(",", ".");    
    siteCommission = parseFloat(siteCommission).toFixed(2);

    let netPriceValue = salePrice - siteCommission;
    netPriceValue = netPriceValue.toFixed(2);
    let data = {      
      id: this.state.idProductSellingWay,
      siteInclusionDate: this.state.siteInclusionDate,
      salePrice: salePrice,
      siteCommission: siteCommission,
      netPrice: netPriceValue
    }
    db.editProductSellingWay(data).then((result) => {
      console.log(result);
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        "Cadastro de Valores do Produto",
        "O Cadastro foi salvo com sucesso!",
        [
          {
            text: "OK", 
            icon: "done",
            onPress: () => this.props.navigation.navigate('Product', {
              id: this.props.route.params.idProduct,
              update: true
            }),            
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
              
              <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold", fontSize: 24, textAlign: "center" }}>
                {this.props.route.params.sellingWay}
              </Text>              
              <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Data de inclusão no Site</Text>
              <TextInputMask
                placeholder={moment(new Date()).format("DD/MM/YYYY")}
                style={styles.textInput}
                type={'datetime'}
                options={{
                  format: 'DD/MM/YYYY'
                }}
                value={this.state.siteInclusionDate}
                onChangeText={(text) => this.updateTextInput(text, 'siteInclusionDate')}  
                ref={(ref) => this.siteInclusionDateField = ref}              
              />       
              <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Valor de Venda</Text>
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
              <Text style={{ marginLeft: 20, marginTop: 10, fontWeight: "bold" }}>Valor de Comissão do Site</Text>
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
              <Button
                icon={{name: 'save', color: '#FFF'}}                
                title="Cadastrar"
                buttonStyle={styles.button}                
                onPress={() => this.saveProductSellingWay()}                
              />              
            </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}