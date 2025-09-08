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

// Tax Info Specific Pages
import AcquisitionRates from '@/pages/TaxInfo/AcquisitionRates';
import AcquisitionStandard from '@/pages/TaxInfo/AcquisitionStandard';
import AcquisitionRequirements from '@/pages/TaxInfo/AcquisitionRequirements';
import AcquisitionSpecial from '@/pages/TaxInfo/AcquisitionSpecial';
import PropertyRates from '@/pages/TaxInfo/PropertyRates';
import PropertyStandard from '@/pages/TaxInfo/PropertyStandard';
import PropertySpecial from '@/pages/TaxInfo/PropertySpecial';

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
              
              {/* 기존 TaxInfo 라우트 (호환성 유지) */}
              <Route path="tax-info" element={<TaxInfo />} />
              <Route path="tax-info/:category" element={<TaxInfo />} />
              
              {/* 새로운 구체적인 라우트들 */}
              <Route path="tax-info/acquisition/rates" element={<AcquisitionRates />} />
              <Route path="tax-info/acquisition/standard" element={<AcquisitionStandard />} />
              <Route path="tax-info/acquisition/requirements" element={<AcquisitionRequirements />} />
              <Route path="tax-info/acquisition/special" element={<AcquisitionSpecial />} />
              <Route path="tax-info/property/rates" element={<PropertyRates />} />
              <Route path="tax-info/property/standard" element={<PropertyStandard />} />
              <Route path="tax-info/property/special" element={<PropertySpecial />} />
              
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