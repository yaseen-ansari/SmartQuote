import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const QuotationPreview = () => {
  const [quotationData, setQuotationData] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const savedQuotation = localStorage.getItem('currentQuotation');
    if (savedQuotation) {
      setQuotationData(JSON.parse(savedQuotation));
    }
  }, []);

  const calculatePagePrice = (page) => {
    let basePrice = quotationData.pricing.tiers[page.tier];
    let modifierPrice = 0;
    
    if (page.isLongPage) modifierPrice += quotationData.pricing.modifiers.long_page;
    modifierPrice += page.animations * quotationData.pricing.modifiers.animation;
    modifierPrice += page.apiIntegrations * quotationData.pricing.modifiers.api;
    modifierPrice += page.reusedComponents * quotationData.pricing.modifiers.reused_component;
    
    return basePrice + modifierPrice;
  };

  const getOptionalFeaturesTotal = () => {
    return Object.keys(quotationData.optionalFeatures).reduce((sum, feature) => {
      return sum + (quotationData.optionalFeatures[feature] ? quotationData.pricing.optional_features[feature] : 0);
    }, 0);
  };

  const exportAsJSON = () => {
    const dataStr = JSON.stringify(quotationData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `quotation_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const exportAsPDF = async () => {
    setIsExporting(true);
    
    try {
      const element = document.getElementById('quotation-content');
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`quotation_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
    
    setIsExporting(false);
  };

  if (!quotationData) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="card">
          <div className="py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotation Found</h3>
            <p className="text-gray-600 mb-6">
              You haven't created any quotations yet. Start by creating a manual quotation or using our Figma auto-suggest feature.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/manual" className="btn-primary">
                Create Manual Quote
              </Link>
              <Link to="/auto-suggest" className="btn-secondary">
                Upload Figma File
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTierDisplayName = (tier) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  const getFeatureDisplayName = (feature) => {
    return feature.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const pagesTotal = quotationData.pages.reduce((sum, page) => sum + calculatePagePrice(page), 0);
  const featuresTotal = getOptionalFeaturesTotal();
  const grandTotal = pagesTotal + featuresTotal;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quotation Preview</h1>
          <p className="text-gray-600">
            Created on {formatDate(quotationData.createdAt)}
            {quotationData.source === 'figma_analysis' && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Figma Analysis
              </span>
            )}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={exportAsJSON}
            className="btn-secondary inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export JSON
          </button>
          <button
            onClick={exportAsPDF}
            disabled={isExporting}
            className="btn-primary inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quotation Content */}
      <div id="quotation-content" className="bg-white">
        {/* Project Summary */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {quotationData.pages.length}
              </div>
              <div className="text-sm text-gray-600">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {quotationData.pages.reduce((sum, page) => sum + page.animations, 0)}
              </div>
              <div className="text-sm text-gray-600">Animations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {quotationData.pages.reduce((sum, page) => sum + page.apiIntegrations, 0)}
              </div>
              <div className="text-sm text-gray-600">API Integrations</div>
            </div>
          </div>
        </div>

        {/* Pages Breakdown */}
        <div className="card mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Pages Breakdown</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Page Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Complexity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modifiers
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotationData.pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{page.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        page.tier === 'simple' ? 'bg-green-100 text-green-800' :
                        page.tier === 'standard' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {getTierDisplayName(page.tier)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        {page.isLongPage && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                            Long Page (+${quotationData.pricing.modifiers.long_page.toLocaleString()})
                          </div>
                        )}
                        {page.animations > 0 && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                            {page.animations} Animation{page.animations > 1 ? 's' : ''} (+${(page.animations * quotationData.pricing.modifiers.animation).toLocaleString()})
                          </div>
                        )}
                        {page.apiIntegrations > 0 && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                            {page.apiIntegrations} API Integration{page.apiIntegrations > 1 ? 's' : ''} (+${(page.apiIntegrations * quotationData.pricing.modifiers.api).toLocaleString()})
                          </div>
                        )}
                        {page.reusedComponents > 0 && (
                          <div className="flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            {page.reusedComponents} Reused Component{page.reusedComponents > 1 ? 's' : ''} (${(page.reusedComponents * quotationData.pricing.modifiers.reused_component).toLocaleString()})
                          </div>
                        )}
                        {!page.isLongPage && page.animations === 0 && page.apiIntegrations === 0 && page.reusedComponents === 0 && (
                          <span className="text-gray-400">No modifiers</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      ${calculatePagePrice(page).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                    Pages Subtotal
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    ${pagesTotal.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Optional Features */}
        {featuresTotal > 0 && (
          <div className="card mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Optional Features</h2>
            
            <div className="space-y-4">
              {Object.keys(quotationData.optionalFeatures).map((feature) => {
                if (!quotationData.optionalFeatures[feature]) return null;
                
                return (
                  <div key={feature} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {getFeatureDisplayName(feature)}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {feature === 'seo_optimization' && 'Complete SEO setup including meta tags, sitemap, and optimization'}
                        {feature === 'cms_support' && 'Content Management System integration with admin interface'}
                        {feature === 'admin_panel' && 'Custom admin panel for content and user management'}
                        {feature === 'hosting_support' && 'Hosting setup, deployment, and initial maintenance'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${quotationData.pricing.optional_features[feature].toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Features Subtotal</span>
                <span className="text-lg font-bold text-gray-900">
                  ${featuresTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Total */}
        <div className="card bg-primary-50 border-primary-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Total Project Cost</h2>
              <p className="text-gray-600 mt-1">
                This quotation is valid for 30 days from the creation date
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary-600">
                ${grandTotal.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Estimated delivery: 4-8 weeks
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="card mt-8 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Notes</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              This quotation includes design implementation, responsive development, and basic testing.
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              Additional revisions beyond the scope may incur extra charges.
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              Final pricing may vary based on detailed requirements analysis.
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
              Payment terms: 50% upfront, 50% upon completion.
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 mt-8">
        <Link to="/manual" className="btn-secondary">
          Create New Quote
        </Link>
        <Link to="/" className="btn-primary">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default QuotationPreview;