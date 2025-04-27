# Documentação da API

Este documento descreve os endpoints da API RESTful do DroneFleet Monitor, incluindo parâmetros, respostas e exemplos de uso.

## Base URL

```
http://localhost:5000/api
```

## Autenticação

A API utiliza autenticação baseada em tokens JWT. Para acessar endpoints protegidos, inclua o token no cabeçalho de autorização:

```
Authorization: Bearer <seu_token_jwt>
```

## Endpoints

### Autenticação

#### Registrar Usuário

```
POST /auth/register
```

Cria um novo usuário no sistema.

**Corpo da Requisição:**
```json
{
  "name": "Nome Completo",
  "email": "usuario@exemplo.com",
  "password": "senha123",
  "role": "operator"
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Nome Completo",
    "email": "usuario@exemplo.com",
    "role": "operator"
  }
}
```

#### Login

```
POST /auth/login
```

Autentica um usuário e retorna um token JWT.

**Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Nome Completo",
    "email": "usuario@exemplo.com",
    "role": "operator"
  }
}
```

#### Obter Perfil do Usuário

```
GET /auth/me
```

Retorna os dados do usuário autenticado.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Nome Completo",
    "email": "usuario@exemplo.com",
    "role": "operator",
    "createdAt": "2025-04-20T10:30:00.000Z"
  }
}
```

#### Atualizar Detalhes do Usuário

```
PUT /auth/update-details
```

Atualiza os detalhes do usuário autenticado.

**Corpo da Requisição:**
```json
{
  "name": "Novo Nome",
  "email": "novo.email@exemplo.com"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Novo Nome",
    "email": "novo.email@exemplo.com",
    "role": "operator"
  }
}
```

#### Atualizar Senha

```
PUT /auth/update-password
```

Atualiza a senha do usuário autenticado.

**Corpo da Requisição:**
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha456"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Senha atualizada com sucesso"
}
```

#### Recuperar Senha

```
POST /auth/forgot-password
```

Envia um email com instruções para redefinir a senha.

**Corpo da Requisição:**
```json
{
  "email": "usuario@exemplo.com"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Email enviado com instruções para redefinir a senha"
}
```

#### Redefinir Senha

```
PUT /auth/reset-password/:resetToken
```

Redefine a senha usando o token enviado por email.

**Corpo da Requisição:**
```json
{
  "password": "novaSenha456"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "message": "Senha redefinida com sucesso"
}
```

### Drones

#### Listar Drones

```
GET /drones
```

Retorna a lista de drones.

**Parâmetros de Consulta:**
- `status` (opcional): Filtrar por status (ex: active,flying)
- `page` (opcional): Número da página para paginação
- `limit` (opcional): Número de itens por página

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "count": 10,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 10
    }
  },
  "data": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "name": "Falcon-1",
      "serialNumber": "DRN-2025-001",
      "model": "DJI Mavic 3 Pro",
      "status": "flying",
      "batteryLevel": 78,
      "lastMaintenance": "2025-03-15T00:00:00.000Z",
      "nextMaintenance": "2025-06-15T00:00:00.000Z",
      "currentLocation": {
        "coordinates": [-46.633308, -23.550520],
        "altitude": 120
      }
    },
    // ... mais drones
  ]
}
```

#### Obter Drone

```
GET /drones/:id
```

