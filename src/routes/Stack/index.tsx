import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from '../../screens/Home'
import Login from '../../screens/LoginSingUp'
import { propsNavigationStack } from "./Models";

const {Navigator,Screen} = createNativeStackNavigator<propsNavigationStack>()

export default function() {
    return(
        <Navigator initialRouteName="Login">
            <Screen name="Login" component={Login}/>
            <Screen name="Home" component={Home}/>
        </Navigator>
    )
}