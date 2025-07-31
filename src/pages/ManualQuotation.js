import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pricingData from '../pricing.json';

const ManualQuotation = () => {
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState(1);
  const [pages, setPages] = useState([{
    id: 1,
    name: 'Page 1',
    tier: 'simple',
    isLongPage: false,
    animations: 0,
    apiIntegrations: 0,
    reusedComponents: 0
  }]);
  
  const [optionalFeatures, setOptionalFeatures] = useState({
    seo_optimization: false,
    cms_support: false,
    admin_panel: false,
    hosting_support: false
  });

  // Update pages array when numPages changes
  useEffect(() => {
    const currentLength = pages.length;
    if (numPages > currentLength) {
      const newPages = [];
      for (let i = currentLength; i < numPages; i++) {
        newPages.push({
          id: i + 1,
          name: `Page ${i + 1}`,
          tier: 'simple',
          isLongPage: false,
          animations: 0,
          apiIntegrations: 0,
          reusedComponents: 0
        });
      }
      setPages([...pages, ...newPages]);
    } else if (numPages < currentLength) {
      setPages(pages.slice(0, numPages));
    }
  }, [numPages, pages]);

  const updatePage = (pageId, field, value) => {
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, [field]: value } : page
    ));
  };

  const updatePageName = (pageId, name) => {
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, name } : page
    ));
  };

  const toggleOptionalFeature = (feature) => {
    setOptionalFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const calculatePagePrice = (page) => {
    let basePrice = pricingData.tiers[page.tier];
    let modifierPrice = 0;
    
    if (page.isLongPage) modifierPrice += pricingData.modifiers.long_page;
    modifierPrice += page.animations * pricingData.modifiers.animation;
    modifierPrice += page.apiIntegrations * pricingData.modifiers.api;
    modifierPrice += page.reusedComponents * pricingData.modifiers.reused_component;
    
    return basePrice + modifierPrice;
  };

  const calculateTotalPrice = () => {
    const pagesTotal = pages.reduce((sum, page) => sum + calculatePagePrice(page), 0);
    const featuresTotal = Object.keys(optionalFeatures).reduce((sum, feature) => {
      return sum + (optionalFeatures[feature] ? pricingData.optional_features[feature] : 0);
    }, 0);
    
    return pagesTotal + featuresTotal;
  };

  const handleGenerateQuote = () => {
    const quotationData = {
      pages,
      optionalFeatures,
      pricing: pricingData,
      totalPrice: calculateTotalPrice(),
      createdAt: new Date().toISOString()
    };
    
    // Store in localStorage for preview page
    localStorage.setItem('currentQuotation', JSON.stringify(quotationData));
    navigate('/preview');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual Quotation</h1>
        <p className="text-gray-600">Create a detailed quotation by specifying page requirements and features.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Page Setup Section */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Page Setup</h2>
            
            {/* Number of Pages */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Number of Pages
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numPages}
                onChange={(e) => setNumPages(Math.max(1, parseInt(e.target.value) || 1))}
                className="input-field w-32"
              />
            </div>

            {/* Page Configuration */}
            <div className="space-y-6">
              {pages.map((page) => (
                <div key={page.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <input
                      type="text"
                      value={page.name}
                      onChange={(e) => updatePageName(page.id, e.target.value)}
                      className="input-field font-semibold text-lg"
                      placeholder={`Page ${page.id}`}
                    />
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Estimated Price</div>
                      <div className="text-lg font-semibold text-primary-600">
                        ${calculatePagePrice(page).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Page Tier */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Page Complexity
                      </label>
                      <select
                        value={page.tier}
                        onChange={(e) => updatePage(page.id, 'tier', e.target.value)}
                        className="select-field"
                      >
                        <option value="simple">Simple (${pricingData.tiers.simple.toLocaleString()})</option>
                        <option value="standard">Standard (${pricingData.tiers.standard.toLocaleString()})</option>
                        <option value="advanced">Advanced (${pricingData.tiers.advanced.toLocaleString()})</option>
                      </select>
                    </div>

                    {/* Long Page Toggle */}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={page.isLongPage}
                          onChange={(e) => updatePage(page.id, 'isLongPage', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700">
                          Long Page (+${pricingData.modifiers.long_page.toLocaleString()})
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Modifiers */}
                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Animations
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={page.animations}
                        onChange={(e) => updatePage(page.id, 'animations', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        +${pricingData.modifiers.animation.toLocaleString()} each
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        API Integrations
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={page.apiIntegrations}
                        onChange={(e) => updatePage(page.id, 'apiIntegrations', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        +${pricingData.modifiers.api.toLocaleString()} each
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reused Components
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={page.reusedComponents}
                        onChange={(e) => updatePage(page.id, 'reusedComponents', parseInt(e.target.value) || 0)}
                        className="input-field"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        ${pricingData.modifiers.reused_component.toLocaleString()} each
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Features Section */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Optional Features (Global)</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {Object.keys(pricingData.optional_features).map((feature) => {
                const featureName = feature.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
                
                return (
                  <label key={feature} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={optionalFeatures[feature]}
                      onChange={() => toggleOptionalFeature(feature)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{featureName}</div>
                      <div className="text-sm text-gray-500">
                        +${pricingData.optional_features[feature].toLocaleString()}
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Price Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Price Summary</h3>
            
            {/* Pages Breakdown */}
            <div className="space-y-3 mb-6">
              <h4 className="font-medium text-gray-700">Pages</h4>
              {pages.map((page) => (
                <div key={page.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{page.name}</span>
                  <span className="font-medium">${calculatePagePrice(page).toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Optional Features Breakdown */}
            {Object.keys(optionalFeatures).some(feature => optionalFeatures[feature]) && (
              <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-700">Optional Features</h4>
                {Object.keys(optionalFeatures).map((feature) => {
                  if (!optionalFeatures[feature]) return null;
                  const featureName = feature.split('_').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ');
                  
                  return (
                    <div key={feature} className="flex justify-between text-sm">
                      <span className="text-gray-600">{featureName}</span>
                      <span className="font-medium">
                        ${pricingData.optional_features[feature].toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-primary-600">
                  ${calculateTotalPrice().toLocaleString()}
                </span>
              </div>
            </div>

            {/* Generate Quote Button */}
            <button
              onClick={handleGenerateQuote}
              className="btn-primary w-full mt-6"
            >
              Generate Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualQuotation;