# Use uma imagem base do Node.js
FROM node:16

# Crie e defina o diretório de trabalho
WORKDIR /app

# Copie o arquivo package.json para dentro do container
COPY package.json /app

# Instale as dependências
RUN npm install

# Copie todos os arquivos da pasta local para o container
COPY . /app

# Exponha a porta 8080 (ou qualquer porta que o servidor utilize)
EXPOSE 8080

# Comando para rodar a aplicação
CMD ["node", "server/server.js"]
