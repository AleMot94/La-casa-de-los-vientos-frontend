import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from './i18n/I18nProvider.tsx'
import { PhotosProvider } from './photos/PhotosProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <PhotosProvider>
      <App />
    </PhotosProvider>
  </I18nProvider>
)
