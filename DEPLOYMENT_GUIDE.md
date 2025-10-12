# 🚀 Deployment Guide - Next.js + FastAPI Palmistry App

## Architecture

```
Next.js Frontend (Vercel) ←→ FastAPI Backend (Railway/Render)
```

---

## Part 1: Deploy Backend (FastAPI + Python)

### Option A: Railway (Recommended - Easiest) 🚂

1. **Go to** [railway.app](https://railway.app)
2. **Sign up** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select** `uiux_palmistry` repository
5. **Settings**:
   - Root Directory: `/`
   - Build Command: `pip install -r requirements_api.txt`
   - Start Command: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`
6. **Add Environment Variables**:
   - `PORT=8000`
7. **Deploy!**
8. **Copy your Railway URL** (e.g., `https://yourapp.railway.app`)

### Option B: Render.com 🎨

1. **Go to** [render.com](https://render.com)
2. **Sign up** with GitHub
3. **New** → **Web Service**
4. **Connect** `uiux_palmistry` repository
5. **Settings**:
   - Name: `palmistry-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements_api.txt`
   - Start Command: `uvicorn api_server:app --host 0.0.0.0 --port $PORT`
6. **Instance Type**: Free
7. **Create Web Service**
8. **Copy your Render URL** (e.g., `https://palmistry-api.onrender.com`)

---

## Part 2: Deploy Frontend (Next.js)

### Deploy to Vercel ⚡

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign up** with GitHub
3. **New Project** → **Import** `palmistry-nextjs`
4. **Configure**:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: `.`
5. **Environment Variables**:
   - Add: `NEXT_PUBLIC_API_URL` = `YOUR_BACKEND_URL_FROM_STEP_1`
   - Example: `https://yourapp.railway.app`
6. **Deploy!**
7. **Done!** Your app is live at `https://yourapp.vercel.app`

---

## Part 3: Local Development

### 1. Start Backend (Terminal 1)

```bash
cd E:\Projects\uiux_palmistry
pip install -r requirements_api.txt
python api_server.py
```

Backend runs at: `http://localhost:8000`

### 2. Start Frontend (Terminal 2)

```bash
cd E:\Projects\palmistry-nextjs
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs at: `http://localhost:3000`

---

## ✅ Testing

1. Open `http://localhost:3000`
2. Upload a palm image
3. Click "Analyze Palm"
4. Wait 10-30 seconds
5. View results!

---

## 🎯 Benefits Over Streamlit

✅ **No flickering** - React only updates what changes
✅ **Faster UI** - No full page reruns
✅ **Professional design** - Modern, responsive UI
✅ **Better caching** - True browser caching
✅ **Scalable** - Can handle many users
✅ **Mobile-friendly** - Responsive design

---

## 📝 Notes

- **First deploy takes 5-10 min** (downloading PyTorch)
- **Railway free tier**: 500 hours/month
- **Render free tier**: Spins down after 15min inactivity
- **Vercel free tier**: Unlimited for personal projects

---

## 🆘 Troubleshooting

### Backend URL 404?
- Make sure backend is deployed and running
- Check the Railway/Render logs
- Verify the URL in `NEXT_PUBLIC_API_URL`

### CORS errors?
- Backend allows all origins by default
- In production, update `allow_origins` in `api_server.py` to your Vercel domain

### Slow processing?
- Normal! First request takes longer (model loading)
- Subsequent requests are faster
- Consider paid tier for better performance

