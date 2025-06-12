// Service Worker registration utilities
interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

export const registerServiceWorker = (config: ServiceWorkerConfig = {}) => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered: ', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content available
                  config.onUpdate?.(registration);
                  console.log('New content available, please refresh.');
                } else if (newWorker.state === 'installed') {
                  // Content cached for first time
                  config.onSuccess?.(registration);
                  console.log('Content cached for offline use.');
                }
              });
            }
          });

          config.onSuccess?.(registration);
        })
        .catch(error => {
          console.log('SW registration failed: ', error);
        });
    });

    // Listen for service worker messages - optimized to prevent blocking
    navigator.serviceWorker.addEventListener('message', event => {
      // Use requestIdleCallback to prevent blocking main thread
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          handleServiceWorkerMessage(event);
        });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(() => {
          handleServiceWorkerMessage(event);
        }, 0);
      }
    });

    const handleServiceWorkerMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        window.location.reload();
      }
    };
  }

  // Online/offline event listeners
  window.addEventListener('online', () => {
    console.log('App is online');
    config.onOnline?.();
  });

  window.addEventListener('offline', () => {
    console.log('App is offline');
    config.onOffline?.();
  });
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error('Error unregistering service worker:', error);
      });
  }
};

// Utility to check if app is running in standalone mode (PWA)
export const isPWA = () => {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
};

// Utility to prompt user to install PWA
export const promptPWAInstall = () => {
  let deferredPrompt: any;

  window.addEventListener('beforeinstallprompt', e => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;

    // Show custom install button
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'block';

      installButton.addEventListener('click', () => {
        // Hide the install button
        installButton.style.display = 'none';
        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult: any) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
          } else {
            console.log('User dismissed the install prompt');
          }
          deferredPrompt = null;
        });
      });
    }
  });

  // Handle successful installation
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    deferredPrompt = null;
  });
};

// Background sync registration
export const registerBackgroundSync = (tag: string = 'background-sync') => {
  if (
    'serviceWorker' in navigator &&
    'sync' in (window as any).ServiceWorkerRegistration.prototype
  ) {
    navigator.serviceWorker.ready
      .then((registration: any) => {
        return registration.sync.register(tag);
      })
      .catch(error => {
        console.log('Background sync registration failed:', error);
      });
  }
};

// Push notification utilities
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const subscribeToNotifications = async (publicKey: string) => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push messaging is not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to notifications:', error);
    return null;
  }
};

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
