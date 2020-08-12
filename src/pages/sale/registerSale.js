import React, { Component } from 'react';
import { View, ScrollView ,FlatList, Image, KeyboardAvoidingView, Alert, Text, ActivityIndicator, TouchableOpacity, Keyboard } from 'react-native';
import { Picker } from '@react-native-community/picker'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { Button, ListItem } from 'react-native-elements';
import { TextMask } from 'react-native-masked-text'
import styles from '../../stylesheet/stylesheet';
import moment from 'moment';
import { TextInput } from 'react-native-gesture-handler';
import SaleDb from '../../database/Sale';
import CustomerDb from '../../database/Customer';
import ProductDb from '../../database/Product';
import ProductSaleDb from '../../database/ProductSale';
import SellingWayDb from '../../database/SellingWay';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInputMask } from 'react-native-masked-text';

const Colors = {
  primary: '#078489',
  secondary: '#124b5f',
  tertiary: '#f7f1e3',
}

const Sale = new SaleDb();
const Customer = new CustomerDb();
const Product = new ProductDb();
const ProductSale = new ProductSaleDb();
const SellingWay = new SellingWayDb();


export default class RegisterSale extends Component {

  constructor(props) {
    super(props);    
    this.state = {
      isLoading: true,
      id: '',
      date: '',       
      idcustomer: '', 
      idsellingway: '', 
      observations: '', 
      saleprice: '', 
      finalprice: '', 
      amountpaid: '',
      pendingpayment: '',                  
      selectedCustomer: { id: 0, item: '' },
      selectedSellingWay: { id: 0, item: '' },
      selectedProduct: {},
      productSale: [],
      sellingWays: [],
      customers: [],
      sale: {},
      productQuantity: 0,
      productNotFound: 'Nenhum produto foi adicionado'
    };          
  }

  componentDidMount() {  
    console.log("ID da rota: ", this.props.route.params.id);    
    if(this.props.route.params.id === '') {
      console.log("VENDA NOVA");
      let todayDate = moment(new Date()).format("DD/MM/YYYY");
      this.setState({
        date: todayDate
      });  
      this.getCustomers();
      this.getSellingWays();
    } else {
      console.log("BUSCANDO A VENDA: ", this.state.id);
      this.setState({
        id: this.props.route.params.id
      });
      this.getSale();      
    }        
  }

  componentDidUpdate() {
    if(this.props.route.params.update === true) {
      this.props.route.params.update = false;
      this.getSale()
    }
  }

