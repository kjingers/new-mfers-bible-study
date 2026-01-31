# Azure Deployment Guide

## Overview

This app is deployed to Azure using:
- **Azure Static Web Apps** (hosting + serverless functions)
- **Azure Cosmos DB** (database)
- **Azure SignalR Service** (real-time features)

All resources are in resource group: `rg-bible-study`

## Initial Setup (One-time)

### 1. Create Resource Group

```bash
az group create \
  --name rg-bible-study \
  --location eastus2
```

### 2. Create Cosmos DB Account

```bash
# Create Cosmos DB account (free tier)
az cosmosdb create \
  --name cosmos-bible-study \
  --resource-group rg-bible-study \
  --kind GlobalDocumentDB \
  --enable-free-tier true \
  --default-consistency-level Session

# Create database
az cosmosdb sql database create \
  --account-name cosmos-bible-study \
  --resource-group rg-bible-study \
  --name bible-study

# Create containers
az cosmosdb sql container create \
  --account-name cosmos-bible-study \
  --resource-group rg-bible-study \
  --database-name bible-study \
  --name studies \
  --partition-key-path /id

az cosmosdb sql container create \
  --account-name cosmos-bible-study \
  --resource-group rg-bible-study \
  --database-name bible-study \
  --name weeks \
  --partition-key-path /studyId

az cosmosdb sql container create \
  --account-name cosmos-bible-study \
  --resource-group rg-bible-study \
  --database-name bible-study \
  --name families \
  --partition-key-path /id

az cosmosdb sql container create \
  --account-name cosmos-bible-study \
  --resource-group rg-bible-study \
  --database-name bible-study \
  --name meals \
  --partition-key-path /weekId

az cosmosdb sql container create \
  --account-name cosmos-bible-study \
  --resource-group rg-bible-study \
  --database-name bible-study \
  --name rsvps \
  --partition-key-path /weekId

az cosmosdb sql container create \
  --account-name cosmos-bible-study \
  --resource-group rg-bible-study \
  --database-name bible-study \
  --name sessions \
  --partition-key-path /weekId
```

### 3. Create SignalR Service

```bash
az signalr create \
  --name signalr-bible-study \
  --resource-group rg-bible-study \
  --sku Free_F1 \
  --service-mode Serverless \
  --location eastus2
```

### 4. Create Static Web App

Use GitHub integration for automatic deployments:

```bash
az staticwebapp create \
  --name swa-bible-study \
  --resource-group rg-bible-study \
  --source https://github.com/kjingers/new-mfers-bible-study \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --api-location "api" \
  --output-location ".next" \
  --login-with-github
```

### 5. Configure Environment Variables

Get connection strings:

```bash
# Cosmos DB endpoint and key
az cosmosdb keys list \
  --name cosmos-bible-study \
  --resource-group rg-bible-study \
  --type keys

# SignalR connection string
az signalr key list \
  --name signalr-bible-study \
  --resource-group rg-bible-study
```

Set in Static Web App:

```bash
az staticwebapp appsettings set \
  --name swa-bible-study \
  --setting-names \
    COSMOS_ENDPOINT="https://cosmos-bible-study.documents.azure.com:443/" \
    COSMOS_KEY="your-key" \
    COSMOS_DATABASE="bible-study" \
    SIGNALR_CONNECTION_STRING="your-connection-string" \
    JWT_SECRET="your-secret-here"
```

## Deployment Process

Deployments are automatic via GitHub Actions:

1. Push to `main` branch
2. GitHub Actions workflow runs
3. Build Next.js app
4. Deploy to Azure Static Web Apps

### Manual Deployment

If needed:

```bash
# Build locally
npm run build

# Deploy using SWA CLI
npm install -g @azure/static-web-apps-cli
swa deploy .next --env production
```

## Monitoring

### View Logs

```bash
# Static Web App logs
az staticwebapp show \
  --name swa-bible-study \
  --resource-group rg-bible-study

# Stream function logs
func azure functionapp logstream swa-bible-study
```

### Cosmos DB Metrics

View in Azure Portal:
- Metrics → Request Units consumed
- Data Explorer → Query data

## Costs

| Resource | SKU | Monthly Cost |
|----------|-----|--------------|
| Static Web App | Free | $0 |
| Cosmos DB | Free tier | $0 (first 1000 RU/s) |
| SignalR | Free_F1 | $0 (20 concurrent connections) |
| **Total** | | **$0/month** |

## Troubleshooting

### Deployment Failures

1. Check GitHub Actions logs
2. Verify `staticwebapp.config.json` is correct
3. Check build output in `.next/`

### Database Connection Issues

1. Verify Cosmos DB firewall allows Azure services
2. Check connection string format
3. Verify container names match code

### SignalR Issues

1. Verify service mode is "Serverless"
2. Check CORS settings in SignalR
3. Verify connection string in app settings
