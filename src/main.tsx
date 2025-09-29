import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { QueryProvider } from './provider/QueryProvider.tsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
    <QueryProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </QueryProvider>
);
