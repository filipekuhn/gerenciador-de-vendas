import React from 'react';
import { View, Text } from 'react-native'
import { NavigationContainer, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import SalesRoutes from './routes/sales.routes';

import Main from './pages/main';
import Customer from './pages/customer/customer';
import Customers from './pages/customer/customers';
import EditCustomer from './pages/customer/editCustomer';
import RegisterCustomer from './pages/customer/registerCustomer';
import SellingWay from './pages/sellingWay/sellingWay';
import SellingWays from './pages/sellingWay/sellingWays';
import RegisterSellingWay from './pages/sellingWay/registerSellingWay';
import FileFormat from './pages/fileFormat/fileFormat';
import FileFormats from './pages/fileFormat/fileFormats';
import RegisterFileFormat from './pages/fileFormat/registerFileFormat';
import EditFileFormat from './pages/fileFormat/editFileFormat';
import Products from './pages/product/products';
import Product from './pages/product/product';
import RegisterProduct from './pages/product/registerProduct';
import EditProduct from './pages/product/editProduct';
import Cities from './pages/city/cities';
import City from './pages/city/city';
import RegisterCity from './pages/city/registerCity';
import RegisterProductSellingWay from './pages/product/registerProductSellingWay';
import EditProductSellingWay from './pages/product/editProductSellingWay';
import RegisterSale from './pages/sale/registerSale';
import RegisterSaleProduct from './pages/sale/registerSaleProduct';
import EditSaleProduct from './pages/sale/editSaleProduct';
import SaleProducts from './pages/sale/saleProducts';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

createDrawer = ({ navigation }) =>
  <Drawer.Navigator initialRouteName="Cadastros">
    <Drawer.Screen name="Cadastros" component={Main} initialParams={{ titleName: 'Cadastros' }} />    
    <Drawer.Screen name="Vendas" component={SalesRoutes} initialParams={{ update: false }} />    
    <Drawer.Screen name="Financeiro" component={Products} />
    <Drawer.Screen name="Backup" component={FileFormats}  />    
  </Drawer.Navigator>


function App() {  
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Menu">
        <Stack.Screen 
          name="Menu"
          children={this.createDrawer}                    
          //component={this.createDrawer}
          options={({ navigation, route }) => ({                                    
            title: 'JSI',
            headerStyle: {backgroundColor: '#5390fe'}, 
            headerTintColor: '#FFF', 
            headerTitleAlign: 'center',
            headerLeft: () =>
              <Icon
                onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
                style={[{ color: 'white', marginLeft: 16 }]}
                size={28}
                name={'menu'}
              />
          })
          }          
        />             

        <Stack.Screen name="Customer" 
          component={Customer} 
          options={{  title: "Clientes", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} /> 
        
        <Stack.Screen name="RegisterSale" 
          component={RegisterSale}
          initialParams={{ id: '', update: false }} 
          options={{ title: "Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="SaleProducts" 
          component={SaleProducts}
          initialParams={{ update: false }} 
          options={{ title: "Carrinho de Produtos", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />                  

        <Stack.Screen name="RegisterSaleProduct" 
          component={RegisterSaleProduct} 
          options={{ title: "Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />                  

        <Stack.Screen name="EditSaleProduct" 
          component={EditSaleProduct} 
          options={{ title: "Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />                          

        <Stack.Screen name="RegisterCustomer" 
          component={RegisterCustomer} 
          options={{ title: "Cliente", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="EditCustomer" 
          component={EditCustomer} 
          options={{ title: "Editar dados do Cliente", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="Customers" 
          component={Customers}
          options={{ title: "Clientes", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} 
          initialParams={{ update: false }}/>
        
        <Stack.Screen name="SellingWay" 
          component={SellingWay} 
          options={{ title: "Forma de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />
        
        <Stack.Screen name="SellingWays" 
          component={SellingWays} 
          options={{ title: "Formas de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }}
          initialParams={{ update: false }} />

        <Stack.Screen name="RegisterSellingWay" 
          component={RegisterSellingWay} 
          options={{ title: "Forma de Venda", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="FileFormat" 
          component={FileFormat} 
          options={{ title: "Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="FileFormats" 
          component={FileFormats} 
          options={{ title: "Formatos de Arquivos", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} 
          initialParams={{ update: false }} />                  
        
        <Stack.Screen name="RegisterFileFormat" 
          component={RegisterFileFormat} 
          options={{ title: "Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="EditFileFormat" 
          component={EditFileFormat} 
          options={{ title: "Editar Formato de Arquivo", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="Products"  
          component={Products} 
          options={{ title: "Produtos", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} 
          initialParams={{ update: false }}/>                  

        <Stack.Screen name="Product"  
          component={Product} 
          options={{ title: "Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />   

        <Stack.Screen name="RegisterProduct" 
          component={RegisterProduct} 
          options={{ title: "Cadastro de Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="EditProduct" 
          component={EditProduct} 
          options={{ title: "Editar Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />

        <Stack.Screen name="Cities" 
          component={Cities} 
          options={{ title: "Cidades", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }}
          initialParams={{ update: false }} />                                    

        <Stack.Screen name="City"   
          component={City} 
          options={{ title: "Cidade", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />      

        <Stack.Screen name="RegisterCity"   
          component={RegisterCity} 
          options={{ title: "Cidade", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />        

        <Stack.Screen name="RegisterProductSellingWay"   
          component={RegisterProductSellingWay} 
          options={{ title: "Formas de Venda do Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />      

        <Stack.Screen name="EditProductSellingWay"   
          component={EditProductSellingWay} 
          options={{ title: "Formas de Venda do Produto", headerStyle: {backgroundColor: '#5390fe'}, 
                  headerTintColor: '#FFF', headerTitleAlign: 'left' }} />      
      </Stack.Navigator>                  
    </NavigationContainer>
  );
}

export default App;