  getCustomers() {
    let customers = [{ id: 0, item: '' }];
    Customer.listCustomerItems().then((data) => {
      Array.prototype.push.apply(customers, data)      
      this.setState({
        customers,           
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getSellingWays() {
    
    let sellingWays = [{ id: 0, item: '' }];
    SellingWay.listSellingWaysItems().then((data) => {            
      Array.prototype.push.apply(sellingWays, data);
      console.log("ConcatENOU: ", sellingWays);
      this.setState({
        sellingWays,                       
        isLoading: false,
      });      
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    })
  }

  getProductSale() {
    let productSale = [];
    ProductSale.listProductSale(this.state.id).then((data) => {
      productSale = data;
      this.setState({
        productSale,                        
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });
  }

  getSale() {    
    Sale.findSaleById(this.props.route.params.id).then((data) => {   
      let sale = data;   
      this.setState({
        date: sale.date,       
        idcustomer: sale.idcustomer, 
        idsellingway: sale.idsellingway, 
        observations: sale.observations, 
        saleprice: sale.saleprice, 
        finalprice: sale.finalprice, 
        amountpaid: sale.amountpaid,
        pendingpayment: sale.pendingpayment,         
      });  
      this.getCustomer();  
      this.getSellingWay();
      this.getProductSales();  
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });

  }
  
  getCustomer() {
    Customer.findCustomerById(this.state.idcustomer).then((data) => {       
      let customer = data;     
      this.setState({
        selectedCustomer: [{
          id: customer._id,
          item: customer.name
        }],
        customers: [{
          id: customer._id,
          item: customer.name
        }]
      });
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });    
  }    

  getSellingWay() {
    SellingWay.findSellingWayById(this.state.idsellingway).then((data) => {
      let sellingWay = data;
      this.setState({
        selectedSellingWay: [{
          id: sellingWay._id,
          item: sellingWay.name,          
        }],
        sellingWays: [{
          id: sellingWay._id,
          item: sellingWay.name,          
        }]
      })
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });
  }
   
  getProductSales() {
    ProductSale.listProductSale(this.state.id).then((data) => {
      let productSale = data;
      this.setState({
        productSale,
        isLoading: false
      })
    }).catch((err) => {
      console.log(err);
      this.setState = {
        isLoading: false
      }
    });   
  }
 
  

  updateTextInput = (text, field) => {
    const state = this.state
    state[field] = text;
    this.setState(state);
  }

  saveSale() {      
    this.setState({
      isLoading: true,      
    });          
    
    let pending = true;
    let pendigPaymentValue = this.amountPaidField.getRawValue() - this.salePriceField.getRawValue()
    pendigPaymentValue = pendigPaymentValue.toFixed(2)

    if( pendigPaymentValue >= 0) {
      pending = false
    }
    
    let finalPrice = this.finalPriceField.getRawValue();
    let salePrice = this.salePriceField.getRawValue();
    let amountPaid = this.amountPaidField.getRawValue();
    let idCustomer = null;
    let idSellingway = null;
    let date = null ;

    if(!this.state.saleprice > 0) {
      salePrice = null;
    }

    if(!this.state.finalprice > 0) {
      finalPrice = null;
    }
    
    if(!this.state.amountpaid > 0) {
      amountPaid = null;
    }

    if(this.state.date !== '') {
      date = this.state.date;
    }

    if(this.state.selectedCustomer[0].id > 0 ) {
      idCustomer = this.state.selectedCustomer[0].id;
    }

    if(this.state.selectedSellingWay[0].id > 0) {
      idSellingway = this.state.selectedSellingWay[0].id;
    }
    
    if(!this.dateField.isValid()){    
      Alert.alert(
        "ERRO",
        "A data inserida como data de venda é inválida!",
        [
          {
            text: "OK"
          }
        ],
        { cancelable: true }
      )
      return false
    }
    console.log("CHEGOU ANTES DO MÉTODO DE INSERIR A VENDA!", + this.state.date, + "date: " + date);
      let data = { 
      id: this.state.id,           
      date: date,       
      idcustomer: idCustomer, 
      idsellingway: idSellingway, 
      observations: this.state.observations, 
      saleprice: salePrice, 
      finalprice: finalPrice, 
      amountpaid: amountPaid,
      pendingpayment: pending
    }    
    console.log("ESSA É O OBJETO DATA: ", data);
    if(this.state.id === '') {      
      Sale.addSale(data).then((result) => {      
        this.setState({
          isLoading: false,
        });
        
        console.log("Resposta do método de inserir");
        if(result.insertId > 0) {          
          this.setState({ id: result.insertId });     
          Alert.alert(
            "Cadastro de Venda",
            "O Cadastro foi salvo com sucesso!",
            [
              {
                text: "OK",                          
              }
            ],
            { cancelable: true }
          );
        }      
      }).catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
        Alert.alert(
          "Cadastro de Venda",
          "Não foi possível realizar o cadastro!\nVerifique se todos os campos foram preenchidos e se a data é válida!",
          [
            {
              text: "OK", 
              onPress: () => this.props.navigation.navigate('RegisterSale'),               
            }
          ],
          { cancelable: false }
        );
      });
    } else {      
      Sale.editSale(data).then((result) => {      
        this.setState({
          isLoading: false,
        });
        if(true) {                  
          Alert.alert(
            "Cadastro de Venda",
            "As alterações foram salvas com sucesso!",
            [
              {
                text: "OK",
                onPress: () => this.props.navigation.navigate('Sales', {
                  update: true
                })                          
              }
            ],
            { cancelable: true }
          );
        }      
      }).catch((err) => {
        console.log(err);
        this.setState({
          isLoading: false,
        });
        Alert.alert(
          "Cadastro de Venda",
          "Não foi possível realizar as alterações!\nVerifique se todos os campos foram preenchidos e se a data é válida!",
          [
            {
              text: "OK"                
            }
          ],
          { cancelable: false }
        );
      });
    }
    
  }

  onRefresh() {
    this.setState({ isLoading: true }, function() { this.getSale() });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <View style={{ marginLeft: 10, marginRight: 10 }}>
      <ListItem                        
        title={item.product.name}
        titleStyle={{ fontWeight: "bold", fontSize: 18 }}                                     
        subtitle={
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}>Valor de Venda: </Text>
              <TextMask
              value={item.productprice}
              type={'money'}
              options={{
                  obfuscated: true,
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
              }}
              />
            </View>
            <View style={{ flexDirection: 'row'}}>
              <Text style={{ fontWeight: 'bold'}}>Valor Líquido: </Text>
              <TextMask
              value={item.netprice}
              type={'money'}
              options={{
                  obfuscated: true,
                  precision: 2,
                  separator: ',',
                  delimiter: '.',
                  unit: 'R$ ',
                  suffixUnit: ''
              }}
              />
            </View>
          </View>
        }
        rightAvatar={{
          icon: { name: 'delete', color: 'red'}                     
        }}
        onPress={() => this.props.navigation.navigate('EditProductSale', {
          id: `${item._id}`
        })}                  
        onLongPress={() => Alert.alert(
          "Exclusão Produto",
          `Você tem certeza que deseja excluir dessa venda o Produto ${item.sellingWay.name}?`,
          [
            {
              text: "Sim", 
              onPress: () => ProductSale.deleteProductSale(`${item._id}`).then(() => this.onRefresh()),                         
            },
            {
              text: "Cancelar",                   
            }
          ],
          { cancelable: true }
        )}
        delayLongPress={1000}
        bottomDivider                      
      />                    
    </View>
  )

  render() {       
    
    const getHeader = () => {
      return (
        <Vie />
      )              
    };

   const getFooter = () => {
     if(this.state.productSale.length !== 0) {
      return (
        <View style={{ backgroundColor: 'white', flex: 1, marginBottom: 10, marginTop: 10 }}>                        
          <Button              
            icon={{ name: 'add-circle-outline', color: 'white'}}
            title="Adicionar"
            buttonStyle={{ marginLeft: 100, marginRight: 100, marginTop: 10, padding: 10, borderRadius: 80 }}
            onPress={() => this.props.navigation.navigate('RegisterSaleProduct', {
              id: `${this.state.id}`
            })}
          />      
      </View>
       )
     } else {
       return (
         <View />
       )
     }
     
    };

    const emptyList = () => {
      return (
        <View style={{ backgroundColor: 'white', flex: 1, marginBottom: 10, marginTop: 10 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, textAlign: "center"}}>{this.state.productNotFound}</Text>          
          <Button              
            icon={{ name: 'add-circle-outline', color: 'white'}}
            title="Adicionar"
            buttonStyle={{ marginLeft: 100, marginRight: 100, marginTop: 10, padding: 10, borderRadius: 80 }}
            onPress={() => this.props.navigation.navigate('RegisterSaleProduct', {
              id: `${this.state.id}`
            })}
          />      
        </View>
      )
    }

    if(this.state.isLoading){
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff"/>
        </View>
      )
    }
    // if(this.props.route.params.id !== '') {      
    //   this.setState({
    //     id: this.props.route.params.id
    //   });
    //   this.props.route.params.id = '';
    //   this.getSale();
    // }

    return(            
         
        // <KeyboardAwareFlatList                  
        //   style={{ flex: 1, backgroundColor: 'white' }}
        //   keyExtractor={this.keyExtractor}
        //   data={this.state.productSale}        
        //   refreshing={this.state.isLoading}
        //   onRefresh={() => this.onRefresh()}        
        //   renderItem={this.renderItem}
        //   ListHeaderComponent={getHeader}
        //   ListFooterComponent={getFooter} 
        //   ListEmptyComponent={emptyList}  
        //   enableOnAndroid={true}
        //   keyboardShouldPersistTaps="always"
        //   keyboardDismissMode="on-drag"
        // />    
      <ScrollView keyboardShouldPersistTaps="handled">
        <KeyboardAvoidingView
          behavior="padding"
          style={{ flex: 1, justifyContent: 'space-between' }}>
          <View style={{ backgroundColor: 'white', flex: 1 }}>              
          <Text style={{ marginLeft: 20, marginTop: 10 }}>
            Selecione o Cliente
          </Text>
          <Picker                                             
            style={{ width: 250, marginLeft: 15 }}
            selectedValue={this.state.selectedCustomer}                              
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selectedCustomer: itemValue })}>            
            {
              this.state.customers.map((item) => {
                return <Picker.Item label={item.item} value={item.id} key={item.id} />
              })   
            }             
          </Picker>
          <Text style={{ marginLeft: 20, marginTop: 10 }}>
            Selecione o Meio de Venda
          </Text>
          <Picker                                             
            style={{ width: 250, marginLeft: 15 }}
            selectedValue={this.state.selectedSellingWay}                              
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ selectedSellingWay: itemValue })}>            
            {
              this.state.sellingWays.map((item) => {
                return <Picker.Item label={item.item} value={item.id} key={item.id} />
              })   
            }             
          </Picker>
          <Text style={{ marginLeft: 20, marginTop: 10 }}>Data da Venda</Text>
          <TextInputMask
            placeholder={moment(new Date()).format("DD/MM/YYYY")}
            style={styles.textInput}
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            value={this.state.date}
            onChangeText={(text) => this.updateTextInput(text, 'date')}  
            ref={(ref) => this.dateField = ref}              
          /> 
          <Text style={{ marginLeft: 20, marginTop: 10 }}>Valor de Venda</Text>
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
          value={this.state.saleprice}
          onChangeText={(text) => this.updateTextInput(text, 'saleprice')}                  
          ref={(ref) => this.salePriceField = ref}              
        />
        <Text style={{ marginLeft: 20, marginTop: 10 }}>Valor Líquido Final</Text>
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
          value={this.state.finalprice}
          onChangeText={(text) => this.updateTextInput(text, 'finalprice')}                
          ref={(ref) => this.finalPriceField = ref}
        />       
        <Text style={{ marginLeft: 20, marginTop: 10 }}>Valor Pago</Text>
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
          value={this.state.amountpaid}
          onChangeText={(text) => this.updateTextInput(text, 'amountpaid')}                
          ref={(ref) => this.amountPaidField = ref}
        />           
        <Text style={{ marginLeft: 20, marginTop: 10 }}>Observações</Text>
        <TextInput
          placeholder="Observações"
          multiline={true}
          style={styles.textInput}
          value={this.state.observations}
          onChangeText={(text) => this.updateTextInput(text, 'observations')}
        />
        <Button              
          icon={{ name: 'shopping-cart', color: 'white'}}
          title={`Carrinho (${this.state.productQuantity})`}
          buttonStyle={styles.button}
          onPress={() => this.props.navigation.navigate('RegisterSaleProduct', {
            id: `${this.state.id}`
          })}
        />              
        <Button
          icon={{name: 'save', color: '#FFF'}}         
          title="Salvar Venda"
          buttonStyle={styles.button}                
          onPress={() => this.saveSale()}
        /> 
        {this.state.id !== '' && (
          <Button
            icon={{ name: 'delete', color: '#FFF' }}
            title="Deletar"
            buttonStyle={styles.deleteButton}
            onPress={() => console.log("O ID DO SELECTED SELLING WAY: ", this.state.selectedCustomer)} />
        )}

        {/* <Button
          icon={{ name: 'arrow-back', color: 'white'}}
          title="Vendas"
          buttonStyle={{ marginLeft: 100, marginRight: 100, marginTop: 10, padding: 10, borderRadius: 80 }}
          onPress={() => this.props.navigation.navigate('Sales', { update: true })}
        />       */}                            
      </View> 
      </KeyboardAvoidingView>
    </ScrollView>
    );
  }  
}
