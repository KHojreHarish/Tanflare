# Production Deployment Guide

This guide will help you deploy your Tanflare template to production with confidence.

## 🚀 Pre-Deployment Checklist

### **1. Environment Configuration**

#### **Required Environment Variables**

```bash
# Authentication
BETTER_AUTH_SECRET=your-production-secret-32-chars-min
BETTER_AUTH_URL=https://yourdomain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Optional)
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# Environment
NODE_ENV=production
```

#### **Generate Production Secrets**

```bash
# Generate a secure auth secret
openssl rand -base64 32

# Generate a secure session secret
openssl rand -base64 64
```

### **2. Database Setup**

#### **Create Production D1 Database**

```bash
# Create production database
npx wrangler d1 create tanflare-production

# Run migrations
npx wrangler d1 migrations apply tanflare-production --local
npx wrangler d1 migrations apply tanflare-production
```

#### **Update wrangler.jsonc**

```json
{
  "env": {
    "production": {
      "name": "tanflare-production",
      "vars": {
        "BETTER_AUTH_URL": "https://yourdomain.com",
        "RESEND_FROM_EMAIL": "noreply@yourdomain.com"
      },
      "d1_databases": [
        {
          "binding": "DB",
          "database_name": "tanflare-production",
          "database_id": "your-production-database-id"
        }
      ]
    }
  }
}
```

### **3. Security Configuration**

#### **Update Security Headers**

```typescript
// src/config/security.ts
export function createSecurityConfig(nonce: string): SecurityConfig {
  const isDev = process.env.NODE_ENV === 'development'

  return {
    csp: {
      // Production: Strict CSP
      scriptSrc: isDev
        ? ["'self'", "'unsafe-inline'"]
        : ["'self'", `'nonce-${nonce}'`],
      styleSrc: isDev
        ? ["'self'", "'unsafe-inline'"]
        : ["'self'", `'nonce-${nonce}'`],
      // ... rest of config
    },
  }
}
```

#### **Enable HTTPS**

- Ensure your domain has SSL certificate
- Configure HSTS headers
- Set up proper CORS policies

### **4. Cloudflare Configuration**

#### **Custom Domain Setup**

1. Add your domain to Cloudflare
2. Create CNAME record pointing to your worker
3. Enable SSL/TLS encryption
4. Configure Page Rules if needed

#### **Environment Variables in Cloudflare**

```bash
# Set production secrets
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put CLOUDINARY_API_SECRET
npx wrangler secret put RESEND_API_KEY
```

## 🚀 Deployment Steps

### **1. Build and Test Locally**

```bash
# Install dependencies
pnpm install

# Run type checking
pnpm run check

# Build for production
pnpm run build

# Test locally
pnpm run start
```

### **2. Deploy to Staging**

```bash
# Deploy to staging environment
pnpm run deploy:staging

# Test staging deployment
curl https://tanflare-staging.tasg.workers.dev/api/health
```

### **3. Deploy to Production**

```bash
# Deploy to production
pnpm run deploy:prod

# Verify deployment
curl https://yourdomain.com/api/health
```

## 🔍 Post-Deployment Verification

### **1. Health Checks**

```bash
# Check overall health
curl https://yourdomain.com/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "message": "All systems operational",
  "checks": {
    "database": "healthy",
    "cloudinary": "healthy",
    "resend": "healthy"
  },
  "version": "1.0.0",
  "environment": "production"
}
```

### **2. Security Headers**

```bash
# Check security headers
curl -I https://yourdomain.com

# Should include:
# Content-Security-Policy
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Strict-Transport-Security
```

### **3. Authentication Flow**

1. Visit `/auth` page
2. Test user registration
3. Test email verification
4. Test login/logout

### **4. Upload Functionality**

1. Visit `/upload` page
2. Test file upload
3. Verify Cloudinary integration
4. Test file validation

## 📊 Monitoring & Observability

### **1. Cloudflare Analytics**

- Monitor request volume
- Track error rates
- Analyze performance metrics

### **2. Application Monitoring**

```typescript
// Add to your app
import { init } from '@sentry/cloudflare-workers'

init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: 'production',
})
```

### **3. Database Monitoring**

- Monitor D1 database usage
- Set up alerts for high query times
- Track storage usage

## 🔧 Maintenance

### **1. Regular Updates**

```bash
# Update dependencies
pnpm update

# Check for security vulnerabilities
pnpm audit

# Run tests
pnpm test
```

### **2. Database Maintenance**

```bash
# Run new migrations
npx wrangler d1 migrations apply tanflare-production

# Backup database
npx wrangler d1 export tanflare-production --output backup.sql
```

### **3. Security Updates**

- Regularly update dependencies
- Monitor security advisories
- Review and update CSP policies
- Rotate secrets periodically

## 🚨 Troubleshooting

### **Common Issues**

#### **Database Connection Errors**

```bash
# Check database binding
npx wrangler d1 list

# Verify migrations
npx wrangler d1 migrations list tanflare-production
```

#### **Authentication Issues**

- Verify BETTER_AUTH_SECRET is set
- Check BETTER_AUTH_URL matches your domain
- Ensure email verification is working

#### **Upload Issues**

- Verify Cloudinary configuration
- Check upload preset settings
- Ensure CSP allows Cloudinary domains

#### **CSP Violations**

- Check browser console for violations
- Update CSP configuration
- Test with CSP reporting enabled

### **Debug Mode**

```bash
# Enable debug logging
npx wrangler dev --local --debug

# Check logs
npx wrangler tail
```

## 📈 Performance Optimization

### **1. Caching Strategy**

- Implement Redis for session storage
- Use Cloudflare Cache for static assets
- Add database query caching

### **2. CDN Configuration**

- Configure Cloudflare CDN
- Optimize image delivery
- Enable compression

### **3. Database Optimization**

- Add proper indexes
- Optimize queries
- Monitor query performance

## 🔒 Security Best Practices

### **1. Secrets Management**

- Use Cloudflare Workers secrets
- Rotate secrets regularly
- Never commit secrets to code

### **2. Access Control**

- Implement proper RBAC
- Use least privilege principle
- Regular access reviews

### **3. Monitoring**

- Set up security alerts
- Monitor for suspicious activity
- Regular security audits

## 📞 Support

If you encounter issues during deployment:

1. Check the troubleshooting section above
2. Review Cloudflare Workers logs
3. Test locally with production configuration
4. Check environment variable configuration

## 🎉 Success!

Once deployed, your Tanflare template will be:

- ✅ Production-ready with enterprise security
- ✅ Scalable on Cloudflare's global network
- ✅ Type-safe with full TypeScript support
- ✅ Monitored with comprehensive health checks
- ✅ Maintainable with proper error handling

Your template is now ready for production use! 🚀
