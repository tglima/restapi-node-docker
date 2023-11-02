let instance;

class ConstantUtil {
  constructor() {
    process.env.SWAGGER_URL = process.env.SWAGGER_URL.replace('{{NU_PORT}}', process.env.NU_PORT);

    this.MsgStatus400 =
      'Ocorreu uma falha/erro na sua requisição. Reveja os dados enviados e tente novamente!';
    this.MsgStatus401 = 'Credenciais inválidas ou ausentes';
    this.MsgStatus404 = 'Item não encontrado!';
    this.MsgStatus429 = 'Limite de requisições ultrapassado, por favor, aguarde.';
    this.MsgStatus500 = 'Erro interno no servidor!';
    this.MsgInvalidID = 'id não informado ou inválido!';
    this.MsgStartAPI = `API listening on ${process.env.NU_PORT}\nSwagger link: ${process.env.SWAGGER_URL}`;
    this.MsgConnSQLiteSuccess = 'Sucesso ao conectar no SQLite';
    this.MsgConnSQLiteError = 'Erro ao conectar ao SQLite';
    this.MomentTimeZone = 'America/Sao_Paulo';
    this.MomentDateFormat = 'YYYY-MM-DD HH:mm:ss';
    this.MsgInvalidMomentDateFormat = `Data inválida. Verifique os valores fornecidos e utilize o formato ${this.MomentDateFormat}`;
    this.MsgInvalidDateTimeRange = 'A data de início deve ser anterior à data de fim';
    this.MsgDateTimeIsEmpty = 'A data fornecida está vazia ou nula';
    this.MsgInvalidQueryParams = 'Os parametros informados não são válidos';
    this.MsgInvalidValue = 'o valor informado é inválido!';
    this.MsgErrorCreateZip = 'Ocorreu um erro na geração do arquivo zip';
    this.MsgErrorDeleteOldZip = 'Ocorreu um erro ao tentar apagar os zips antigos';
    this.MsgErrorFindDb = 'Ocorreu um erro ao buscar o banco de dados';
    this.MsgFailGetFile = 'Falha ao obter o arquivo';
    this.MsgErrorGetInfoFile = 'Falha ao obter informações do arquivo';
    this.MsgErroDatabaseQuery = 'Ocorreu um erro durante a consulta no banco de dados';
    this.MsgDatabaseDeleteRows = 'Os {{VALUE}} registros mais antigos foram excluídos com sucesso';
    this.MsgDatabaseNoDelete = 'Não foram encontrados registros para serem deletados';
    this.CodeEventFormatRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?!.*--)(?!.*[0-9-]{21,})(?!.*\s).{20,}$/;
    this.ApiKeyFormatRegex = /^(?=[a-zA-Z\d-]{15,}$)(?!.*([a-zA-Z\d-])\1{2,})(?!.*\s)/;
    this.SQliteQueryFindByApiKey = `json_extract(json_log_event, '$.io_data.request_data.headers."api-key"') = '{{VALUE}}'`;
  }

  static getInstance() {
    if (!instance) {
      instance = new ConstantUtil();
      Object.freeze(instance);
    }
    return instance;
  }
}

export default ConstantUtil.getInstance();
