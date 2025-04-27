# Guia de Implantação - DroneFleet Monitor

Este guia fornece instruções detalhadas para implantar a aplicação DroneFleet Monitor a partir do pacote otimizado.

## Conteúdo do Pacote

O pacote contém os seguintes diretórios:

- `backend-src/`: Código-fonte do backend (Node.js/Express)
- `frontend-src/`: Código-fonte do frontend (Next.js)
- `docs/`: Documentação completa da aplicação

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (v16.x ou superior)
- npm (v8.x ou superior)
- MongoDB (v5.x ou superior)
- Redis (v6.x ou superior)

## Implantação do Backend

1. Crie um diretório para o backend:
   ```bash
   mkdir -p dronefleet-monitor-backend
   cp -r backend-src/* dronefleet-monitor-backend/
   cd dronefleet-monitor-backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Edite o arquivo `.env` com os valores apropriados para seu ambiente

   Exemplo de configuração:
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/dronefleet
   JWT_SECRET=seu_jwt_secret_seguro
   JWT_EXPIRE=30d
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

   Para ambiente de produção, recomendamos usar PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name dronefleet-backend
   ```

## Implantação do Frontend

1. Crie um diretório para o frontend:
   ```bash
   mkdir -p dronefleet-monitor-frontend
   cp -r frontend-src/* dronefleet-monitor-frontend/
   cd dronefleet-monitor-frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   - Crie um arquivo `.env.local` na raiz do projeto

   Exemplo de configuração:
   ```
   NEXT_PUBLIC_API_URL=http://seu-servidor:5000/api
   NEXT_PUBLIC_MAPBOX_TOKEN=seu_token_mapbox
   ```

4. Construa a aplicação para produção:
   ```bash
   npm run build
   ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

   Para ambiente de produção com PM2:
   ```bash
   pm2 start npm --name dronefleet-frontend -- start
   ```

## Configuração de Proxy Reverso (Nginx)

Para uma implantação em produção, recomendamos usar o Nginx como proxy reverso:

1. Instale o Nginx:
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. Configure um site para a aplicação:
   ```bash
   sudo nano /etc/nginx/sites-available/dronefleet
   ```

3. Adicione a seguinte configuração:
   ```nginx
   server {
       listen 80;
       server_name seu-dominio.com;
       
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

4. Ative o site e reinicie o Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/dronefleet /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. Configure HTTPS com Certbot (recomendado):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d seu-dominio.com
   ```

## Configuração Inicial do Sistema

Após a implantação, você precisará configurar o sistema:

1. Acesse a aplicação em seu navegador (http://seu-dominio.com)
2. Faça login com as credenciais padrão:
   - Email: admin@dronefleet.com
   - Senha: admin123
3. Altere imediatamente a senha padrão
4. Comece a configurar sua frota de drones e usuários

## Verificação da Implantação

Para verificar se a implantação foi bem-sucedida:

1. Backend: Acesse `http://seu-dominio.com/api/health` - deve retornar status 200
2. Frontend: Acesse `http://seu-dominio.com` - deve exibir a página de login
3. WebSockets: Após login, verifique se o dashboard atualiza em tempo real

## Solução de Problemas

Consulte a seção "Solução de Problemas" no documento `docs/installation.md` para orientações sobre problemas comuns de implantação.

## Documentação Adicional

Para informações mais detalhadas, consulte os seguintes documentos:

- `docs/README.md`: Visão geral do sistema
- `docs/api.md`: Documentação completa da API
- `docs/user-manual.md`: Manual do usuário

## Suporte

Para suporte adicional, entre em contato com nossa equipe técnica em suporte@dronefleet.com.
