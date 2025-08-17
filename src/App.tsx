import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout
import MainLayout from '@/components/layout/MainLayout';

// Pages
import Home from '@/pages/Home';
import TaxInfo from '@/pages/TaxInfo';
import Calculator from '@/pages/Calculator';
import Guide from '@/pages/Guide';
import NotFound from '@/pages/NotFound';

// Styles
import '@/styles/globals.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="tax-info" element={<TaxInfo />} />
              <Route path="tax-info/:category" element={<TaxInfo />} />
              <Route path="calculator" element={<Calculator />} />
              <Route path="guide" element={<Guide />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;