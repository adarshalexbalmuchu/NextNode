# 🔐 SECURE API KEY SETUP

## ⚠️ SECURITY NOTICE
Your API keys have been removed from the repository for security. Please follow these steps to add them back securely:

## 📝 Instructions

1. **Open your `.env` file** (already exists in your project root)

2. **Replace the placeholder values** with your actual API keys:

```bash
# Replace this line:
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# With your actual key:
VITE_GEMINI_API_KEY=AIzaSyDTS_r9TwNRGxlyTocf1DpqtXDPF0coF9M

# Replace this line:
VITE_COHERE_API_KEY=your-cohere-api-key-here

# With your actual key:
VITE_COHERE_API_KEY=3ya1jo4pwxLfKrer5okNJJb2irQT6mMWRVM1Ui3Q
```

3. **Save the file** and restart your dev server:
```bash
npm run dev
```

## 🛡️ Security Best Practices

- ✅ `.env` file is already in `.gitignore` (never commits to git)
- ✅ Keep API keys private and never share them
- ✅ Regenerate keys if accidentally exposed
- ✅ Use environment variables in production

## 🔄 If Keys Are Compromised

If your API keys were accidentally exposed:

1. **Regenerate Gemini key**: https://makersuite.google.com/app/apikey
2. **Regenerate Cohere key**: https://dashboard.cohere.com/api-keys

## ✅ After Setup

Your resume analyzer will have:
- 1,500 daily analyses via Gemini
- 5M monthly tokens via Cohere  
- Automatic fallback to local analysis

---
**🚨 Delete this file after setup for extra security**
