import React from 'react';
import { Text } from 'react-native';
import { Icon } from 'react-native-elements'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons  from 'react-native-vector-icons/Ionicons'

import Sales from '../pages/sale/sales';
import Sale from '../pages/sale/sale';
import RegisterSale from '../pages/sale/registerSale';


const Tab = createBottomTabNavigator();


function WildCard({ title }) {
  return <Text>Wildcard {title}</Text>
}

export default function SalesRoutes() {
  return(
    <Tab.Navigator initialRouteName="Sales"    
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Sales') {
                iconName = focused
                  ? 'shopping-cart'
                  : 'shopping-cart';
              } else if (route.name === 'Pending') {
                iconName = 'money-off';                  
              } else if (route.name === 'Payed') {
                iconName = 'done-all';
              } else if (route.name === 'Preview') {
                iconName = 'event'
              }

              // You can return any component that you like here!
              //return <Ionicons name={iconName} size={size} color={color} />;
              return <Icon name={iconName} size={size} color={color} />;
            },
          })}
          tabBarOptions={{
            activeTintColor: '#5390FE',
            inactiveTintColor: 'gray',
          }}
        >
        <Tab.Screen name="Sales" component={Sales} initialParams={{ update: false }} options={{ title: "Vendas" }} />
        <Tab.Screen name="Pending" component={Sale} initialParams={{ update: false }} options={{ title: "Pendentes" }} />
        <Tab.Screen name="Payed" component={Sale} initialParams={{ update: false }} options={{ title: "Encerradas" }} />
        <Tab.Screen name="Preview" component={Sale} initialParams={{ update: false }} options={{ title: "Orçamentos" }} />
    </Tab.Navigator>
     
  )
}



