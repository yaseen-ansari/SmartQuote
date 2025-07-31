import React, { useState, useEffect } from 'react';
import pricingData from '../pricing.json';

const Settings = () => {
  const [pricing, setPricing] = useState(pricingData);
  const [isEditing, setIsEditing] = useState(false);
  const [jsonString, setJsonString] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setJsonString(JSON.stringify(pricing, null, 2));
  }, [pricing]);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      try {
        const parsedPricing = JSON.parse(jsonString);
        
        // Validate structure
        const validationErrors = validatePricingStructure(parsedPricing);
        if (validationErrors.length > 0) {
          setErrors(validationErrors);
          return;
        }
        
        setPricing(parsedPricing);
        setErrors([]);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 3000);
      } catch (error) {
        setErrors(['Invalid JSON format. Please check your syntax.']);
        return;
      }
    } else {
      setErrors([]);
      setSaveStatus('');
    }
    setIsEditing(!isEditing);
  };

  const validatePricingStructure = (data) => {
    const errors = [];
    
    // Check required top-level keys
    const requiredKeys = ['tiers', 'modifiers', 'optional_features'];
    requiredKeys.forEach(key => {
      if (!data[key]) {
        errors.push(`Missing required section: ${key}`);
      }
    });
    
    // Check tiers
    if (data.tiers) {
      const requiredTiers = ['simple', 'standard', 'advanced'];
      requiredTiers.forEach(tier => {
        if (typeof data.tiers[tier] !== 'number' || data.tiers[tier] < 0) {
          errors.push(`Invalid value for tier: ${tier}`);
        }
      });
    }
    
    // Check modifiers
    if (data.modifiers) {
      const requiredModifiers = ['animation', 'api', 'long_page', 'reused_component'];
      requiredModifiers.forEach(modifier => {
        if (typeof data.modifiers[modifier] !== 'number') {
          errors.push(`Invalid value for modifier: ${modifier}`);
        }
      });
    }
    
    // Check optional features
    if (data.optional_features) {
      const requiredFeatures = ['seo_optimization', 'cms_support', 'admin_panel', 'hosting_support'];
      requiredFeatures.forEach(feature => {
        if (typeof data.optional_features[feature] !== 'number' || data.optional_features[feature] < 0) {
          errors.push(`Invalid value for feature: ${feature}`);
        }
      });
    }
    
    return errors;
  };

  const handleReset = () => {
    setPricing(pricingData);
    setJsonString(JSON.stringify(pricingData, null, 2));
    setErrors([]);
    setSaveStatus('reset');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const updateValue = (section, key, value) => {
    const numValue = parseFloat(value) || 0;
    setPricing(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: numValue
      }
    }));
  };

  const downloadConfig = () => {
    const dataStr = JSON.stringify(pricing, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pricing_config_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pricing Settings</h1>
        <p className="text-gray-600">
          Configure your pricing structure. Changes will affect all new quotations.
        </p>
      </div>

      {/* Status Messages */}
      {saveStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          saveStatus === 'saved' ? 'bg-green-50 border border-green-200' :
          saveStatus === 'reset' ? 'bg-blue-50 border border-blue-200' :
          'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${
              saveStatus === 'saved' ? 'text-green-600' :
              saveStatus === 'reset' ? 'text-blue-600' :
              'text-gray-600'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-sm font-medium ${
              saveStatus === 'saved' ? 'text-green-800' :
              saveStatus === 'reset' ? 'text-blue-800' :
              'text-gray-800'
            }`}>
              {saveStatus === 'saved' && 'Settings saved successfully!'}
              {saveStatus === 'reset' && 'Settings reset to default values!'}
            </span>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800 mb-1">Configuration Errors:</h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visual Editor */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">Visual Editor</h2>
            <div className="flex space-x-3">
              <button
                onClick={downloadConfig}
                className="btn-secondary text-sm inline-flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              <button
                onClick={handleReset}
                className="btn-secondary text-sm"
              >
                Reset to Default
              </button>
            </div>
          </div>

          {/* Page Tiers */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Complexity Tiers</h3>
            <div className="space-y-4">
              {Object.keys(pricing.tiers).map((tier) => (
                <div key={tier} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700 capitalize">
                      {tier} Page
                    </label>
                    <p className="text-xs text-gray-500">
                      {tier === 'simple' && 'Basic pages with minimal functionality'}
                      {tier === 'standard' && 'Medium complexity with forms and interactions'}
                      {tier === 'advanced' && 'Complex pages with advanced features'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={pricing.tiers[tier]}
                      onChange={(e) => updateValue('tiers', tier, e.target.value)}
                      className="input-field w-24 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modifiers */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Modifiers</h3>
            <div className="space-y-4">
              {Object.keys(pricing.modifiers).map((modifier) => (
                <div key={modifier} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {modifier.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </label>
                    <p className="text-xs text-gray-500">
                      {modifier === 'animation' && 'Cost per animation element'}
                      {modifier === 'api' && 'Cost per API integration'}
                      {modifier === 'long_page' && 'Additional cost for long scrolling pages'}
                      {modifier === 'reused_component' && 'Discount per reused component (negative value)'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      step="50"
                      value={pricing.modifiers[modifier]}
                      onChange={(e) => updateValue('modifiers', modifier, e.target.value)}
                      className="input-field w-24 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Optional Features */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Optional Features</h3>
            <div className="space-y-4">
              {Object.keys(pricing.optional_features).map((feature) => (
                <div key={feature} className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      {feature.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </label>
                    <p className="text-xs text-gray-500">
                      {feature === 'seo_optimization' && 'Complete SEO setup and optimization'}
                      {feature === 'cms_support' && 'Content Management System integration'}
                      {feature === 'admin_panel' && 'Custom admin panel development'}
                      {feature === 'hosting_support' && 'Hosting setup and deployment'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">$</span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={pricing.optional_features[feature]}
                      onChange={(e) => updateValue('optional_features', feature, e.target.value)}
                      className="input-field w-24 text-right"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* JSON Editor */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-900">JSON Editor</h2>
            <button
              onClick={handleEditToggle}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isEditing 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit JSON'}
            </button>
          </div>

          <div className="card">
            {isEditing ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edit Pricing Configuration
                </label>
                <textarea
                  value={jsonString}
                  onChange={(e) => setJsonString(e.target.value)}
                  className="input-field font-mono text-sm"
                  rows={25}
                  placeholder="Enter valid JSON configuration..."
                />
                <p className="mt-2 text-xs text-gray-500">
                  Make sure to maintain the correct JSON structure and data types.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Configuration
                </label>
                <pre className="bg-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
                  {jsonString}
                </pre>
                <p className="mt-2 text-xs text-gray-500">
                  Click "Edit JSON" to modify the configuration directly.
                </p>
              </div>
            )}
          </div>

          {/* Pricing Summary */}
          <div className="card bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pricing Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Simple Page Range:</span>
                <span className="font-medium">
                  ${pricing.tiers.simple.toLocaleString()} - ${(pricing.tiers.simple + 2000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Standard Page Range:</span>
                <span className="font-medium">
                  ${pricing.tiers.standard.toLocaleString()} - ${(pricing.tiers.standard + 3000).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Advanced Page Range:</span>
                <span className="font-medium">
                  ${pricing.tiers.advanced.toLocaleString()} - ${(pricing.tiers.advanced + 5000).toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Optional Features:</span>
                  <span className="font-medium">
                    ${Object.values(pricing.optional_features).reduce((sum, val) => sum + val, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Configuration Help</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• <strong>Tiers:</strong> Base prices for different page complexities</p>
              <p>• <strong>Modifiers:</strong> Additional costs or discounts per feature</p>
              <p>• <strong>Optional Features:</strong> One-time project add-ons</p>
              <p>• Use negative values for discounts (e.g., reused components)</p>
              <p>• All values should be in your base currency</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;