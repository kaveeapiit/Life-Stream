# Azure Portal Tutorial - Life-Stream Deployment

This comprehensive tutorial guides you through configuring Azure services via the Azure Portal web interface for deploying the Life-Stream application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Getting Started with Azure Portal](#getting-started-with-azure-portal)
3. [Setting Up Resource Group](#setting-up-resource-group)
4. [Configuring Azure Database for PostgreSQL](#configuring-azure-database-for-postgresql)
5. [Setting Up Azure App Service (Backend)](#setting-up-azure-app-service-backend)
6. [Configuring Azure Static Web Apps (Frontend)](#configuring-azure-static-web-apps-frontend)
7. [Environment Variables Configuration](#environment-variables-configuration)
8. [GitHub Integration Setup](#github-integration-setup)
9. [SSL and Custom Domains](#ssl-and-custom-domains)
10. [Monitoring and Diagnostics](#monitoring-and-diagnostics)
11. [Security Configuration](#security-configuration)
12. [Troubleshooting Common Issues](#troubleshooting-common-issues)

---

## Prerequisites

Before starting this tutorial, ensure you have:

- ✅ Azure account with active subscription
- ✅ GitHub account with your Life-Stream repository
- ✅ Local database backup ready for migration
- ✅ Domain name (optional, for custom domains)

---

## Getting Started with Azure Portal

### 1. Accessing Azure Portal

1. **Open your web browser** and navigate to [https://portal.azure.com](https://portal.azure.com)
2. **Sign in** with your Azure account credentials
3. **Verify your subscription** is active in the top-right corner

![Azure Portal Dashboard](https://docs.microsoft.com/en-us/azure/azure-portal/media/azure-portal-overview/azure-portal-overview-portal-callouts.png)

### 2. Understanding the Azure Portal Interface

- **🏠 Home**: Main dashboard with quick access to resources
- **📋 All services**: Complete list of Azure services
- **⭐ Favorites**: Quick access to frequently used services
- **🔍 Search bar**: Global search for resources and services
- **🔔 Notifications**: Updates and alerts about your resources

---

## Setting Up Resource Group

A Resource Group is a logical container for all your Life-Stream resources.

### Step 1: Create Resource Group

1. **Click on "Resource groups"** in the Azure Portal home page

   - Or search for "Resource groups" in the search bar

2. **Click "+ Create"** button

3. **Fill in the details:**

   ```
   Subscription: [Your subscription]
   Resource group: life-stream-rg
   Region: East US (or your preferred region)
   ```

4. **Add tags (optional but recommended):**

   ```
   Project: Life-Stream
   Environment: Production
   Owner: [Your name/team]
   ```

5. **Click "Review + Create"** then **"Create"**

### Step 2: Verify Resource Group Creation

- Wait for deployment notification
- Navigate to "Resource groups" to see your new resource group
- Click on "life-stream-rg" to access the resource group dashboard

---

## Configuring Azure Database for PostgreSQL

### Step 1: Create PostgreSQL Server

1. **In your resource group**, click **"+ Create"**

2. **Search for "Azure Database for PostgreSQL"**

3. **Select "Azure Database for PostgreSQL flexible server"**

4. **Click "Create"**

### Step 2: Configure Basic Settings

**Basics Tab:**

```
Resource group: life-stream-rg
Server name: life-stream-postgres
Region: East US (same as resource group)
PostgreSQL version: 13 (recommended)
Workload type: Development
```

**Authentication:**

```
Authentication method: PostgreSQL authentication only
Admin username: lifestream_admin
Password: [Create strong password - save this!]
Confirm password: [Repeat password]
```

### Step 3: Configure Networking

**Networking Tab:**

1. **Connectivity method**: Select "Public access (allowed IP addresses)"

2. **Firewall rules**:

   - ✅ Check "Allow public access from any Azure service within Azure"
   - ✅ Add your current IP address

3. **Click "Add current client IP address"** to allow your local machine

### Step 4: Configure Security (Optional)

**Security Tab:**

- **Microsoft Defender for PostgreSQL**: Enable (recommended for production)

### Step 5: Additional Settings

**Additional settings Tab:**

```
Database name: life-stream
Character set: Default
Collation: Default
```

### Step 6: Review and Create

1. **Click "Review + Create"**
2. **Verify all settings**
3. **Click "Create"**
4. **Wait for deployment** (5-10 minutes)

### Step 7: Get Connection Information

1. **Navigate to your PostgreSQL server** in the resource group
2. **Click "Connection strings"** in the left menu
3. **Copy the Node.js connection string** - you'll need this later
4. **Replace the password placeholder** with your actual password

**Example connection string:**

```
postgresql://lifestream_admin:YourPassword@life-stream-postgres.postgres.database.azure.com:5432/life-stream?sslmode=require
```

---

## Setting Up Azure App Service (Backend)

### Step 1: Create App Service Plan

1. **In your resource group**, click **"+ Create"**
2. **Search for "App Service Plan"**
3. **Click "Create"**

**Configure the plan:**

```
Resource Group: life-stream-rg
Name: life-stream-plan
Operating System: Linux
Region: East US
Pricing Tier: Basic B1 (recommended for small apps)
```

4. **Click "Review + Create"** then **"Create"**

### Step 2: Create App Service (Web App)

1. **In your resource group**, click **"+ Create"**
2. **Search for "Web App"**
3. **Click "Create"**

**Basics Tab:**

```
Resource Group: life-stream-rg
Name: life-stream-backend (must be globally unique)
Publish: Code
Runtime stack: Node 18 LTS
Operating System: Linux
Region: East US
App Service Plan: life-stream-plan
```

**Monitoring Tab:**

- **Application Insights**: Yes
- **Application Insights Name**: life-stream-insights

4. **Click "Review + Create"** then **"Create"**

### Step 3: Configure App Service Settings

1. **Navigate to your App Service** (life-stream-backend)

2. **Go to "Configuration"** in the left menu

3. **Click "New application setting"** for each environment variable:

   **Required Environment Variables:**

   ```
   NODE_ENV = production
   PORT = 8080
   DATABASE_URL = [Your PostgreSQL connection string from above]
   SESSION_SECRET = [Generate a secure random string]
   FRONTEND_URL = https://life-stream-frontend.azurestaticapps.net
   ```

   **How to add each variable:**

   - Click "New application setting"
   - Enter Name and Value
   - Click "OK"
   - Repeat for all variables

4. **Click "Save"** at the top to apply changes

### Step 4: Configure Deployment

**Option A: GitHub Actions (Recommended)**

1. **Go to "Deployment Center"** in the left menu
2. **Source**: Select "GitHub"
3. **Sign in to GitHub** when prompted
4. **Organization**: Select your GitHub username
5. **Repository**: Select "Life-Stream"
6. **Branch**: main
7. **Runtime stack**: Node 18 LTS
8. **Workflow Option**: Add a workflow
9. **Authentication type**: User-assigned identity
10. **Click "Save"**

This will automatically:

- Create a GitHub Actions workflow file
- Add deployment secrets to your GitHub repository
- Set up automatic deployments on code push

**Option B: Local Git (Alternative)**

1. **Go to "Deployment Center"**
2. **Source**: Select "Local Git"
3. **Click "Save"**
4. **Copy the Git clone URL** for manual deployment

---

## Configuring Azure Static Web Apps (Frontend)

### Step 1: Create Static Web App

1. **In your resource group**, click **"+ Create"**
2. **Search for "Static Web App"**
3. **Click "Create"**

### Step 2: Configure Basic Settings

**Basics Tab:**

```
Resource Group: life-stream-rg
Name: life-stream-frontend
Plan type: Free (for development) or Standard (for production)
Region: East US 2
```

**Deployment details:**

```
Source: GitHub
GitHub account: [Sign in to GitHub]
Organization: [Your GitHub username]
Repository: Life-Stream
Branch: main
Build Presets: React
App location: / (root)
Api location: (leave empty)
Output location: dist
```

3. **Click "Review + Create"** then **"Create"**

### Step 3: Configure Environment Variables

1. **Navigate to your Static Web App** (life-stream-frontend)
2. **Go to "Configuration"** in the left menu
3. **Click "Add"** under Application settings

**Add this environment variable:**

```
Name: VITE_API_BASE_URL
Value: https://life-stream-backend.azurewebsites.net
Environment: Production
```

4. **Click "OK"** then **"Save"**

### Step 4: Get Deployment Token

1. **Go to "Overview"** in your Static Web App
2. **Click "Manage deployment token"**
3. **Copy the deployment token** - you'll need this for GitHub Actions

---

## Environment Variables Configuration

### Backend Environment Variables (App Service)

Navigate to **App Service → Configuration → Application settings**

| Name             | Value                                                   | Description                 |
| ---------------- | ------------------------------------------------------- | --------------------------- |
| `NODE_ENV`       | `production`                                            | Runtime environment         |
| `PORT`           | `8080`                                                  | Port number (Azure default) |
| `DATABASE_URL`   | `postgresql://user:pass@server:5432/db?sslmode=require` | Database connection         |
| `SESSION_SECRET` | `[64-character random string]`                          | Session encryption key      |
| `FRONTEND_URL`   | `https://life-stream-frontend.azurestaticapps.net`      | Frontend domain for CORS    |

**Generate a secure session secret:**

```bash
# Use this command locally to generate a secure secret:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Frontend Environment Variables (Static Web App)

Navigate to **Static Web App → Configuration → Application settings**

| Name                | Value                                           | Environment |
| ------------------- | ----------------------------------------------- | ----------- |
| `VITE_API_BASE_URL` | `https://life-stream-backend.azurewebsites.net` | Production  |

---

## GitHub Integration Setup

### Step 1: Repository Secrets Configuration

1. **Go to your GitHub repository** (Life-Stream)
2. **Navigate to Settings → Secrets and variables → Actions**
3. **Click "New repository secret"**

**Add these secrets:**

1. **AZURE_WEBAPP_PUBLISH_PROFILE**

   - In Azure Portal: App Service → Overview → Get publish profile
   - Download the .publishsettings file
   - Open file in text editor and copy entire contents
   - Paste as secret value

2. **AZURE_STATIC_WEB_APPS_API_TOKEN**
   - Use the deployment token from Static Web App setup
   - Paste as secret value

### Step 2: Verify GitHub Actions Workflow

1. **Check if workflow files exist** in `.github/workflows/`
2. **If not present**, Azure should have created them automatically
3. **Manually trigger a deployment** by pushing code to main branch

**Monitor deployment:**

- GitHub: Actions tab in your repository
- Azure: Deployment Center in both App Service and Static Web App

---

## SSL and Custom Domains

### Step 1: Configure Custom Domain for Frontend

1. **In Static Web App**, go to **"Custom domains"**
2. **Click "Add"**
3. **Domain type**: Custom domain
4. **Domain name**: your-domain.com
5. **Validation method**: CNAME
6. **Follow DNS configuration instructions**
7. **Click "Validate and configure"**

### Step 2: Configure Custom Domain for Backend

1. **In App Service**, go to **"Custom domains"**
2. **Click "Add custom domain"**
3. **Domain**: api.your-domain.com
4. **Validation type**: Domain Ownership
5. **Follow DNS configuration instructions**
6. **Click "Validate"** then **"Add custom domain"**

### Step 3: SSL Certificate Configuration

**For Static Web App:**

- SSL is automatically configured by Azure

**For App Service:**

1. **Go to "TLS/SSL settings"**
2. **Click "Private Key Certificates (.pfx)"**
3. **Choose**: "Create App Service Managed Certificate"
4. **Select your custom domain**
5. **Click "Create"**

---

## Monitoring and Diagnostics

### Step 1: Application Insights Setup

1. **Navigate to Application Insights** (life-stream-insights)
2. **Go to "Overview"** to see the dashboard
3. **Copy the Connection String** from Essentials

### Step 2: Configure Backend Monitoring

1. **In App Service**, go to **"Application Insights"**
2. **Turn on Application Insights** if not already enabled
3. **Link to existing resource**: life-stream-insights

### Step 3: Set Up Alerts

1. **In Application Insights**, go to **"Alerts"**
2. **Click "Create alert rule"**

**Create alerts for:**

- **Server response time** > 5 seconds
- **Failed requests** > 10 in 5 minutes
- **Server exceptions** > 0

### Step 4: Log Analytics

1. **Go to "Log Analytics workspaces"**
2. **Create new workspace** (if not exists): life-stream-logs
3. **Link resources** to this workspace for centralized logging

---

## Security Configuration

### Step 1: App Service Security

1. **Navigate to App Service → Authentication**
2. **Configure identity provider** (optional)
3. **Go to "TLS/SSL settings"**
   - **HTTPS Only**: On
   - **Minimum TLS Version**: 1.2

### Step 2: Database Security

1. **In PostgreSQL server**, go to **"Connection security"**
2. **Verify SSL enforcement**: Enabled
3. **Configure firewall rules**:
   - Remove broad IP ranges
   - Add only specific IPs that need access

### Step 3: Static Web App Security

1. **Go to "Authentication"** in Static Web App
2. **Configure authentication providers** (optional)
3. **Set up role-based access** if needed

### Step 4: Network Security

**App Service:**

1. **Go to "Networking"**
2. **Configure "Access restrictions"**
3. **Add rules** to limit access by IP or Virtual Network

**Database:**

1. **Configure Private Endpoint** for enhanced security
2. **Use Virtual Network integration** for App Service

---

## Troubleshooting Common Issues

### Issue 1: Database Connection Failures

**Symptoms:**

- Backend returns 500 errors
- "Connection refused" in logs

**Solutions:**

1. **Check firewall rules** in PostgreSQL server
2. **Verify connection string** format
3. **Ensure SSL is properly configured**

**Debug steps:**

```
1. Go to App Service → Development Tools → Console
2. Test connection: node -e "console.log(process.env.DATABASE_URL)"
3. Check logs: App Service → Monitoring → Log stream
```

### Issue 2: CORS Errors

**Symptoms:**

- Frontend can't reach backend API
- Browser console shows CORS errors

**Solutions:**

1. **Verify FRONTEND_URL** environment variable in App Service
2. **Check Static Web App URL** is correct
3. **Ensure both HTTP and HTTPS** versions are handled

### Issue 3: Build Failures

**Symptoms:**

- GitHub Actions fail
- Deployment doesn't complete

**Solutions:**

1. **Check GitHub Actions logs** for specific errors
2. **Verify Node.js version** compatibility
3. **Check package.json** scripts

**Debug steps:**

```
1. GitHub → Actions → View failed workflow
2. Check build logs for error messages
3. Test locally: npm run build
4. Verify environment variables are set
```

### Issue 4: Static Web App Not Updating

**Symptoms:**

- Changes not reflected after deployment
- Old version still serving

**Solutions:**

1. **Check GitHub Actions** completed successfully
2. **Verify branch** is set to main
3. **Clear browser cache**
4. **Check build output** location is correct

### Issue 5: SSL Certificate Issues

**Symptoms:**

- Browser security warnings
- Certificate not trusted

**Solutions:**

1. **Verify DNS configuration** is correct
2. **Wait for certificate provisioning** (can take up to 24 hours)
3. **Check domain ownership** validation

---

## 🎯 Quick Reference Commands

### Get Resource Information

```bash
# List all resources in resource group
az resource list --resource-group life-stream-rg --output table

# Get App Service URL
az webapp show --resource-group life-stream-rg --name life-stream-backend --query defaultHostName

# Get Static Web App URL
az staticwebapp show --resource-group life-stream-rg --name life-stream-frontend --query defaultHostname
```

### Restart Services

```bash
# Restart App Service
az webapp restart --resource-group life-stream-rg --name life-stream-backend

# Get App Service logs
az webapp log tail --resource-group life-stream-rg --name life-stream-backend
```

---

## 📊 Cost Management

### Monitor Costs

1. **Go to "Cost Management + Billing"**
2. **Set up budgets** for your resource group
3. **Configure alerts** when costs exceed thresholds

### Optimize Costs

- **Scale down** App Service plan during low usage
- **Use Basic tier** for development environments
- **Monitor database usage** and scale accordingly
- **Set up auto-shutdown** for development resources

---

## 🔄 Next Steps After Deployment

1. **Test all functionality** end-to-end
2. **Set up monitoring dashboards**
3. **Configure backup strategies**
4. **Document your specific configuration**
5. **Train your team** on Azure management
6. **Set up staging environment** for testing

---

## 📞 Support Resources

- **Azure Documentation**: [docs.microsoft.com](https://docs.microsoft.com/azure/)
- **Azure Support**: Available in Azure Portal → Help + Support
- **Community Forums**: [Microsoft Q&A](https://docs.microsoft.com/answers/)
- **GitHub Issues**: For deployment-specific problems

---

**🎉 Congratulations!** You've successfully configured Azure Portal for Life-Stream deployment. Your application should now be running on enterprise-grade Azure infrastructure with proper monitoring, security, and scalability features.

Remember to regularly review and update your configuration as your application grows and requirements change.
