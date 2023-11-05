# Utiliz a imagem do Node.js 18 no Alpine
FROM node:18-alpine

# Pré define o valor das variáveis de ambiente utilizadas pelas aplicaçaõ
# Caso o usuário informe será utilizado o valor definido por ele

ARG NU_PORT=1985
ARG API_KEY="914669d3-229d8912823c;798fed97-4d4faee7ebf7"
ARG NODE_ENV=homolog
ARG MNG_AUTHENTICATION="dGdsaW1hdGVjaEBlbWFpbC5jb206Um9tYW5vczEwMTA=;"
ARG EXPRESS_TRUST_PROXY_VALUE=0
ARG SWAGGER_URL="http://localhost:{{NU_PORT}}/swagger"

# Define as variáveis de ambiente específicas para a aplicação
ENV NU_PORT=$NU_PORT
ENV API_KEY=$API_KEY
ENV NODE_ENV=$NODE_ENV
ENV MNG_AUTHENTICATION=$MNG_AUTHENTICATION
ENV EXPRESS_TRUST_PROXY_VALUE=$EXPRESS_TRUST_PROXY_VALUE
ENV SWAGGER_URL=$SWAGGER_URL


# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/webapi

# Copie os arquivos da pasta 'dist' para o diretório de trabalho
COPY . /usr/src/webapi

# Apaga o arquivo Dockerfile
RUN rm /usr/src/webapi/Dockerfile

#Instala o nano caso precise editar algum arquivo pelo terminal
RUN apk add --no-cache nano

# Atualiza o npm para uma versão mais atual
RUN npm install -g npm@10.2.3

# Instale apenas as dependências de produção do projeto
RUN npm install --omit=dev --exact

# Exponha a porta configurada
EXPOSE $NU_PORT

# Comando para iniciar a aplicação (substitua pelo seu comando de inicialização)
CMD ["npm", "start"]
