import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Never retry on 429 (rate limit), 401 (auth), or 403 (forbidden).
      // Retrying a 429 is counter-productive — it floods the server and makes
      // the rate-limit window reset even later. Retry once for transient errors.
      retry: (failureCount, error: any) => {
        const status = error?.response?.status;
        if (status === 429 || status === 401 || status === 403) return false;
        return failureCount < 1;
      },
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
