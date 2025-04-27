# Manual do Usuário - DroneFleet Monitor

Este manual fornece instruções detalhadas sobre como utilizar o sistema DroneFleet Monitor para gerenciamento, monitoramento e controle de frotas de drones.

## Índice

1. [Introdução](#introdução)
2. [Primeiros Passos](#primeiros-passos)
3. [Dashboard](#dashboard)
4. [Gestão de Drones](#gestão-de-drones)
5. [Gestão de Missões](#gestão-de-missões)
6. [Relatórios e Análises](#relatórios-e-análises)
7. [Administração](#administração)
8. [Solução de Problemas](#solução-de-problemas)

## Introdução

DroneFleet Monitor é uma aplicação completa para gerenciamento de frotas de drones, oferecendo monitoramento em tempo real, planejamento de missões, análise de dados e controle remoto. A aplicação foi projetada para ser intuitiva e eficiente, permitindo que você gerencie sua frota de drones com facilidade e segurança.

## Primeiros Passos

### Acesso ao Sistema

1. Abra seu navegador e acesse o endereço fornecido pelo administrador do sistema
2. Na página de login, insira seu email e senha
3. Clique no botão "Entrar"

### Recuperação de Senha

Se você esqueceu sua senha:

1. Na página de login, clique em "Esqueceu sua senha?"
2. Insira seu email e clique em "Enviar instruções"
3. Verifique seu email para instruções de redefinição de senha
4. Siga o link fornecido e defina uma nova senha

### Interface do Usuário

A interface do DroneFleet Monitor é composta por:

- **Barra de Navegação**: Acesso rápido às principais seções do sistema
- **Menu de Usuário**: Acesso ao perfil, configurações e opção de logout
- **Área de Conteúdo**: Exibe a seção atual do sistema
- **Notificações**: Alertas e mensagens importantes do sistema

## Dashboard

O Dashboard é a página inicial do sistema, fornecendo uma visão geral da sua frota de drones e missões ativas.

### Componentes do Dashboard

- **Estatísticas**: Resumo dos principais indicadores (drones ativos, missões em andamento, etc.)
- **Mapa de Operações**: Visualização geográfica dos drones ativos
- **Drones Ativos**: Lista dos drones atualmente em operação
- **Missões Recentes**: Lista das missões mais recentes

### Mapa de Operações

O mapa interativo mostra a localização em tempo real dos drones:

- **Marcadores Coloridos**: Indicam o status de cada drone
  - Verde: Ativo
  - Azul: Em voo
  - Amarelo: Em manutenção
  - Roxo: Carregando
  - Vermelho: Erro
- **Popups**: Clique em um drone para ver detalhes como bateria, altitude e velocidade
- **Controles de Zoom**: Use os botões + e - para ajustar o zoom do mapa
- **Modo Tela Cheia**: Clique no ícone de tela cheia para expandir o mapa

## Gestão de Drones

A seção de Gestão de Drones permite cadastrar, monitorar e gerenciar todos os drones da sua frota.

### Listar Drones

A página principal de Gestão de Drones exibe uma tabela com todos os drones cadastrados:

- **Filtros**: Use os filtros para encontrar drones específicos
- **Pesquisa**: Busque drones por nome, número de série ou modelo
- **Ordenação**: Clique nos cabeçalhos das colunas para ordenar a tabela

### Adicionar Novo Drone

Para adicionar um novo drone:

1. Clique no botão "Novo Drone"
2. Preencha o formulário com as informações do drone:
   - Nome
   - Número de série
   - Modelo
   - Sensores disponíveis
3. Clique em "Salvar"

### Detalhes do Drone

Para visualizar detalhes de um drone:

1. Clique no ícone de visualização na linha do drone
2. A página de detalhes mostra:
   - Informações básicas
   - Histórico de manutenção
   - Histórico de missões
   - Telemetria em tempo real (se ativo)

### Telemetria em Tempo Real

A seção de telemetria exibe dados em tempo real do drone:

- **Status**: Estado atual do drone
- **Bateria**: Nível de carga da bateria
- **Coordenadas**: Posição geográfica atual
- **Altitude**: Altura em relação ao nível do mar
- **Velocidade**: Velocidade atual
- **Direção**: Orientação do drone

### Comandos Remotos

Se o drone estiver ativo, você pode enviar comandos remotos:

- **Decolar**: Inicia o voo do drone
- **Pousar**: Comanda o drone a pousar
- **Retornar**: Comanda o drone a retornar ao ponto de partida
- **Parada Emergencial**: Interrompe imediatamente a operação do drone

### Editar Drone

Para editar as informações de um drone:

1. Clique no ícone de edição na linha do drone
2. Modifique as informações necessárias
3. Clique em "Salvar"

### Excluir Drone

Para remover um drone do sistema:

1. Clique no ícone de exclusão na linha do drone
2. Confirme a exclusão na caixa de diálogo

## Gestão de Missões

A seção de Gestão de Missões permite planejar, executar e monitorar missões para seus drones.

### Listar Missões

A página principal de Gestão de Missões exibe uma tabela com todas as missões:

- **Filtros**: Use os filtros para encontrar missões específicas
- **Pesquisa**: Busque missões por nome, descrição ou drone
- **Ordenação**: Clique nos cabeçalhos das colunas para ordenar a tabela

### Criar Nova Missão

Para criar uma nova missão:

1. Clique no botão "Nova Missão"
2. Preencha o formulário com as informações da missão:
   - Nome
   - Descrição
   - Drone designado
   - Data e hora planejadas
   - Waypoints (pontos de passagem)
3. Clique em "Salvar"

### Planejador de Waypoints

O planejador de waypoints permite definir a rota da missão:

1. Clique no mapa para adicionar um waypoint
2. Arraste os waypoints para ajustar suas posições
3. Clique em um waypoint para definir:
   - Altitude
   - Ação a ser executada (foto, vídeo, etc.)
   - Tempo de espera

### Detalhes da Missão

Para visualizar detalhes de uma missão:

1. Clique no ícone de visualização na linha da missão
2. A página de detalhes mostra:
   - Informações básicas
   - Drone designado
   - Waypoints planejados
   - Status atual
   - Progresso (se em andamento)

### Monitoramento de Missão

Durante uma missão em andamento, você pode monitorar:

- **Progresso**: Percentual de conclusão da missão
- **Telemetria do Drone**: Dados em tempo real do drone
- **Waypoints Concluídos**: Lista de waypoints já visitados
- **Tempo Restante**: Estimativa de tempo para conclusão

### Controle de Missão

Dependendo do status da missão, você pode:

- **Iniciar**: Começa a execução de uma missão planejada
- **Abortar**: Interrompe uma missão em andamento
- **Concluir**: Marca uma missão como concluída manualmente
- **Gerar Relatório**: Cria um relatório detalhado da missão

### Editar Missão

Para editar uma missão:

1. Clique no ícone de edição na linha da missão
2. Modifique as informações necessárias
3. Clique em "Salvar"

Nota: Missões em andamento ou concluídas não podem ser editadas.

### Excluir Missão

Para remover uma missão do sistema:

1. Clique no ícone de exclusão na linha da missão
2. Confirme a exclusão na caixa de diálogo

## Relatórios e Análises

A seção de Relatórios e Análises permite gerar e visualizar relatórios detalhados sobre suas operações.

### Listar Relatórios

A página principal de Relatórios exibe uma lista de todos os relatórios disponíveis:

- **Filtros**: Use os filtros para encontrar relatórios específicos
- **Pesquisa**: Busque relatórios por título ou autor
- **Ordenação**: Organize por data ou tipo

### Tipos de Relatórios

O sistema oferece três tipos principais de relatórios:

- **Relatório de Missão**: Detalhes sobre uma missão específica
- **Relatório de Frota**: Visão geral da frota de drones
- **Relatório de Manutenção**: Histórico e programação de manutenções

### Gerar Novo Relatório

Para gerar um novo relatório:

1. Clique no botão "Novo Relatório"
2. Selecione o tipo de relatório
3. Configure os parâmetros específicos
4. Clique em "Gerar"

### Visualizar Relatório

Para visualizar um relatório:

1. Clique no botão "Visualizar" na linha do relatório
2. O relatório será exibido com todas as informações, gráficos e tabelas

### Download de Relatório

Para baixar um relatório:

1. Clique no botão "Download" na linha do relatório
2. O arquivo será baixado no formato especificado (JSON, PDF, etc.)

### Excluir Relatório

Para remover um relatório do sistema:

1. Clique no botão "Excluir" na linha do relatório
2. Confirme a exclusão na caixa de diálogo

## Administração

A seção de Administração permite gerenciar usuários e visualizar logs do sistema.

### Gestão de Usuários

A aba de Usuários permite:

- **Listar Usuários**: Visualizar todos os usuários cadastrados
- **Adicionar Usuário**: Criar novos usuários
- **Editar Usuário**: Modificar informações de usuários existentes
- **Ativar/Desativar**: Controlar o acesso de usuários ao sistema

### Adicionar Novo Usuário

Para adicionar um novo usuário:

1. Clique no botão "Novo Usuário"
2. Preencha o formulário com as informações do usuário:
   - Nome
   - Email
   - Papel (Administrador, Operador, Observador)
3. Clique em "Salvar"

### Papéis de Usuário

O sistema possui três níveis de acesso:

- **Administrador**: Acesso completo a todas as funcionalidades
- **Operador**: Pode gerenciar drones e missões, mas não usuários
- **Observador**: Apenas visualização, sem permissão para modificar dados

### Logs de Auditoria

A aba de Logs de Auditoria permite:

- **Visualizar Ações**: Acompanhar todas as ações realizadas no sistema
- **Filtrar por Usuário**: Ver ações de um usuário específico
- **Filtrar por Tipo**: Ver ações de um tipo específico
- **Filtrar por Data**: Ver ações em um período específico

## Solução de Problemas

### Problemas Comuns

#### Drone não aparece no mapa

- Verifique se o drone está ativo
- Verifique se o drone tem coordenadas válidas
- Atualize a página para recarregar os dados

#### Missão não inicia

- Verifique se o drone designado está disponível
- Verifique se o drone tem bateria suficiente
- Verifique se todos os waypoints são válidos

#### Erro ao gerar relatório

- Verifique se a missão foi concluída
- Verifique se há dados suficientes para o relatório
- Tente novamente após alguns minutos

### Suporte Técnico

Se você encontrar problemas que não consegue resolver:

1. Verifique a documentação técnica
2. Contate o administrador do sistema
3. Envie um email para suporte@dronefleet.com com detalhes do problema
