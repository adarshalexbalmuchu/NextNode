# Free AI APIs for Resume Analysis

This guide shows you how to set up **FREE** AI APIs for the resume analyzer instead of using paid services like OpenAI or Anthropic.

## 🆓 Free API Options (Recommended)

### 1. Google Gemini API (Best Option)
- **Cost**: FREE with generous limits
- **Free Tier**: 60 requests per minute, 1500 requests per day
- **Setup Time**: 2 minutes

#### Setup Steps:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key
5. Add to your `.env` file:
```bash
VITE_GEMINI_API_KEY=your-gemini-api-key-here
```

#### Rate Limits:
- 60 requests per minute
- 1,500 requests per day
- Perfect for small to medium usage

---

### 2. Cohere API (Great Alternative)
- **Cost**: FREE tier with 5M tokens/month
- **Free Tier**: Very generous - equivalent to ~2,500 resume analyses per month
- **Setup Time**: 3 minutes

#### Setup Steps:
1. Go to [Cohere Dashboard](https://dashboard.cohere.com/)
2. Sign up with email or Google
3. Navigate to API Keys section
4. Create a new API key
5. Add to your `.env` file:
```bash
VITE_COHERE_API_KEY=your-cohere-api-key-here
```

#### Features:
- 5M tokens per month free
- High-quality text generation
- Good JSON output formatting

---

### 3. Hugging Face Inference API (Developer Friendly)
- **Cost**: FREE with rate limits
- **Free Tier**: 30,000 characters per month
- **Setup Time**: 2 minutes

#### Setup Steps:
1. Go to [Hugging Face](https://huggingface.co/join)
2. Create a free account
3. Go to [Settings > Access Tokens](https://huggingface.co/settings/tokens)
4. Create a new token with "Read" role
5. Add to your `.env` file:
```bash
VITE_HUGGINGFACE_API_KEY=your-hf-token-here
```

#### Features:
- Access to thousands of AI models
- Good for experimentation
- Lower rate limits but completely free

---

## 🚀 Quick Setup (Choose One)

### Option A: Google Gemini (Recommended)
```bash
# Add to .env file
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### Option B: Cohere
```bash
# Add to .env file  
VITE_COHERE_API_KEY=your-cohere-api-key
```

### Option C: Hugging Face
```bash
# Add to .env file
VITE_HUGGINGFACE_API_KEY=your-hf-token
```

## 📊 Comparison of Free Options

| Provider | Free Limit | Quality | Speed | Setup Difficulty |
|----------|------------|---------|-------|------------------|
| **Google Gemini** | 1,500/day | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Cohere** | 5M tokens/month | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Hugging Face** | 30K chars/month | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🔧 Environment Setup

Create a `.env` file in your project root:

```bash
# Choose ONE of these free options:

# Option 1: Google Gemini (Recommended)
VITE_GEMINI_API_KEY=your-gemini-api-key

# Option 2: Cohere (High volume)
# VITE_COHERE_API_KEY=your-cohere-api-key

# Option 3: Hugging Face (Experimental)
# VITE_HUGGINGFACE_API_KEY=your-hf-token

# Optional: Paid options (if you want premium features)
# VITE_OPENAI_API_KEY=your-openai-key
# VITE_ANTHROPIC_API_KEY=your-anthropic-key
```

## 🎯 Usage Examples

The resume analyzer will automatically use the first available API key in this priority order:

1. **Google Gemini** (if `VITE_GEMINI_API_KEY` is set)
2. **Cohere** (if `VITE_COHERE_API_KEY` is set)
3. **Hugging Face** (if `VITE_HUGGINGFACE_API_KEY` is set)
4. **OpenAI** (if `VITE_OPENAI_API_KEY` is set)
5. **Anthropic** (if `VITE_ANTHROPIC_API_KEY` is set)
6. **Local Analysis** (always available as fallback)

## 💡 Pro Tips

### For Personal Projects:
- Start with **Google Gemini** - best balance of quality and limits
- 1,500 resumes per day is more than enough for personal use

### For Small Businesses:
- Use **Cohere** - 5M tokens = ~2,500 resume analyses per month
- Excellent for small HR departments or consultants

### For Developers:
- Try **Hugging Face** for experimentation
- Great for learning and testing different models

## 🛠️ Troubleshooting

### Common Issues:

1. **"API key not configured" error**
   - Make sure your `.env` file is in the project root
   - Restart your development server after adding the key
   - Check that the key name matches exactly (including `VITE_` prefix)

2. **Rate limit exceeded**
   - Switch to a different free API
   - Implement caching for repeated analyses
   - Add delays between requests

3. **Poor analysis quality**
   - Google Gemini typically gives the best results
   - Cohere is good for detailed analysis
   - Local analysis is always available as backup

### Verification:
```bash
# Test if your .env is loaded correctly
npm run dev
# Check browser console for any API key warnings
```

## 🔄 Fallback System

The system is designed with multiple fallbacks:

```
User Request → Gemini API → Cohere API → Hugging Face → OpenAI → Anthropic → Local Analysis
```

If any API fails, it automatically tries the next one, ensuring your resume analyzer always works.

## 📈 Scaling Up

When you outgrow free tiers:

1. **Google Gemini Pro**: $0.50 per 1M tokens
2. **Cohere Production**: Pay-as-you-go pricing
3. **OpenAI**: If you need GPT-4 level quality
4. **Multiple APIs**: Use different APIs for different features

## ⚠️ Important Notes

- Free APIs have rate limits - don't spam requests
- Always test your setup with a sample resume
- Keep your API keys secret (never commit to Git)
- Monitor your usage to avoid hitting limits
- The local analysis always works as a fallback

---

**Need help?** Check the main documentation at `/docs/RESUME_ANALYZER.md` for more details.
