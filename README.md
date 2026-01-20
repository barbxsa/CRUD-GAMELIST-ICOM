# CRUD com Node.js, Express, TypeScript, SQLite e Bootstrap para teste do Grupo ICOM

Este projeto é um **CRUD simples** em que armazenamos dados no banco de dados e consumimos a API no front-end, desenvolvido com **Node.js + Express + TypeScript + SQLite** no back-end e **Bootstrap** no front-end.  
O objetivo é demonstrar como integrar uma API com um front-end para gerenciamento de dados e salvamentos de logs.

---

## Tecnologias utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap](https://getbootstrap.com/)

---

## Como rodar o projeto

### 1. Clone este repositório
```
git clone https://github.com/barbxsa/CRUD-GAMELIST-ICOM.git
cd icom-teste
```
### 2. Instale as dependências 
``` 
npm install
```
### 3. Inicie o servidor
```
npm run dev
```
O servidor rodará em:
http://localhost:3000 
### 4. Abra o front-end
Basta abrir o arquivo index.html no seu navegador (ele está dentro da pasta do projeto).
Esse arquivo faz requisições para a API criada no back-end via Ajax.

### Print do projeto

![alt text](https://raw.githubusercontent.com/barbxsa/icom-teste/refs/heads/main/screenshot.png)


### Endpoints da API
A API possui os seguintes endpoints:

```
GET /api/jogo → Lista todos os jogos

GET /api/jogo/:id → Busca um jogo específico pelo ID

POST /api/jogo → Cria um novo jogo

PUT /api/jogo/:id → Atualiza um jogo existente

DELETE /api/jogo/:id → Remove um jogo
```
