let instance;

class ConstantUtil {
  constructor() {
    this.MsgStatus400 =
      'Ocorreu uma falha/erro na sua requisição. Reveja os dados enviados e tente novamente!';
    this.MsgStatus401 = 'Credenciais inválidas ou ausentes';
    this.MsgStatus404 = 'Item não encontrado!';
    this.MsgStatus429 =
      'Limite de requisições ultrapassado, por favor, aguarde.';
    this.MsgStatus500 = 'Erro interno no servidor!';
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
