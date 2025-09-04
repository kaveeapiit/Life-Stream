# Azure Migration Checklist for Life-Stream

## Pre-Migration Setup

### 1. Azure Account Preparation

- [ ] Azure subscription active
- [ ] Azure CLI installed locally
- [ ] Resource group created (`life-stream-rg`)

### 2. Code Preparation (✅ Completed)

- [x] GitHub Actions workflows created
- [x] Azure configuration files added
- [x] Environment templates created
- [x] Database configuration updated for Azure
- [x] Backend startup scripts added

## Database Migration

### 3. Azure Database for PostgreSQL

- [ ] PostgreSQL server created in Azure
- [ ] Firewall rules configured
- [ ] Database created
- [ ] Connection string obtained
- [ ] Local database exported
- [ ] Data imported to Azure PostgreSQL
- [ ] Database connection tested

## Backend Deployment

### 4. Azure App Service

- [ ] App Service Plan created
- [ ] Web App created
- [ ] Environment variables configured
- [ ] GitHub Actions secrets added (`AZURE_WEBAPP_PUBLISH_PROFILE`)
- [ ] Backend deployed via GitHub Actions
- [ ] Health check endpoint tested (`/`)
- [ ] API endpoints tested

## Frontend Deployment

### 5. Azure Static Web Apps

- [ ] Static Web App created
- [ ] GitHub repository connected
- [ ] Environment variables configured (`VITE_API_BASE_URL`)
- [ ] GitHub Actions secrets added (`AZURE_STATIC_WEB_APPS_API_TOKEN`)
- [ ] Frontend deployed via GitHub Actions
- [ ] Application accessible via Azure URL
- [ ] API connectivity verified

## Configuration and Testing

### 6. Environment Configuration

- [ ] Frontend environment variables set in Azure Static Web Apps
- [ ] Backend environment variables set in Azure App Service
- [ ] CORS configuration verified
- [ ] Session configuration tested
- [ ] SSL/HTTPS enforced

### 7. End-to-End Testing

- [ ] User registration/login tested
- [ ] Admin dashboard accessible
- [ ] Hospital dashboard accessible
- [ ] Blood donation flow tested
- [ ] Blood request flow tested
- [ ] Database operations working
- [ ] File uploads working (if any)

## Security and Performance

### 8. Security Configuration

- [ ] HTTPS enforced on both services
- [ ] Security headers configured
- [ ] Database SSL connections verified
- [ ] Session security configured
- [ ] Environment secrets secured

### 9. Performance Optimization

- [ ] Application Insights enabled
- [ ] Performance monitoring set up
- [ ] Error logging configured
- [ ] Resource usage monitored

## DNS and Domain (Optional)

### 10. Custom Domain Setup

- [ ] Custom domain for frontend configured
- [ ] Custom domain for backend configured (if needed)
- [ ] SSL certificates configured
- [ ] DNS records updated

## Monitoring and Maintenance

### 11. Monitoring Setup

- [ ] Application Insights configured
- [ ] Log Analytics workspace created
- [ ] Alerts configured for critical issues
- [ ] Budget alerts set up

### 12. Backup and Recovery

- [ ] Database backup strategy implemented
- [ ] Application backup verified
- [ ] Disaster recovery plan documented

## Final Steps

### 13. Migration Completion

- [ ] All functionality verified on Azure
- [ ] Performance benchmarks met
- [ ] User acceptance testing completed
- [ ] Documentation updated
- [ ] Team trained on Azure deployment

### 14. Decommissioning Old Services

- [ ] Railway database exported (final backup)
- [ ] Railway service stopped
- [ ] Vercel deployment disabled
- [ ] DNS updated to point to Azure
- [ ] Old services decommissioned

## Post-Migration Tasks

### 15. Ongoing Maintenance

- [ ] Regular security updates scheduled
- [ ] Performance monitoring established
- [ ] Backup verification routine set up
- [ ] Cost optimization review scheduled
- [ ] Documentation maintained

## Emergency Contacts and Resources

### Support Resources

- **Azure Support**: [Azure Support Portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)
- **Documentation**: [Azure App Service Docs](https://docs.microsoft.com/en-us/azure/app-service/)
- **Community**: [Azure Community Forums](https://docs.microsoft.com/en-us/answers/topics/azure.html)

### Important URLs (Update after deployment)

- **Frontend**: `https://your-static-web-app.azurestaticapps.net`
- **Backend**: `https://life-stream-backend.azurewebsites.net`
- **Database**: `life-stream-postgres.postgres.database.azure.com`

### Key Contact Information

- **Azure Subscription Admin**: [Your contact]
- **Development Team Lead**: [Your contact]
- **Database Administrator**: [Your contact]

## Cost Estimates

### Monthly Azure Costs (Estimated)

- **App Service (B1)**: ~$13-20 USD
- **Static Web Apps**: Free tier available
- **PostgreSQL (Basic)**: ~$25-35 USD
- **Application Insights**: Free tier available
- **Total Estimated**: ~$40-60 USD/month

_Note: Costs may vary based on usage and region. Use Azure Cost Calculator for precise estimates._

## Rollback Plan

### In Case of Issues

1. **Database**: Restore from backup
2. **Frontend**: Revert to previous GitHub commit
3. **Backend**: Revert to previous GitHub commit
4. **DNS**: Update records back to old services temporarily
5. **Monitoring**: Check Application Insights for error details

---

**Migration Progress**: **\_% Complete
**Target Go-Live Date**: ****\_******
**Assigned Engineer**: ****\_\_\_****

_This checklist should be reviewed and updated as the migration progresses._