Retorna os detalhes de um drone específico.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Falcon-1",
    "serialNumber": "DRN-2025-001",
    "model": "DJI Mavic 3 Pro",
    "status": "flying",
    "batteryLevel": 78,
    "lastMaintenance": "2025-03-15T00:00:00.000Z",
    "nextMaintenance": "2025-06-15T00:00:00.000Z",
    "currentLocation": {
      "coordinates": [-46.633308, -23.550520],
      "altitude": 120
    },
    "sensors": ["camera", "thermal", "lidar"],
    "totalFlightHours": 124.5,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-04-25T08:30:00.000Z"
  }
}
```

#### Criar Drone

```
POST /drones
```

Cria um novo drone.

**Corpo da Requisição:**
```json
{
  "name": "Eagle-2",
  "serialNumber": "DRN-2025-002",
  "model": "Autel EVO II",
  "status": "active",
  "sensors": ["camera", "multispectral"]
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c86",
    "name": "Eagle-2",
    "serialNumber": "DRN-2025-002",
    "model": "Autel EVO II",
    "status": "active",
    "batteryLevel": 100,
    "sensors": ["camera", "multispectral"],
    "createdAt": "2025-04-25T10:30:00.000Z"
  }
}
```

#### Atualizar Drone

```
PUT /drones/:id
```

Atualiza os detalhes de um drone.

**Corpo da Requisição:**
```json
{
  "name": "Eagle-2 Pro",
  "status": "maintenance",
  "batteryLevel": 45
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c86",
    "name": "Eagle-2 Pro",
    "serialNumber": "DRN-2025-002",
    "model": "Autel EVO II",
    "status": "maintenance",
    "batteryLevel": 45,
    "sensors": ["camera", "multispectral"],
    "updatedAt": "2025-04-25T11:15:00.000Z"
  }
}
```

#### Excluir Drone

```
DELETE /drones/:id
```

Remove um drone do sistema.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {}
}
```

#### Obter Telemetria do Drone

```
GET /drones/:id/telemetry
```

Retorna os dados de telemetria mais recentes de um drone.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "droneId": "60d21b4667d0d8992e610c85",
    "status": "flying",
    "batteryLevel": 78,
    "coordinates": [-46.633308, -23.550520],
    "altitude": 120,
    "speed": 15.5,
    "heading": 270.3,
    "timestamp": "2025-04-25T08:45:30.000Z"
  }
}
```

#### Atualizar Status do Drone

```
PUT /drones/:id/status
```

Atualiza o status de um drone.

**Corpo da Requisição:**
```json
{
  "status": "active"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c85",
    "name": "Falcon-1",
    "status": "active",
    "updatedAt": "2025-04-25T09:00:00.000Z"
  }
}
```

### Missões

#### Listar Missões

```
GET /missions
```

Retorna a lista de missões.

**Parâmetros de Consulta:**
- `status` (opcional): Filtrar por status (ex: planned,in_progress)
- `droneId` (opcional): Filtrar por drone
- `page` (opcional): Número da página para paginação
- `limit` (opcional): Número de itens por página

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "count": 6,
  "pagination": {
    "next": {
      "page": 2,
      "limit": 10
    }
  },
  "data": [
    {
      "id": "60d21b4667d0d8992e610c90",
      "name": "Inspeção Perímetro Norte",
      "description": "Inspeção de segurança do perímetro norte da instalação industrial.",
      "status": "in_progress",
      "drone": {
        "id": "60d21b4667d0d8992e610c85",
        "name": "Falcon-1"
      },
      "plannedStartTime": "2025-04-25T08:00:00.000Z",
      "plannedEndTime": "2025-04-25T10:00:00.000Z",
      "actualStartTime": "2025-04-25T08:05:00.000Z"
    },
    // ... mais missões
  ]
}
```

#### Obter Missão

```
GET /missions/:id
```

