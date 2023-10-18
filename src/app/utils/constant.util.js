let instance;

class ConstantUtil {
  constructor() {
    process.env.SWAGGER_URL = process.env.SWAGGER_URL.replace(
      '{{NU_PORT}}',
      process.env.NU_PORT
    );

    this.MsgStatus400 =
      'Ocorreu uma falha/erro na sua requisição. Reveja os dados enviados e tente novamente!';
    this.MsgStatus401 = 'Credenciais inválidas ou ausentes';
    this.MsgStatus404 = 'Item não encontrado!';
    this.MsgStatus429 =
      'Limite de requisições ultrapassado, por favor, aguarde.';
    this.MsgStatus500 = 'Erro interno no servidor!';
    this.MsgInvalidID = 'id não informado ou inválido!';
    this.MsgStartAPI = `API listening on ${process.env.NU_PORT}\nSwagger link: ${process.env.SWAGGER_URL}`;
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
