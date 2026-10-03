import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { VaidyaProvider } from './context/VaidyaContext';
import { Layout } from './components/Layout';
import DeskPage from './pages/DeskPage';
import LiveRunPage from './pages/LiveRunPage';
import TeamPage from './pages/TeamPage';
import RefillDetailPage from './pages/RefillDetailPage';
import MoneyPage from './pages/MoneyPage';
import SafetyPage from './pages/SafetyPage';
import RecordsPage from './pages/RecordsPage';
import FamilyPage from './pages/FamilyPage';
import InsightsPage from './pages/InsightsPage';
import ArchitecturePage from './pages/ArchitecturePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <VaidyaProvider>
        <Layout>
          <Routes>
            <Route path="/"          element={<DeskPage />} />
            <Route path="/live"      element={<LiveRunPage />} />
            <Route path="/team"      element={<TeamPage />} />
            <Route path="/refill"    element={<RefillDetailPage />} />
            <Route path="/money"     element={<MoneyPage />} />
            <Route path="/safety"    element={<SafetyPage />} />
            <Route path="/records"   element={<RecordsPage />} />
            <Route path="/family"    element={<FamilyPage />} />
            <Route path="/insights"  element={<InsightsPage />} />
            <Route path="/arch"      element={<ArchitecturePage />} />
            <Route path="/settings"  element={<SettingsPage />} />
          </Routes>
        </Layout>
      </VaidyaProvider>
    </BrowserRouter>
  );
}
