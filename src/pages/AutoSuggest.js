import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import pricingData from '../pricing.json';

const AutoSuggest = () => {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'
  const [figmaUrl, setFigmaUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [detectedComponents, setDetectedComponents] = useState([]);

  // Mock analysis results - in a real app, this would connect to AI/ML services
  const mockAnalysisResults = [
    {
      id: 1,
      name: 'Homepage',
      suggestedTier: 'advanced',
      confidence: 92,
      detectedFeatures: ['Hero section with video', 'Complex navigation', 'Interactive elements'],
      estimatedAnimations: 3,
      estimatedApis: 2,
      isLongPage: true
    },
    {
      id: 2,
      name: 'About Us',
      suggestedTier: 'standard',
      confidence: 88,
      detectedFeatures: ['Team grid', 'Timeline component', 'Contact form'],
      estimatedAnimations: 1,
      estimatedApis: 0,
      isLongPage: true
    },
    {
      id: 3,
      name: 'Services',
      suggestedTier: 'standard',
      confidence: 85,
      detectedFeatures: ['Service cards', 'Pricing table', 'CTA buttons'],
      estimatedAnimations: 2,
      estimatedApis: 0,
      isLongPage: false
    },
    {
      id: 4,
      name: 'Contact',
      suggestedTier: 'simple',
      confidence: 95,
      detectedFeatures: ['Basic form', 'Map integration', 'Contact info'],
      estimatedAnimations: 0,
      estimatedApis: 1,
      isLongPage: false
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (uploadType === 'file' && !uploadedFile) {
      alert('Please upload a Figma file first.');
      return;
    }
    
    if (uploadType === 'url' && !figmaUrl.trim()) {
      alert('Please enter a Figma URL first.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      setDetectedComponents(mockAnalysisResults);
      setAnalysisComplete(true);
      setIsAnalyzing(false);
    }, 3000);
  };

  const calculateComponentPrice = (component) => {
    let basePrice = pricingData.tiers[component.suggestedTier];
    let modifierPrice = 0;
    
    if (component.isLongPage) modifierPrice += pricingData.modifiers.long_page;
    modifierPrice += component.estimatedAnimations * pricingData.modifiers.animation;
    modifierPrice += component.estimatedApis * pricingData.modifiers.api;
    
    return basePrice + modifierPrice;
  };

  const calculateTotalPrice = () => {
    return detectedComponents.reduce((sum, component) => sum + calculateComponentPrice(component), 0);
  };

  const handleGenerateQuote = () => {
    const pages = detectedComponents.map(component => ({
      id: component.id,
      name: component.name,
      tier: component.suggestedTier,
      isLongPage: component.isLongPage,
      animations: component.estimatedAnimations,
      apiIntegrations: component.estimatedApis,
      reusedComponents: 0
    }));

    const quotationData = {
      pages,
      optionalFeatures: {
        seo_optimization: false,
        cms_support: false,
        admin_panel: false,
        hosting_support: false
      },
      pricing: pricingData,
      totalPrice: calculateTotalPrice(),
      createdAt: new Date().toISOString(),
      source: 'figma_analysis'
    };
    
    localStorage.setItem('currentQuotation', JSON.stringify(quotationData));
    navigate('/preview');
  };

  const updateComponent = (componentId, field, value) => {
    setDetectedComponents(components =>
      components.map(component =>
        component.id === componentId ? { ...component, [field]: value } : component
      )
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Figma Auto-Suggest</h1>
        <p className="text-gray-600">
          Upload your Figma files or provide a Figma URL to get intelligent pricing suggestions 
          based on design complexity analysis.
        </p>
      </div>

      {!analysisComplete ? (
        <div className="max-w-2xl mx-auto">
          {/* Upload Method Selection */}
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Upload Method</h2>
            
            <div className="flex space-x-4 mb-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="file"
                  checked={uploadType === 'file'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 font-medium">Upload .fig File</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="url"
                  checked={uploadType === 'url'}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2 font-medium">Figma URL</span>
              </label>
            </div>

            {uploadType === 'file' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Figma File (.fig)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-primary-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          accept=".fig"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">Figma files (.fig) up to 50MB</p>
                  </div>
                </div>
                {uploadedFile && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-green-800">
                        File uploaded: {uploadedFile.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Figma File URL
                </label>
                <input
                  type="url"
                  value={figmaUrl}
                  onChange={(e) => setFigmaUrl(e.target.value)}
                  placeholder="https://www.figma.com/file/..."
                  className="input-field"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Make sure your Figma file is set to "Anyone with the link can view"
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Setup Instructions</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">1</span>
                </div>
                <p>Organize your Figma file with clear page names (e.g., "Homepage", "About", "Contact")</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">2</span>
                </div>
                <p>Use consistent naming for components and maintain proper layer structure</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">3</span>
                </div>
                <p>Include annotations for complex interactions or API requirements</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-xs font-medium text-primary-600">4</span>
                </div>
                <p>Ensure all design elements are properly grouped and named</p>
              </div>
            </div>
          </div>

          {/* Analyze Button */}
          <div className="text-center">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Design...
                </div>
              ) : (
                'Analyze Figma File'
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Analysis Results */
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Detected Components</h2>
                <button
                  onClick={() => {
                    setAnalysisComplete(false);
                    setDetectedComponents([]);
                    setUploadedFile(null);
                    setFigmaUrl('');
                  }}
                  className="btn-secondary text-sm"
                >
                  Start Over
                </button>
              </div>

              <div className="space-y-6">
                {detectedComponents.map((component) => (
                  <div key={component.id} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-500 mr-2">Confidence:</span>
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${component.confidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">{component.confidence}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">Estimated Price</div>
                        <div className="text-lg font-semibold text-primary-600">
                          ${calculateComponentPrice(component).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Suggested Complexity
                        </label>
                        <select
                          value={component.suggestedTier}
                          onChange={(e) => updateComponent(component.id, 'suggestedTier', e.target.value)}
                          className="select-field"
                        >
                          <option value="simple">Simple (${pricingData.tiers.simple.toLocaleString()})</option>
                          <option value="standard">Standard (${pricingData.tiers.standard.toLocaleString()})</option>
                          <option value="advanced">Advanced (${pricingData.tiers.advanced.toLocaleString()})</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={component.isLongPage}
                            onChange={(e) => updateComponent(component.id, 'isLongPage', e.target.checked)}
                            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            Long Page (+${pricingData.modifiers.long_page.toLocaleString()})
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated Animations
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={component.estimatedAnimations}
                          onChange={(e) => updateComponent(component.id, 'estimatedAnimations', parseInt(e.target.value) || 0)}
                          className="input-field"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Estimated API Integrations
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={component.estimatedApis}
                          onChange={(e) => updateComponent(component.id, 'estimatedApis', parseInt(e.target.value) || 0)}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Detected Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {component.detectedFeatures.map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Analysis Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pages Detected:</span>
                  <span className="font-medium">{detectedComponents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg. Confidence:</span>
                  <span className="font-medium">
                    {Math.round(detectedComponents.reduce((sum, c) => sum + c.confidence, 0) / detectedComponents.length)}%
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-700">Component Breakdown</h4>
                {detectedComponents.map((component) => (
                  <div key={component.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{component.name}</span>
                    <span className="font-medium">${calculateComponentPrice(component).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ${calculateTotalPrice().toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleGenerateQuote}
                  className="btn-primary w-full"
                >
                  Generate Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoSuggest;