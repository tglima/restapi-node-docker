# restapi-node-docker

Este projeto consiste em uma API REST baseada em Node.js, conectada a um banco de dados SQLite.

## Documentação da API

Para facilitar o entendimento da API, existem dois documentos Swagger disponíveis:

- Um documento Swagger documenta os principais endpoints da API REST.
- O outro documento Swagger é para endpoints restritos na área administrativa.

Cada Swagger possui rotas específicas de acesso: `/swagger` para o Swagger principal e `/swagger-manager` para o Swagger administrativo.

## Segurança

A proteção das rotas é realizada por meio da validação de chave de API, sendo necessário uma chave adicional para acessar as rotas administrativas.

## Parametrização

A modificação do comportamento da aplicação é possível por meio de variáveis de ambiente, que representam os parâmetros centrais. Você pode alterar ou adicionar os valores no arquivo ENV correspondente ao ambiente em que a aplicação vai ser executada. Você também pode optar por alterar essas configurações diretamente no ambiente em que a aplicação vai rodar. As variáveis de ambiente possuem maior prioridade do que os valores definidos no arquivo ENV.

Segue abaixo as configurações que podem ser alteradas:

- **API_KEY**: Credenciais de acesso fornecidas para permitir acessar os endpoints da aplicação.
- **DATABASE_FILE_NAME**: Corresponde ao nome do arquivo que vai conter o banco de dados SQLite.
- **EXPRESS_TRUST_PROXY_VALUE**: Define se a aplicação deve ou não considerar se está atrás de um proxy.
- **LEVEL_COMPRESS_FILE**: Corresponde ao nível de compactação que o arquivo ZIP gerado deve se submeter.
- **MAX_ALLOWED_MIN_SERVER**: Corresponde ao tempo em minutos máximo que o arquivo gerado deve ficar no servidor.
- **MNG_AUTHENTICATION**: Corresponde à segunda chave de autenticação que o usuário deve informar para conseguir consumir os endpoints da área administrativa.
- **MUST_HIDE_INFO_MESSAGE**: Informa se deve ocultar as mensagens de log info geradas pela aplicação.
- **MUST_RUN_MORGAN_BODY**: Se o valor for verdadeiro, será exibido no console toda entrada e saída de dados da aplicação.
- **NU_PORT**: Corresponde à porta em que a aplicação vai responder as chamadas HTTP feitas para o express.
- **QT_LIMIT_DELETE**: Corresponde à quantidade máxima de registros que podem ser apagados por vez ao chamar o endpoint "/mng/database/delete".
- **QT_LIMIT_RESULT**: Corresponde à quantidade máxima de registros que serão exibidos por vez ao chamar os endpoints: "/mng/log-events/find" ou "/mng/log-errors/find".
- **QT_MAX_RATE_MIN**: Corresponde ao número máximo de requisições que podem ser feitas por minuto para a API.
- **SWAGGER_CUSTOM_CSS**: Define um CSS personalizado para as páginas do swagger.
- **SWAGGER_CUSTOM_SITE_TITLE**: Define um title personalizado para as páginas do swagger.
- **SWAGGER_SERVERS_DESCRIPTION**: Define um texto descritivo personalizado para as páginas do swagger.
- **SWAGGER_URL**: Define o texto exibido na inicialização da aplicação que mostra a URL de acesso ao SWAGGER.

## Sistema de Logs

Um sistema de logs robusto foi implementado para registrar as requisições e métodos invocados, permitindo consultas posteriores.

## Testes automatizados

O projeto possui testes automatizados que desempenham um papel crucial na garantia da qualidade e estabilidade. Os resultados dos testes são exibidos no console, apresentando o número total de testes executados, a quantidade de testes aprovados e a quantidade de testes reprovados. Os testes são categorizados em duas classes: testes unitários e testes de integração. Para a criação e execução desses testes automatizados, utilizamos as bibliotecas Jest e supertest.

## Utilização do Babel e Suporte a Versões Antigas do Node.js

O código-fonte em Node.js utiliza o Babel para permitir o uso de recursos modernos do Node e transpilação para versões mais antigas.

## Integração com GitHub Actions

O projeto possui duas GitHub Actions configuradas.

A primeira gera uma imagem Docker do projeto compilado, pronta para o ambiente de homologação. Após a geração da imagem, ela é publicada no Docker Hub com a tag "latest". Essa ação é acionada sempre que um commit é feito nesta branch.

A segunda realiza testes automatizados sempre que um Pull Request é aberto na branch Main. Em caso de falha nos testes, o Pull Request é automaticamente fechado e negado.

## Como baixar e usar a imagem docker

    docker run -d -e NU_PORT=2000 -p 2000:2000 --memory=400m --name github-restapi-node-docker tglimatech/github-restapi-node-docker:latest

### Detalhes dos parâmetros do comando:

- `-d`: Executa o contêiner em segundo plano, como um processo de longa duração.
- `-e NU_PORT`: Define a variável de ambiente NU_PORT para que a aplicação responda às requisições feitas nela.
- `-p 2000:2000`: Mapeia a porta 2000 do host para a porta 2000 do contêiner, permitindo que o serviço dentro do contêiner seja acessado pela porta 2000 do host.
- `--memory=400m`: Limita a quantidade de memória disponível para o contêiner a 400 megabytes.
- `--name github-restapi-node-docker`: Atribui o nome "github-restapi-node-docker" ao contêiner.
- `tglimatech/github-restapi-node-docker:latest`: Nome da imagem a partir da qual o contêiner será criado e iniciado. A tag `latest` garante que o contêiner seja criado com a versão mais recente da imagem.

## Pré-requisitos

- Para rodar a aplicação localmente será necessário o [NodeJS v18](https://nodejs.org/en/download) ou superior.
- Para utilizar a imagem Docker, certifique-se de ter o Docker instalado em seu ambiente de desenvolvimento. Para instalar o Docker, siga as instruções na [documentação do Docker](https://docs.docker.com/get-started/).

## Sugestões

Sempre são bem-vindas sugestões de melhorias. Para enviá-las, basta abrir uma issue no repositório do projeto. Caso queira relatar um problema, você também pode abrir uma issue. Se preferir, é possível abrir um pull request com a correção.
