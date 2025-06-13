// Manifest endpoint for GitHub Codespaces compatibility
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  const manifest = {
    "name": "NextNode - Career Development Platform",
    "short_name": "NextNode",
    "description": "Professional career development tools and resources",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#3b82f6",
    "orientation": "portrait-primary",
    "icons": [
      {
        "src": "/icons/icon-16x16.svg",
        "sizes": "16x16",
        "type": "image/svg+xml"
      },
      {
        "src": "/icons/icon-32x32.svg",
        "sizes": "32x32",
        "type": "image/svg+xml"
      },
      {
        "src": "/icons/icon-48x48.svg",
        "sizes": "48x48",
        "type": "image/svg+xml"
      },
      {
        "src": "/icons/icon-192x192.svg",
        "sizes": "192x192",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      },
      {
        "src": "/icons/icon-512x512.svg",
        "sizes": "512x512",
        "type": "image/svg+xml",
        "purpose": "any maskable"
      }
    ],
    "categories": ["productivity", "business", "education"],
    "lang": "en",
    "dir": "ltr",
    "scope": "/",
    "id": "nextnode-pwa",
    "prefer_related_applications": false
  };
  
  res.status(200).json(manifest);
}
