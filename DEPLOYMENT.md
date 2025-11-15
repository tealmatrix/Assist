# Deployment Guide

This guide will help you deploy your Personal Assistant App using cloud services.

## MongoDB Atlas Setup (Cloud Database)

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new project (e.g., "Personal Assistant")

### 2. Create a Free Cluster
1. Click "Build a Database"
2. Choose **FREE** M0 tier (512MB storage)
3. Select a cloud provider and region (choose one closest to you)
4. Name your cluster (e.g., "personal-assistant-cluster")
5. Click "Create"

### 3. Set Up Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password (save these!)
5. Set permissions to "Read and write to any database"
6. Click "Add User"

### 4. Set Up Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0) for now
   - For production, restrict to specific IPs
4. Click "Confirm"

### 5. Get Your Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
5. Replace `<password>` with your actual password
6. Add your database name: `mongodb+srv://username:password@cluster.xxxxx.mongodb.net/personal-assistant?retryWrites=true&w=majority`

### 6. Update Your .env File
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/personal-assistant?retryWrites=true&w=majority
```

## Deployment Options

### Option 1: Render (Recommended - Easiest)

**Backend Deployment (Free Tier Available)**

1. Go to https://render.com and sign up
2. Connect your GitHub account
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: personal-assistant-api
   - **Root Directory**: (leave blank)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add Environment Variables:
   - `MONGODB_URI`: (your Atlas connection string)
   - `PORT`: 5001
   - `NODE_ENV`: production
   - `EMAIL_HOST`: smtp.gmail.com
   - `EMAIL_PORT`: 587
   - `EMAIL_USER`: your-email@gmail.com
   - `EMAIL_PASSWORD`: your-app-password
   - `EMAIL_FROM`: your-email@gmail.com
7. Click "Create Web Service"
8. Copy your backend URL (e.g., `https://personal-assistant-api.onrender.com`)

**Frontend Deployment (Netlify)**

1. Update `client/package.json` proxy to your Render backend URL
2. Build the frontend: `cd client && npm run build`
3. Go to https://netlify.com and sign up
4. Drag and drop the `client/build` folder to Netlify
5. Your site is live!

**Note**: Render free tier may spin down after inactivity (takes ~30s to wake up)

### Option 2: Railway

**Backend Deployment (Free $5 credit/month)**

1. Go to https://railway.app and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy
5. Add Environment Variables in the "Variables" tab:
   - `MONGODB_URI`
   - `PORT`
   - `NODE_ENV`
   - `EMAIL_HOST`
   - `EMAIL_PORT`
   - `EMAIL_USER`
   - `EMAIL_PASSWORD`
   - `EMAIL_FROM`
6. Get your public URL from the "Settings" tab

**Frontend**: Same Netlify steps as Option 1

### Option 3: Full Stack on Vercel

1. Update your project structure to serve static files from backend
2. Add this to `server/index.js` before routes:
   ```javascript
   // Serve static files in production
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/build')));
     
     app.get('*', (req, res) => {
       res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
     });
   }
   ```
3. Deploy to Vercel

## Before Pushing to GitHub

### 1. Verify .gitignore
Ensure `.env` is listed in `.gitignore`:
```bash
cat .gitignore | grep ".env"
```

### 2. Update Environment Example
Make sure `.env.example` has all required variables (without real values)

### 3. Test Locally with Atlas
Update your local `.env` with MongoDB Atlas connection string and test:
```bash
npm run dev
```

### 4. Commit and Push
```bash
git add .
git commit -m "Add email sending and prepare for deployment"
git push origin main
```

## Important Notes

- **Never commit your `.env` file** - it contains secrets
- **MongoDB Atlas Free Tier**: 512MB storage, perfect for getting started
- **Render Free Tier**: Backend may sleep after 15 min of inactivity
- **Netlify**: Free for static sites
- **Alternative to email**: Use a service like SendGrid or Mailgun for production email sending

## Monitoring Your App

After deployment:
- Monitor MongoDB Atlas usage in the Atlas dashboard
- Check Render/Railway logs for backend errors
- Use Netlify's built-in analytics

## Cost Summary (Free Tiers)

- MongoDB Atlas: FREE (M0 - 512MB)
- Render: FREE (with sleep on inactivity)
- Railway: FREE ($5/month credit)
- Netlify: FREE (100GB bandwidth/month)
- Vercel: FREE (100GB bandwidth/month)

Total: **$0/month** for small-scale usage
