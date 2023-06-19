import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type propsNavigationStack = {
    Home: undefined,
    Login : undefined,
    Cadastro : undefined,
    Fazenda: {
        latitude: number,
        longitude: number,
        hectares: number
    }
    CadastroFazenda : undefined,
}

export type propsStack = NativeStackNavigationProp<propsNavigationStack>