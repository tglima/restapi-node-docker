import dotenv from 'dotenv';
import path from 'path';

const packageJSON = require('../../package.json');

// #region Carrega o config de acordo com NODE_ENV
const envPath = path.join(__dirname, '..', 'config', `${process.env.NODE_ENV || 'develop'}.env`);
dotenv.config({ path: envPath });
// #endregion

const nuPort = process.env.NU_PORT || 9090;
let instance;

function getSwaggerURL() {
  const startValueSwaggerURL = process.env.SWAGGER_URL || 'http://localhost:{{NU_PORT}}/swagger';
  return startValueSwaggerURL.replace('{{NU_PORT}}', nuPort);
}

function getMsgStartAPI() {
  const envMode = `${process.env.NODE_ENV || 'develop'}`;
  return `Env mode: ${envMode}\nAPI listening on ${nuPort}\nSwagger link: ${getSwaggerURL()}`;
}

function getNuVersionFromFile() {
  let nuVersion = '0.0.0';
  try {
    nuVersion = packageJSON.version;
  } catch (error) {
    nuVersion = '0.0.0';
  }

  return nuVersion;
}

class ConstantUtil {
  constructor() {
    // #region Constantes que podem ser carregadas com variáveis de ambiente
    this.NuPort = nuPort;
    this.SwaggerURL = getSwaggerURL();
    this.SwaggerInfoVersion = getNuVersionFromFile();
    this.NuVersionAPI = +process.env.NU_VERSION || 1;
    this.SwaggerInfoDesc = process.env.SWAGGER_INFO_DESCRIPTION || 'Swagger dos principais endpoints da API';
    this.SwaggerInfoDescMng =
      process.env.SWAGGER_INFO_DESCRIPTION_MNG || 'Swagger dos endpoints de administração da API';

    this.SwaggerCustomCSS =
      process.env.SWAGGER_CUSTOM_CSS || '.swagger-ui .response-col_links { display: none; }';

    this.CustomSiteTitle = process.env.SWAGGER_CUSTOM_SITE_TITLE || 'TgLima Tech - Node Rest API';
    this.SwaggerServersDescription = process.env.SWAGGER_SERVERS_DESCRIPTION || 'Ambiente de desenvolvimento';

    this.MustRunMorganBody = process.env.MUST_RUN_MORGAN_BODY;
    this.ExpressTrustProxyValue = process.env.EXPRESS_TRUST_PROXY_VALUE;
    this.DataBaseFileName = process.env.DATABASE_FILE_NAME || 'database.db';
    this.LevelCompress = +process.env.LEVEL_COMPRESS_FILE || 5;
    this.MaxAllowedMinServer = +process.env.MAX_ALLOWED_MIN_SERVER || 5;
    this.QtMaxRateMin = +process.env.QT_MAX_RATE_MIN || 300;
    this.ApiKey = process.env.API_KEY || '77be91d8-4bb1ba8e27a9;';
    this.MngKeyAuth = process.env.MNG_KEY_AUTH || 'dGdsaW1hdGVjaEBlbWFpbC5jb206Um9tYW5vczEwMTA=;';
    this.QtLimitResult = +process.env.QT_LIMIT_RESULT || 10;
    this.QtLimitDelete = +process.env.QT_LIMIT_DELETE || 10;
    this.MsgStartAPI = getMsgStartAPI();
    // #endregion

    this.TrustProxy = 'trust proxy';
    this.MsgStatus400 =
      'Ocorreu uma falha/erro na sua requisição. Reveja os dados enviados e tente novamente!';
    this.MsgStatus401 = 'Credenciais inválidas ou ausentes';
    this.MsgStatus404 = 'Item não encontrado!';
    this.MsgStatus429 = 'Limite de requisições ultrapassado, por favor, aguarde.';
    this.MsgStatus500 = 'Erro interno no servidor!';
    this.MsgInvalidID = 'id não informado ou inválido!';
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
