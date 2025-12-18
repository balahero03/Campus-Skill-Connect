# 🔧 OAuth Redirect Issue - SOLUTION

## ❌ **Problem**: Not redirecting to dashboard after Google login

## ✅ **SOLUTION - Follow These Steps:**

### **Step 1: Check Google OAuth Configuration in Supabase**

1. Go to: https://app.supabase.com/project/hwgwbnfxxgzoikxntyes
2. Click **"Authentication"** in left sidebar
3. Click **"URL Configuration"**
4. Make sure **Site URL** is set to:
   ```
   http://localhost:5173
   ```
5. Make sure **Redirect URLs** includes:
   ```
   http://localhost:5173/**
   http://localhost:5173/dashboard
   ```

### **Step 2: Configure Google Cloud Console**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized redirect URIs"**, add BOTH:
   ```
   https://hwgwbnfxxgzoikxntyes.supabase.co/auth/v1/callback
   http://localhost:5173/dashboard
   ```
4. Click **"Save"**

### **Step 3: Enable Google Provider in Supabase**

1. In Supabase dashboard: **Authentication** → **Providers**
2. Find **Google** and make sure it's **Enabled** (toggle ON)
3. Add your Google Client ID and Secret
4. Click **"Save"**

### **Step 4: Clear Browser Cache and Cookies**

```bash
# In your browser:
1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
2. Clear "Cookies and other site data"
3. Clear "Cached images and files"
4. Time range: "All time"
5. Click "Clear data"
```

### **Step 5: Restart Dev Server**

```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

### **Step 6: Test Again**

1. Open: http://localhost:5173
2. Click "Sign in with Google"
3. Select your Google account
4. Click "Continue"
5. **You should now be redirected to Dashboard!** ✅

---

## 🔍 **DEBUGGING - Check Browser Console**

1. Open browser console (F12)
2. Go to **Console** tab
3. Look for messages like:
   - "Auth state changed: SIGNED_IN"
   - "Creating user profile"
   - "User profile created successfully"

If you see these, the login is working!

---

## 📊 **VERIFY IN SUPABASE**

After login, check:

1. **Authentication** → **Users**
   - Your email should appear
   
2. **Table Editor** → **users**
   - Your profile should be created

---

## 🚨 **COMMON ISSUES**

### Issue 1: "Redirect URI mismatch"
**Fix**: Add `https://hwgwbnfxxgzoikxntyes.supabase.co/auth/v1/callback` to Google Cloud Console

### Issue 2: Stays on login page
**Fix**: Clear cookies and restart dev server

### Issue 3: Error in console
**Fix**: Make sure database schema is deployed (run supabase-schema.sql)

### Issue 4: "Invalid state" error
**Fix**: Make sure Site URL in Supabase matches your local dev URL

---

## ✅ **CORRECT URLS**

### In Google Cloud Console:
- Authorized JavaScript origins: `http://localhost:5173`
- Authorized redirect URIs:
  ```
  https://hwgwbnfxxgzoikxntyes.supabase.co/auth/v1/callback
  http://localhost:5173/dashboard
  ```

### In Supabase Dashboard:
- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**`

---

## 🎯 **WHAT SHOULD HAPPEN**

```
Click "Sign in with Google"
  ↓
Popup opens with Google sign-in
  ↓
Select Google account
  ↓
Click "Continue"
  ↓
Popup closes
  ↓
Browser shows loading screen
  ↓
Dashboard appears with "Hello, [Your Name]! 👋"
```

---

## 💡 **QUICK FIX**

If nothing works, try this:

1. **Stop dev server** (Ctrl+C)
2. **Clear browser completely** (private/incognito mode)
3. **Restart**: `npm run dev`
4. **Try login again**

---

**Still not working?** Check browser console for errors and share them!
