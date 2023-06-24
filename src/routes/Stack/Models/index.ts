import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type propsNavigationStack = {
    Home: undefined,
    Login : undefined,
    Cadastro : undefined,
    Fazenda: {
        latitude: number,
        longitude: number,
        hectar: number
    }
    ClimaRegiao : undefined,
    CadastroFazenda : undefined,
}

export type propsStack = NativeStackNavigationProp<propsNavigationStack>