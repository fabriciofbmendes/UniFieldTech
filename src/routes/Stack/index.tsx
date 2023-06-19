import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from '../../screens/Home'
import Login from '../../screens/LoginSingUp/Login'
import Cadastro from '../../screens/LoginSingUp/Cadastro'
import { propsNavigationStack } from "./Models";
import Fazenda from "../../screens/Fazenda";
import ClimaRegiao from "../../screens/ClimaRegiao";

import CadastroFazenda from "../../screens/Fazenda/Cadastro";
const {Navigator,Screen} = createNativeStackNavigator<propsNavigationStack>()

export default function() {
    return(
        <Navigator initialRouteName="Login">
            <Screen name="Login" component={Login}/>
            <Screen name="Home" component={Home}/>
            <Screen name="Cadastro" component={Cadastro}/>
            <Screen name="Fazenda" component={Fazenda}/>
            <Screen name="CadastroFazenda" component={CadastroFazenda}/>
        </Navigator>
    )
}