# Deployment Guide - Quantum Read Flow

This guide covers production deployment strategies for the Quantum Read Flow blog platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Domain name (optional)

### Environment Setup

1. **Create Production Environment Variables**
```bash
# Create .env.production
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
```

2. **Build for Production**
```bash
npm run build
npm run build:analyze  # Check bundle size
```

## 🌐 Deployment Platforms

### Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Configure vercel.json**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Configure _redirects**
```
/*    /index.html   200
/sw.js    /sw.js   200
```

3. **Configure netlify.toml**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Docker Deployment

1. **Create Dockerfile**
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**
```nginx
events {
  worker_connections 1024;
}

http {
  include /etc/nginx/mime.types;
  
  server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;
    
    # Service Worker
    location /sw.js {
      add_header Cache-Control "public, max-age=0, must-revalidate";
    }
    
    # Static assets
    location /static/ {
      add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # SPA routing
    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}
```

3. **Build and Run**
```bash
docker build -t quantum-read-flow .
docker run -p 80:80 quantum-read-flow
```

## 🔧 Production Optimizations

### 1. Performance Budget
```json
{
  "budget": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "5kb"
    }
  ]
}
```

### 2. CDN Configuration

#### Cloudflare
- Enable "Auto Minify" for CSS, JS, HTML
- Enable "Brotli" compression
- Set caching rules:
  - `/sw.js`: Cache level: Bypass
  - `/static/*`: Edge TTL: 1 month
  - `/*.html`: Edge TTL: 4 hours

#### AWS CloudFront
```json
{
  "DistributionConfig": {
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-quantum-read-flow",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    },
    "CacheBehaviors": [
      {
        "PathPattern": "/sw.js",
        "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad",
        "TTL": 0
      }
    ]
  }
}
```

### 3. Environment-Specific Builds

**Development**
```bash
npm run build:dev  # Source maps, detailed errors
```

**Staging**
```bash
VITE_ENVIRONMENT=staging npm run build
```

**Production**
```bash
VITE_ENVIRONMENT=production npm run build
```

## 📊 Monitoring & Analytics

### 1. Error Tracking
```typescript
// Add to App.tsx
import * as Sentry from "@sentry/react";

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: "YOUR_SENTRY_DSN",
    environment: import.meta.env.VITE_ENVIRONMENT,
  });
}
```

### 2. Performance Monitoring
```typescript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### 3. Analytics
```typescript
// Google Analytics 4
gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href,
});
```

## 🔒 Security

### 1. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://apis.google.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  connect-src 'self' https://your-supabase-url.supabase.co;
">
```

### 2. Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()";
```

## 🗄️ Database Migrations

### Pre-deployment Checklist
```bash
# 1. Backup production database
supabase db dump --db-url="$PROD_DATABASE_URL" > backup.sql

# 2. Test migrations on staging
supabase db push --db-url="$STAGING_DATABASE_URL"

# 3. Run tests against staging
npm run test:e2e -- --base-url="$STAGING_URL"

# 4. Deploy migrations to production
supabase db push --db-url="$PROD_DATABASE_URL"
```

## 🚀 CI/CD Pipeline

### GitHub Actions Deployment
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm run test:run
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📈 Performance Checklist

- [ ] Bundle size < 1MB initial
- [ ] First Contentful Paint < 2s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Service Worker registered
- [ ] Critical resources preloaded
- [ ] Images optimized and lazy-loaded
- [ ] Code splitting implemented
- [ ] Gzip/Brotli compression enabled
- [ ] CDN configured
- [ ] Database queries optimized

## 🔍 Troubleshooting

### Common Issues

1. **Service Worker not updating**
   - Clear browser cache
   - Check cache headers
   - Verify SW registration

2. **Build failures**
   - Check Node.js version
   - Clear node_modules and reinstall
   - Verify environment variables

3. **Performance issues**
   - Run bundle analyzer
   - Check network waterfall
   - Audit with Lighthouse

### Useful Commands
```bash
# Analyze bundle
npm run build:analyze

# Test production build locally
npm run preview

# Check for security vulnerabilities
npm audit

# Performance testing
npx lighthouse https://your-domain.com --view
```

## 📞 Support

For deployment issues:
1. Check GitHub Issues
2. Review deployment logs
3. Consult platform documentation
4. Contact platform support
