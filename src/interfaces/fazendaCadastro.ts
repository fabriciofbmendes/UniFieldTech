export interface fazendaCadastro {
    fazendaID: number;
    nomeFazenda: string;
    hectar: string;
    PlantacaoId: number;
    rua?: string;
    num?: string;
    cidade?: string;
    estado?: string|null;
    latitude?: string;
    longitude?: string;
    tipoPlantio: boolean;
    areaMecanizada: boolean;
    clienteIdUser: string;
    clienteID : number;
  }