# 🛒 API REST - Loja de Livros

API RESTful completa para gerenciamento de produtos e usuários.

## 🚀 Tecnologias

- Node.js
- Express
- SQLite (better-sqlite3)
- JWT para autenticação
- Bcrypt para senhas

## 📋 Pré-requisitos

- Node.js >= 14
- npm ou yarn

## 🔧 Instalação

```bash
# 1. Criar pasta do projeto
mkdir minha-primeira-api
cd minha-primeira-api

# 2. Inicializar projeto Node.js
npm init -y

# 3. Instalar Express (framework web)
npm install express

# 4. Instalar nodemon (reinicia automático)
npm install --save-dev nodemon

# 5. Criar arquivo principal
touch index.js

# 6. Abrir no VS Code
code .

# 7. Iniciar e conectar ao repositório do github
- git init
- git remote add origin “link do seu github”

# 8. Commitar e enviar o projeto ao github
- git commit -m “titulo do commit”
- git branch -M main
- git push origin main

```

## 📡 Endpoints

### Autenticação

**POST /auth/register**
- Cadastrar novo usuário
![Logo](PrintPostman/JWTregister.png)

**POST /auth/login**
- Login de usuário
![Logo](PrintPostman/JWTlogin.png)


### Produtos (🔒 = autenticação necessária)

**GET /api/produtos**
- Listar todos os produtos
![Logo](PrintPostman/Get.png)


**GET /api/produtos/:id**
- Buscar produto por ID
![Logo](PrintPostman/Get_id.png)
 
**POST /api/produtos** 🔒
- Criar produto
![Logo](PrintPostman/Post.png)


**PUT /api/produtos/:id** 🔒
- Atualizar produto
![Logo](PrintPostman/Put.png)

**DELETE /api/produtos/:id** 🔒
- Deletar produto
![Logo](PrintPostman/D.png)

## 🔐 Autenticação

Rotas protegidas requerem token JWT no header:

```
Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImVtYWlsIjoibWFyY29AZ21haWwuY29tIiwiaWF0IjoxNzc2MzcwODQyLCJleHAiOjE3NzYzNzgwNDJ9.iQ_Zb0epELLiSQoKPs1QjyolGcxCrCAqPpE1zWspI5g"
}
```

## 🌐 Deploy
 [Deploy na Render: https://minha-api.onrender.com
](https://atividadefinal-api-3.onrender.com/api/produtos)

## 👨‍💻 Autor

**Andrei Miguel Aguilar*
- GitHub: @andreiMiguel945
- Email: andrei.aguilar@edu.unifil.br

## 📄 Licença
Este projeto está sob a licença MIT. Consulta o ficheiro [LICENSE](LICENSE) para mais detalhes.