Retorna os detalhes de uma missão específica.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c90",
    "name": "Inspeção Perímetro Norte",
    "description": "Inspeção de segurança do perímetro norte da instalação industrial.",
    "status": "in_progress",
    "drone": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "Falcon-1",
      "status": "flying"
    },
    "plannedStartTime": "2025-04-25T08:00:00.000Z",
    "plannedEndTime": "2025-04-25T10:00:00.000Z",
    "actualStartTime": "2025-04-25T08:05:00.000Z",
    "waypoints": [
      {
        "index": 0,
        "coordinates": [-46.633308, -23.550520],
        "altitude": 120,
        "action": "takeoff",
        "status": "completed"
      },
      {
        "index": 1,
        "coordinates": [-46.634000, -23.551000],
        "altitude": 150,
        "action": "photo",
        "status": "completed"
      },
      // ... mais waypoints
    ],
    "createdBy": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-24T14:30:00.000Z",
    "updatedAt": "2025-04-25T08:05:00.000Z"
  }
}
```

#### Criar Missão

```
POST /missions
```

Cria uma nova missão.

**Corpo da Requisição:**
```json
{
  "name": "Mapeamento Área Sul",
  "description": "Mapeamento topográfico da área sul para análise de terreno.",
  "droneId": "60d21b4667d0d8992e610c86",
  "plannedStartTime": "2025-04-26T09:00:00.000Z",
  "plannedEndTime": "2025-04-26T11:30:00.000Z",
  "waypoints": [
    {
      "index": 0,
      "coordinates": [-46.635000, -23.552000],
      "altitude": 100,
      "action": "takeoff"
    },
    {
      "index": 1,
      "coordinates": [-46.636000, -23.553000],
      "altitude": 120,
      "action": "photo"
    }
    // ... mais waypoints
  ]
}
```

**Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c91",
    "name": "Mapeamento Área Sul",
    "description": "Mapeamento topográfico da área sul para análise de terreno.",
    "status": "planned",
    "drone": {
      "id": "60d21b4667d0d8992e610c86",
      "name": "Eagle-2"
    },
    "plannedStartTime": "2025-04-26T09:00:00.000Z",
    "plannedEndTime": "2025-04-26T11:30:00.000Z",
    "waypoints": [
      // ... waypoints
    ],
    "createdAt": "2025-04-25T10:45:00.000Z"
  }
}
```

#### Atualizar Missão

```
PUT /missions/:id
```

Atualiza os detalhes de uma missão.

**Corpo da Requisição:**
```json
{
  "name": "Mapeamento Área Sul - Revisado",
  "plannedStartTime": "2025-04-26T10:00:00.000Z",
  "plannedEndTime": "2025-04-26T12:30:00.000Z"
}
```

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c91",
    "name": "Mapeamento Área Sul - Revisado",
    "description": "Mapeamento topográfico da área sul para análise de terreno.",
    "status": "planned",
    "plannedStartTime": "2025-04-26T10:00:00.000Z",
    "plannedEndTime": "2025-04-26T12:30:00.000Z",
    "updatedAt": "2025-04-25T11:00:00.000Z"
  }
}
```

#### Excluir Missão

```
DELETE /missions/:id
```

Remove uma missão do sistema.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {}
}
```

#### Iniciar Missão

```
POST /missions/:id/start
```

Inicia a execução de uma missão planejada.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c91",
    "name": "Mapeamento Área Sul - Revisado",
    "status": "in_progress",
    "actualStartTime": "2025-04-26T10:05:00.000Z",
    "updatedAt": "2025-04-26T10:05:00.000Z"
  }
}
```

#### Abortar Missão

```
POST /missions/:id/abort
```

Aborta uma missão em andamento.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c91",
    "name": "Mapeamento Área Sul - Revisado",
    "status": "aborted",
    "actualEndTime": "2025-04-26T10:35:00.000Z",
    "updatedAt": "2025-04-26T10:35:00.000Z"
  }
}
```

#### Concluir Missão

```
POST /missions/:id/complete
```

