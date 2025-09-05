# 🔧 Quick Azure CLI Fix (Alternative Method)

If you have Azure CLI installed, you can fix the firewall issue with these commands:

## Install Azure CLI (if needed)

```bash
# macOS
brew install azure-cli

# Or download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
```

## Login and Fix Firewall

```bash
# Login to Azure
az login

# Get your current IP
YOUR_IP=$(curl -s ifconfig.me)
echo "Your IP: $YOUR_IP"

# Add firewall rule (replace YOUR_RESOURCE_GROUP with your actual resource group name)
az postgres server firewall-rule create \
  --resource-group YOUR_RESOURCE_GROUP \
  --server life-stream-postgres \
  --name AllowMyIP \
  --start-ip-address $YOUR_IP \
  --end-ip-address $YOUR_IP

# Enable Azure services access
az postgres server update \
  --resource-group YOUR_RESOURCE_GROUP \
  --name life-stream-postgres \
  --public all
```

## Find Your Resource Group

If you don't know your resource group name:

```bash
az postgres server list --query "[].{Name:name, ResourceGroup:resourceGroup, Location:location}"
```

## Test Connection After Fix

```bash
psql -h life-stream-postgres.postgres.database.azure.com -p 5432 -U lifestream_admin postgres
```

---

**Note**: Replace `YOUR_RESOURCE_GROUP` with your actual Azure resource group name where the PostgreSQL server is located.
