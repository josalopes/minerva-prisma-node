# ADR-001 – WakeupService para redução do impacto do Cold Start no Render

**Status:** Aceito

**Data:** 20/07/2026

---

# Contexto

A API do Minerva está hospedada no plano gratuito do Render, que suspende automaticamente o serviço após um período de inatividade.

Quando isso ocorre, a primeira requisição recebida precisa aguardar a inicialização completa da aplicação (cold start), incluindo:

- Inicialização do ambiente Node.js;
- Inicialização do Fastify;
- Conexão com o banco PostgreSQL (Neon);
- Carregamento da aplicação.

Durante os testes foi observado que esse processo pode ultrapassar 90 segundos.

Como consequência, a primeira tentativa de login frequentemente resultava em timeout da requisição.

Erro observado:

```text
TimeoutError:
Request timed out:
POST /sessions/password
```

---

# Problema

O usuário acessava a tela de login e imediatamente enviava suas credenciais.

Como a API ainda estava inicializando, o cliente encerrava a requisição antes que o backend estivesse disponível.

Isso gerava uma experiência ruim, apresentando mensagens genéricas de erro ou timeout.

---

# Objetivo

Reduzir o impacto percebido pelo usuário durante o cold start da API.

A estratégia escolhida foi antecipar o processo de inicialização da API antes da primeira ação do usuário.

---

# Solução adotada

Foi criado um componente denominado **WakeupService**.

Ao carregar a tela de login, o frontend realiza uma chamada ao endpoint:

```text
GET /health
```

O serviço permanece consultando o endpoint até que a API esteja disponível ou até que o tempo limite seja atingido.

Após receber uma resposta HTTP 200, o serviço marca a API como disponível e evita novas consultas desnecessárias durante aquela sessão.

---

# Implementação

O WakeupService possui as seguintes responsabilidades:

- executar chamadas ao endpoint `/health`;
- aguardar a disponibilidade da API;
- impedir múltiplas verificações simultâneas utilizando uma Promise compartilhada (`pending`);
- armazenar o estado de disponibilidade (`ready`) para evitar consultas repetidas.

Fluxo simplificado:

```text
Usuário abre tela de login
        │
        ▼
WakeupService.waitUntilReady()
        │
        ▼
GET /health
        │
        ├───────────────┐
        │               │
        ▼               ▼
200 OK            API indisponível
        │               │
        ▼               ▼
ready = true      nova tentativa
```

---

# Problemas encontrados durante a implementação

## 1. TimeoutError

Inicialmente acreditava-se que todas as falhas seriam retornadas como HTTPError pelo Ky.

Durante os testes foi identificado que, quando a API ainda está inicializando, o Ky lança:

```text
TimeoutError
```

Esse cenário exige tratamento específico para apresentar uma mensagem adequada ao usuário.

---

## 2. Configuração incorreta de CORS

Durante a validação do WakeupService foi identificado um erro de CORS.

O navegador registrava:

```text
Access to fetch at
https://minerva-psi-api.onrender.com/health

blocked by CORS policy
```

Após investigação foi constatado que a variável de ambiente:

```env
CORS_ORIGINS
```

estava configurada incorretamente no ambiente do Render.

Após corrigir a configuração e realizar novo deploy, o endpoint `/health` passou a responder normalmente.

---

# Resultados obtidos

Após a correção do CORS foi possível confirmar:

- execução automática do WakeupService ao abrir a tela de login;
- acesso bem-sucedido ao endpoint `/health`;
- atualização correta do estado `ready`;
- reutilização da Promise pendente (`pending`), evitando múltiplas chamadas simultâneas.

Exemplo de logs:

```text
[Wakeup] Iniciando wakeup...
[Wakeup] Aguardando wakeup pendente...
[Wakeup] Health: 200
[Wakeup] API disponível em 0.71s (1 tentativa(s)).
```

---

# Cenário ainda pendente

Permanece pendente a validação completa durante um cold start real do Render.

Os critérios de validação são:

- permitir que o serviço entre em suspensão naturalmente;
- abrir a tela de login;
- verificar se o WakeupService desperta a API antes da autenticação;
- comparar o tempo percebido pelo usuário com e sem o WakeupService.

---

# Consequências

## Benefícios

- reduz o impacto do cold start percebido pelo usuário;
- melhora a experiência durante a autenticação;
- evita múltiplas chamadas simultâneas ao endpoint `/health`;
- fornece uma base para futuras estratégias de disponibilidade da API.

## Desvantagens

- adiciona uma requisição HTTP ao carregar a tela de login;
- depende do endpoint `/health` permanecer disponível.

---

# Melhorias futuras

- substituir o estado permanente `ready` por um mecanismo de expiração (TTL);
- centralizar o tratamento de erros HTTP e Timeout em uma biblioteca compartilhada;
- avaliar a execução do WakeupService no servidor (Server Actions ou Route Handlers), eliminando dependências de CORS.

---

# Conclusão

A adoção do WakeupService mostrou-se uma solução simples e de baixo impacto para reduzir os efeitos do cold start do Render durante o processo de autenticação.

Embora a validação completa em um cenário real de suspensão da API ainda esteja pendente, os testes realizados confirmam o correto funcionamento da implementação e eliminam problemas relacionados à execução do serviço e à configuração de CORS.
