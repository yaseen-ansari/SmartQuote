import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ManualQuotation from './pages/ManualQuotation';
import AutoSuggest from './pages/AutoSuggest';
import QuotationPreview from './pages/QuotationPreview';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/manual" element={<ManualQuotation />} />
          <Route path="/auto-suggest" element={<AutoSuggest />} />
          <Route path="/preview" element={<QuotationPreview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
