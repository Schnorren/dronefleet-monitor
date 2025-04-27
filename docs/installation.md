# Guia de Instalação e Configuração

Este guia fornece instruções detalhadas para instalar e configurar a aplicação DroneFleet Monitor em ambientes de desenvolvimento e produção.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (v16.x ou superior)
- npm (v8.x ou superior)
- MongoDB (v5.x ou superior)
- Redis (v6.x ou superior)

## Instalação do Backend

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/dronefleet-monitor.git
   cd dronefleet-monitor
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na raiz do projeto com base no modelo `.env.example`
   - Preencha as variáveis com os valores apropriados para seu ambiente

   Exemplo de arquivo `.env`:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dronefleet
   JWT_SECRET=seu_jwt_secret_seguro
   JWT_EXPIRE=30d
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

   Ou em modo de produção:
   ```bash
   npm start
   ```

## Instalação do Frontend

1. Clone o repositório do frontend:
   ```bash
   git clone https://github.com/seu-usuario/dronefleet-monitor-frontend.git
   cd dronefleet-monitor-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto

   Exemplo de arquivo `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_mapbox
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

   Ou construa para produção:
   ```bash
   npm run build
   npm start
   ```

## Configuração do MongoDB

1. Certifique-se de que o MongoDB está em execução:
   ```bash
   sudo systemctl status mongodb
   ```

2. Crie um banco de dados para a aplicação:
   ```bash
   mongo
   > use dronefleet
   > exit
   ```

## Configuração do Redis

1. Certifique-se de que o Redis está em execução:
   ```bash
   sudo systemctl status redis
   ```

2. Teste a conexão com o Redis:
   ```bash
   redis-cli ping
   ```
   Deve retornar `PONG`.

## Configuração para Produção

Para ambientes de produção, recomendamos:

1. Usar um proxy reverso como Nginx ou Apache
2. Configurar HTTPS com certificados SSL
3. Implementar monitoramento com PM2 ou similar
4. Configurar backups automáticos do MongoDB

### Exemplo de configuração Nginx:

```nginx
server {
    listen 80;
    server_name dronefleet.seudominio.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Configuração PM2:

Crie um arquivo `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'dronefleet-backend',
      script: 'src/server.js',
      instances: 'max',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      }
    },
    {
      name: 'dronefleet-frontend',
      cwd: '../dronefleet-monitor-frontend',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

Inicie com:
```bash
pm2 start ecosystem.config.js
```

## Verificação da Instalação

Para verificar se a instalação foi bem-sucedida:

1. Backend: Acesse `http://localhost:5000/api/health` - deve retornar status 200 com uma mensagem de sucesso
2. Frontend: Acesse `http://localhost:3000` - deve exibir a página de login da aplicação

## Solução de Problemas

### Problemas comuns:

1. **Erro de conexão com MongoDB**:
   - Verifique se o MongoDB está em execução
   - Confirme se a string de conexão está correta no arquivo `.env`

2. **Erro de conexão com Redis**:
   - Verifique se o Redis está em execução
   - Confirme se as configurações de host e porta estão corretas

3. **Erro de CORS**:
   - Verifique se a URL da API está configurada corretamente no frontend
   - Confirme se as configurações de CORS no backend permitem o domínio do frontend

4. **Problemas com WebSockets**:
   - Verifique se o proxy está configurado para suportar WebSockets
   - Confirme se as configurações de Socket.io estão corretas em ambos os lados
