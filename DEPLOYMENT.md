# MASHUB Backend - Deployment Guide

Choose your preferred hosting platform below.

---

## 🚀 Quick Start (Local)

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start server
npm start
```

Access at `http://localhost:3000`

---

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker installed

### Build and Run
```bash
# Build image
docker build -t mashub-backend .

# Run container
docker run -p 3000:3000 -v $(pwd)/data:/app/data mashub-backend
```

### Using Docker Compose (Local Development)
```bash
docker-compose up --build
```

Access at `http://localhost:3000`

---

## ☁️ Cloud Platform Deployments

### Option 1: Railway.app (⭐ Recommended - Easy + Free Tier)

1. **Create account** at https://railway.app
2. **Connect GitHub** (or upload code)
3. **Create new project**
4. **Add service** → Select "Docker" or "Node.js"
5. **Configure environment:**
   - `NODE_ENV`: `production`
   - `PORT`: `3000` (Railway auto-assigns)
   - `CORS_ORIGIN`: Your frontend domain
   - `DATA_DIR`: `/data` (Railway provides persistent storage)

6. **Deploy:**
   ```bash
   npm install -g @railway/cli
   railway login
   railway up
   ```

**Data Persistence:** Railway provides volume support - your JSON data persists.

**Pricing:** Free tier with generous limits, pay-as-you-go after.

---

### Option 2: Render.com (Easy + Free Tier)

1. **Create account** at https://render.com
2. **Connect GitHub repository**
3. **Create new Web Service**
   - Build Command: `npm install`
   - Start Command: `npm start`

4. **Configure environment:**
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend domain

5. **Select Free Plan** (or paid)
6. **Deploy**

**Data Persistence:** Use Render Disk for /data folder (paid feature).
For free tier, consider migrating to MongoDB Atlas (see below).

**URL:** Render provides auto-generated URL like `mashub-backend.onrender.com`

---

### Option 3: MongoDB Atlas + Node.js (Better for scaling)

If you want to migrate away from JSON files:

1. **Create MongoDB Atlas account** (free tier available)
2. **Create database cluster**
3. **Update database.js** to use MongoDB instead of JSON

```javascript
// Replace JSON logic with MongoDB:
const mongoose = require('mongoose');

// Connect on startup
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
```

4. **Add to environment:**
   ```
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mashub
   ```

5. **Deploy to Railway/Render** as normal

---

### Option 4: Heroku (Classic - Paid)

1. **Create account** at https://heroku.com
2. **Install Heroku CLI**
3. **Login:**
   ```bash
   heroku login
   heroku create mashub-backend
   ```

4. **Set environment variables:**
   ```bash
   heroku config:set NODE_ENV=production CORS_ORIGIN=https://yourdomain.com
   ```

5. **Deploy:**
   ```bash
   git push heroku main
   ```

**Note:** Heroku removed free tier. Cheapest paid plans ~$7/month.

---

### Option 5: AWS / DigitalOcean / GCP (Advanced)

For advanced users:

**AWS:**
- Use EC2 + PM2 for process management
- Or use Elastic Beanstalk for automatic scaling
- Use RDS for database

**DigitalOcean:**
- Deploy to Droplet with Docker
- Use App Platform for managed hosting

**GCP:**
- Use Cloud Run (serverless, 2M requests/month free)
- Use Compute Engine for VMs

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Create `.env` file with production values
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CORS_ORIGIN` to your frontend domain
- [ ] Set up data persistence (volume/disk/database)
- [ ] Enable HTTPS/SSL
- [ ] Set up monitoring/logging
- [ ] Test health endpoint: `GET /api/health`
- [ ] Test attendance submission
- [ ] Set up backups for data

---

## 🔐 Production Environment Variables

```env
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://yourdomain.com
DATA_DIR=/data
```

---

## 📊 Monitoring

All platforms support monitoring:

**Railway:** Built-in logs and metrics
**Render:** Logs, metrics, uptime monitoring
**AWS/GCP:** CloudWatch, Stackdriver

Check health endpoint regularly:
```bash
curl https://your-backend.com/api/health
```

Should return: `{"status":"ok","timestamp":"2025-12-21T..."}`

---

## 🔄 CI/CD Integration

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          npm install -g @railway/cli
          railway up --service=mashub-backend
```

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### Data Not Persisting
Ensure data directory is mounted as a volume in Docker/hosting platform.

### CORS Errors
Check `CORS_ORIGIN` environment variable matches your frontend domain.

### Logs Not Showing
```bash
# Docker
docker logs <container-id>

# Heroku
heroku logs --tail

# Railway
railway logs
```

---

## 📚 Additional Resources

- [Express Deployment Guide](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Docker Node.js Guide](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

---

## Support

For issues:
1. Check `/api/health` endpoint
2. Review environment variables
3. Check server logs
4. Verify frontend `API_URL` points to correct backend

Happy deploying! 🚀
