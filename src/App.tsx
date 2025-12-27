import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp } from 'antd';
import koKR from 'antd/locale/ko_KR';

// Layout
import MainLayout from '@/components/layout/MainLayout';

// Pages
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';

// Tax Info Specific Pages
import AcquisitionRates from '@/pages/TaxInfo/AcquisitionRates';
import AcquisitionStandard from '@/pages/TaxInfo/AcquisitionStandard';
import AcquisitionRequirements from '@/pages/TaxInfo/AcquisitionRequirements';
import AcquisitionSpecial from '@/pages/TaxInfo/AcquisitionSpecial';
import PropertyRates from '@/pages/TaxInfo/PropertyRates';
import PropertyStandard from '@/pages/TaxInfo/PropertyStandard';
import PropertySpecial from '@/pages/TaxInfo/PropertySpecial';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Ant Design Theme Configuration
const theme = {
  token: {
    colorPrimary: '#1890ff',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 6,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#001529',
      siderBg: '#fff',
    },
    Menu: {
      itemBg: 'transparent',
    },
  },
};

function App() {
  return (
    <ConfigProvider theme={theme} locale={koKR}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />

                {/* 지방세정보 - 취득세 */}
                <Route path="local-tax/acquisition/rates" element={<AcquisitionRates />} />
                <Route path="local-tax/acquisition/standard" element={<AcquisitionStandard />} />
                <Route path="local-tax/acquisition/requirements" element={<AcquisitionRequirements />} />
                <Route path="local-tax/acquisition/special" element={<AcquisitionSpecial />} />

                {/* 지방세정보 - 재산세 */}
                <Route path="local-tax/property/rates" element={<PropertyRates />} />
                <Route path="local-tax/property/standard" element={<PropertyStandard />} />
                <Route path="local-tax/property/special" element={<PropertySpecial />} />

                {/* 기존 tax-info 경로 리다이렉트 (호환성) */}
                <Route path="tax-info/acquisition/rates" element={<Navigate to="/local-tax/acquisition/rates" replace />} />
                <Route path="tax-info/acquisition/standard" element={<Navigate to="/local-tax/acquisition/standard" replace />} />
                <Route path="tax-info/acquisition/requirements" element={<Navigate to="/local-tax/acquisition/requirements" replace />} />
                <Route path="tax-info/acquisition/special" element={<Navigate to="/local-tax/acquisition/special" replace />} />
                <Route path="tax-info/property/rates" element={<Navigate to="/local-tax/property/rates" replace />} />
                <Route path="tax-info/property/standard" element={<Navigate to="/local-tax/property/standard" replace />} />
                <Route path="tax-info/property/special" element={<Navigate to="/local-tax/property/special" replace />} />
                <Route path="tax-info" element={<Navigate to="/local-tax/acquisition/rates" replace />} />

                {/* 지방세정보 기본 경로 */}
                <Route path="local-tax" element={<Navigate to="/local-tax/acquisition/rates" replace />} />

                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </QueryClientProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
