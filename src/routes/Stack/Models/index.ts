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
    CalendarioClima: {
        latitude: number,
        longitude: number,
        plantacaoId: number,
        nomeFazenda : string
    }
}

export type propsStack = NativeStackNavigationProp<propsNavigationStack>