Marca uma missão como concluída.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610c91",
    "name": "Mapeamento Área Sul - Revisado",
    "status": "completed",
    "actualEndTime": "2025-04-26T12:15:00.000Z",
    "updatedAt": "2025-04-26T12:15:00.000Z"
  }
}
```

### Relatórios

#### Listar Relatórios

```
GET /reports
```

Retorna a lista de relatórios disponíveis.

**Parâmetros de Consulta:**
- `type` (opcional): Filtrar por tipo (ex: mission,fleet,maintenance)
- `page` (opcional): Número da página para paginação
- `limit` (opcional): Número de itens por página

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "60d21b4667d0d8992e610d00",
      "type": "mission",
      "title": "Relatório de Missão - Inspeção Perímetro Norte",
      "generatedAt": "2025-04-25T10:15:00.000Z",
      "generatedBy": "60d21b4667d0d8992e610c85",
      "downloadUrl": "/reports/mission_report_1.json",
      "size": "245 KB"
    },
    // ... mais relatórios
  ]
}
```

#### Obter Relatório

```
GET /reports/:id
```

Retorna os detalhes de um relatório específico.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610d00",
    "type": "mission",
    "title": "Relatório de Missão - Inspeção Perímetro Norte",
    "mission": {
      "id": "60d21b4667d0d8992e610c90",
      "name": "Inspeção Perímetro Norte"
    },
    "content": {
      "summary": {
        "status": "completed",
        "duration": "1h 55m",
        "distance": "12.5 km",
        "batteryUsed": "45%"
      },
      "waypoints": {
        "total": 12,
        "completed": 12
      },
      "telemetry": {
        // ... dados de telemetria
      }
    },
    "generatedAt": "2025-04-25T10:15:00.000Z",
    "generatedBy": {
      "id": "60d21b4667d0d8992e610c85",
      "name": "Administrador"
    },
    "downloadUrl": "/reports/mission_report_1.json",
    "size": "245 KB"
  }
}
```

#### Gerar Relatório de Missão

```
POST /reports/mission/:missionId
```

Gera um novo relatório para uma missão específica.

**Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610d01",
    "type": "mission",
    "title": "Relatório de Missão - Mapeamento Área Sul",
    "mission": {
      "id": "60d21b4667d0d8992e610c91",
      "name": "Mapeamento Área Sul - Revisado"
    },
    "generatedAt": "2025-04-26T12:30:00.000Z",
    "downloadUrl": "/reports/mission_report_2.json"
  }
}
```

#### Gerar Relatório de Frota

```
POST /reports/fleet
```

Gera um novo relatório sobre a frota de drones.

**Resposta de Sucesso (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "60d21b4667d0d8992e610d02",
    "type": "fleet",
    "title": "Relatório de Frota - Abril 2025",
    "generatedAt": "2025-04-26T14:30:00.000Z",
    "downloadUrl": "/reports/fleet_report_1.json"
  }
}
```

#### Excluir Relatório

```
DELETE /reports/:id
```

Remove um relatório do sistema.

**Resposta de Sucesso (200 OK):**
```json
{
  "success": true,
  "data": {}
}
```

## Códigos de Status

- `200 OK`: Requisição bem-sucedida
- `201 Created`: Recurso criado com sucesso
- `400 Bad Request`: Parâmetros inválidos ou ausentes
- `401 Unauthorized`: Autenticação necessária ou inválida
- `403 Forbidden`: Sem permissão para acessar o recurso
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro no servidor

## Paginação

Endpoints que retornam listas de recursos suportam paginação através dos parâmetros `page` e `limit`. A resposta inclui informações de paginação:

```json
{
  "pagination": {
    "next": {
      "page": 2,
      "limit": 10
    },
    "prev": {
      "page": 0,
      "limit": 10
    }
  }
}
```

## Filtros

Muitos endpoints suportam filtragem através de parâmetros de consulta. Por exemplo:

- `/api/drones?status=active,flying`: Retorna apenas drones com status "active" ou "flying"
- `/api/missions?droneId=60d21b4667d0d8992e610c85`: Retorna apenas missões associadas ao drone especificado

## Erros

Em caso de erro, a API retorna uma resposta com o seguinte formato:

```json
{
  "success": false,
  "error": "Mensagem de erro",
  "code": "ERROR_CODE"
}
```
