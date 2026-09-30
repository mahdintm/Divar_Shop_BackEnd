# Divar Shop BackEnd

## Overview

The backend service for the Divar Shop project, implemented with Node.js and Express.

The project uses MySQL for database access, JWT for token-based authentication, LDAP / Active Directory for LDAP authentication, and dotenv for environment-based configuration.

## Prerequisites

- Node.js
- npm
- MySQL
- LDAP / Active Directory access if LDAP authentication is used

## Installation

```bash
git clone https://github.com/mahdintm/Divar_Shop_BackEnd.git
cd Divar_Shop_BackEnd
npm install
```

## Environment configuration

Create a local environment file from the provided template:

```bash
cp .env.example .env
```

The environment variable names in `.env.example` are:

- `Host_MYSQL`
- `Username_MYSQL`
- `Password_MYSQL`
- `Database_MYSQL_Main`
- `Port_MYSQL`
- `TOKEN_KEY`
- `LDAP_URL`
- `LDAP_BASE_DN`
- `LDAP_BIND_DN`
- `LDAP_BIND_CREDENTIALS`
- `PORT`

Keep the actual values in your local environment configuration.

## Running

Development:

```bash
npm run dev
```

Production / normal start:

```bash
npm start
```

## Server port

The HTTP server reads the `PORT` environment variable. When it is not set, the server uses port `3001`.

## Project structure

- `app.js` — application entry point and HTTP server setup
- `router/` — application routes
- `db/` — database-related modules
- `ldap/` — LDAP / Active Directory integration
- `middleware/` — request middleware such as authentication
- `.env.example` — safe environment-variable template

## Security note

- Do not commit `.env`.
- Use `.env.example` as the configuration template.
- Supply secrets through environment configuration rather than source code.
