export interface fazendaCadastro {
    fazendaID: number;
    nomeFazenda: string;
    hectar: string;
    cultivar: string;
    rua?: string;
    num?: string;
    cidade?: string;
    estado?: string|null;
    latitude?: string;
    longitude?: string;
    tipoPlantio: boolean;
    areaMecanizada: boolean;
    clienteID: string;
  }