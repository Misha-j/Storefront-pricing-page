import React from 'react';
import { Check, Building2, ChevronDown, ChevronUp, Users, Globe, Settings } from 'lucide-react';

function App() {
  const [expandedPlans, setExpandedPlans] = React.useState<Record<string, boolean>>({});
  const [selectedCompany, setSelectedCompany] = React.useState('Acme Corp');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('business');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [showDebug, setShowDebug] = React.useState(false);

  // Mock companies data - in a real app, this would come from an API
  const companies = [
    { 
      id: 'acme', 
      name: 'Acme Corp', 
      plan: 'Business Mini', 
      users: 12,
      hasAdvisorPlan: null,
      linkedToCompanyId: null,
      advisorLicenses: null
    },
    { 
      id: 'techstart', 
      name: 'TechStart Inc', 
      plan: 'Business Free', 
      users: 5,
      hasAdvisorPlan: null,
      linkedToCompanyId: null,
      advisorLicenses: null
    },
    { 
      id: 'globaltech', 
      name: 'GlobalTech Solutions', 
      plan: 'Business Max', 
      users: 25,
      hasAdvisorPlan: null,
      linkedToCompanyId: null,
      advisorLicenses: null
    },
    { 
      id: 'innovate', 
      name: 'Innovate Labs', 
      plan: 'Business Mini', 
      users: 8,
      hasAdvisorPlan: 'premium',
      linkedToCompanyId: 'acme',
      advisorLicenses: { active: 2, inactive: 1 }
    },
    { 
      id: 'advisorpro', 
      name: 'Advisor Pro', 
      plan: 'Business Free', 
      users: 3,
      hasAdvisorPlan: 'basic',
      linkedToCompanyId: null,
      advisorLicenses: { active: 1, inactive: 0 }
    }
  ];

  const togglePlan = (planId: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  // Click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentCompany = companies.find(company => company.name === selectedCompany);

  // Get the current plan for the selected company
  const getCurrentPlanForCompany = (companyName: string) => {
    const company = companies.find(c => c.name === companyName);
    return company?.plan || 'Business Free';
  };

  // Check if a plan is the current plan for the selected company
  const isCurrentPlan = (planName: string) => {
    return getCurrentPlanForCompany(selectedCompany) === planName;
  };

  // Check if a plan is recommended (Business Max for business, Advisor Premium for advisors)
  const isRecommendedPlan = (planName: string) => {
    return planName === 'Business Max' || planName === 'Advisor Premium';
  };

  // Check if user has advisor premium benefits
  const hasAdvisorPremiumBenefits = () => {
    return currentCompany?.hasAdvisorPlan === 'premium';
  };

  // Check if user has advisor basic plan
  const hasAdvisorBasicPlan = () => {
    return currentCompany?.hasAdvisorPlan === 'basic';
  };

  // Get advisor discount for business plans
  const getAdvisorDiscount = (planName: string) => {
    if (!hasAdvisorPremiumBenefits()) return null;
    
    if (planName === 'Business Mini') {
      return { originalPrice: 100, discountedPrice: 0, discountPercent: 100 };
    }
    if (planName === 'Business Max') {
      return { originalPrice: 1000, discountedPrice: 700, discountPercent: 30 };
    }
    return null;
  };

  // Determine current scenario for debug panel
  const getCurrentScenario = () => {
    if (!currentCompany) return 'No company selected';
    
    const plan = currentCompany.plan;
    const advisorPlan = currentCompany.hasAdvisorPlan;
    
    if (advisorPlan === 'premium' && plan === 'Business Mini') return 'Scenario 4: Advisor premium + Business mini';
    if (advisorPlan === 'basic' && plan === 'Business Free') return 'Scenario 5: Advisor basic only';
    if (advisorPlan === 'premium' && currentCompany.linkedToCompanyId) return 'Scenario 6: Advisor premium viewing linked company';
    if (plan === 'Business Free') return 'Scenario 1: Only on free plan';
    if (plan === 'Business Mini') return 'Scenario 2: On Business Mini plan';
    if (plan === 'Business Max') return 'Scenario 3: On Business Max plan';
    
    return 'Unknown scenario';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">ExitPlanner</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Hero Section with Company Selector */}
        <div className="text-center mb-16">
          <div className="relative mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Pricing that pays for itself
              <span className="text-orange-500 text-6xl absolute -top-2 -right-4">*</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Unlock value in your business—wherever you are in your exit journey
            </p>
          </div>

          {/* Company Selector - Centered under subtitle */}
          <div className="mb-8 flex justify-center">
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  <span>Viewing plans for:</span>
                </div>
                
                <div className="relative">
                  <button
                    onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
                    className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors shadow-sm"
                    aria-haspopup="true"
                    aria-expanded={isCompanyDropdownOpen}
                  >
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="font-medium text-gray-900">{selectedCompany}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isCompanyDropdownOpen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 animate-in fade-in-0 zoom-in-95">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Select Company</h3>
                        <p className="text-xs text-gray-600">Choose which company's plans you want to view</p>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {/* Standalone Companies */}
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                          <span className="text-xs font-medium text-gray-500">Standalone Companies</span>
                        </div>
                        {companies.filter(company => !company.linkedToCompanyId).map((company) => (
                          <button
                            key={company.id}
                            onClick={() => {
                              setSelectedCompany(company.name);
                              setIsCompanyDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                              selectedCompany === company.name ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <Building2 className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{company.name}</div>
                                  <div className="text-sm text-gray-600 flex items-center space-x-2">
                                    <span>{company.plan}</span>
                                    <span>•</span>
                                    <span className="flex items-center">
                                      <Users className="w-3 h-3 mr-1" />
                                      {company.users} users
                                    </span>
                                    {company.hasAdvisorPlan && (
                                      <>
                                        <span>•</span>
                                        <span className="text-blue-600 font-medium">{company.hasAdvisorPlan} advisor</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              {selectedCompany === company.name && (
                                <Check className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                          </button>
                        ))}

                        {/* Linked Companies */}
                        {companies.filter(company => company.linkedToCompanyId).length > 0 && (
                          <>
                            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                              <span className="text-xs font-medium text-blue-600">Linked Companies</span>
                            </div>
                            {companies.filter(company => company.linkedToCompanyId).map((company) => {
                              const linkedCompany = companies.find(c => c.id === company.linkedToCompanyId);
                              return (
                                <button
                                  key={company.id}
                                  onClick={() => {
                                    setSelectedCompany(company.name);
                                    setIsCompanyDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                                    selectedCompany === company.name ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="font-medium text-gray-900 flex items-center">
                                          {company.name}
                                          <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                                            Linked
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-600 flex items-center space-x-2">
                                          <span>{company.plan}</span>
                                          <span>•</span>
                                          <span className="flex items-center">
                                            <Users className="w-3 h-3 mr-1" />
                                            {company.users} users
                                          </span>
                                          {company.hasAdvisorPlan && (
                                            <>
                                              <span>•</span>
                                              <span className="text-blue-600 font-medium">{company.hasAdvisorPlan} advisor</span>
                                            </>
                                          )}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                          Linked to: {linkedCompany?.name}
                                        </div>
                                      </div>
                                    </div>
                                    {selectedCompany === company.name && (
                                      <Check className="w-4 h-4 text-blue-600" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </>
                        )}
                      </div>
                      
                      <div className="p-4 border-t border-gray-100 bg-gray-50">
                        <button className="flex items-center text-blue-600 text-sm hover:text-blue-700 transition-colors">
                          <Globe className="w-4 h-4 mr-2" />
                          Add new company
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <p className="text-blue-600 underline cursor-pointer">
            Are you an advisor? See advisor pricing
          </p>
        </div>

        {/* Business Owners Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Exit planning tools</h2>
            <p className="text-gray-600">Typical for Business owners or Advisors looking to purchase for their clients company</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Business Free */}
            <div className={`bg-white rounded-lg border p-8 relative ${
              isCurrentPlan('Business Free') 
                ? 'border-blue-300' 
                : isRecommendedPlan('Business Free')
                ? 'border-green-500 ring-2 ring-green-100'
                : 'border-gray-200'
            }`}>
              {isCurrentPlan('Business Free') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium rounded-full border border-blue-200">CURRENT PLAN</span>
                </div>
              )}
              {isRecommendedPlan('Business Free') && !isCurrentPlan('Business Free') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-3 py-1 text-xs font-medium rounded-full">RECOMMENDED</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Free</h3>
              <p className="text-gray-600 text-sm mb-6">Get a personalized roadmap of your exit options—at no cost.</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <p className="text-gray-600 text-sm">/ business / year</p>
              </div>

              {isCurrentPlan('Business Free') ? (
                <div className="space-y-2 mb-8">
                  <button className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed">
                    Current Plan
                  </button>
                </div>
              ) : (isCurrentPlan('Business Mini') || isCurrentPlan('Business Max')) ? (
                <div className="mb-8">
                  {/* CTA suppressed for paid plan users */}
                </div>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mb-8 hover:bg-blue-700">
                  Switch to Business Free
                </button>
              )}

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Day Zero Guide – Compare exit paths based on your goals
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Invite team members or advisors to collaborate
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Upgrade anytime to run numbers or get support
                </li>
                {expandedPlans['business-free'] && (
                  <>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Basic business valuation snapshot
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Exit readiness assessment
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Industry benchmarking data
                    </li>
                  </>
                )}
              </ul>
              
              {!expandedPlans['business-free'] && (
                <button 
                  onClick={() => togglePlan('business-free')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show All Features
                </button>
              )}
              
              {expandedPlans['business-free'] && (
                <button 
                  onClick={() => togglePlan('business-free')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less features
                </button>
              )}
            </div>

            {/* Business Mini */}
            <div className={`bg-white rounded-lg border p-8 relative ${
              isCurrentPlan('Business Mini') 
                ? 'border-blue-300' 
                : isRecommendedPlan('Business Mini')
                ? 'border-green-500 ring-2 ring-green-100'
                : 'border-gray-200'
            }`}>
              {isCurrentPlan('Business Mini') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium rounded-full border border-blue-200">CURRENT PLAN</span>
                </div>
              )}
              {isRecommendedPlan('Business Mini') && !isCurrentPlan('Business Mini') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-3 py-1 text-xs font-medium rounded-full">RECOMMENDED</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Mini</h3>
              <p className="text-gray-600 text-sm mb-6">See what your business might be worth and how that impacts your path.</p>
              
              <div className="mb-6">
                {(() => {
                  const discount = getAdvisorDiscount('Business Mini');
                  if (discount) {
                    return (
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 line-through text-lg">${discount.originalPrice}</span>
                          <span className="text-4xl font-bold text-gray-900">${discount.discountedPrice}</span>
                          <span className="text-green-600 text-sm font-medium">{discount.discountPercent}% off</span>
                        </div>
                        <p className="text-gray-600 text-sm">/ business / year</p>
                        <div className="mt-2">
                          <span className="text-blue-600 text-xs font-medium">+ Advisor premium benefit</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <span className="text-4xl font-bold text-gray-900">$100</span>
                      <p className="text-gray-600 text-sm">/ business / year</p>
                    </div>
                  );
                })()}
              </div>

              {isCurrentPlan('Business Mini') ? (
                <div className="space-y-2 mb-8">
                  <button className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed">
                    Current Plan
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Plan
                  </button>
                </div>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mb-8 hover:bg-blue-700">
                  {isCurrentPlan('Business Free') ? 'Upgrade to Business Mini' : 'Switch to Business Mini'}
                </button>
              )}

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Day Zero Guide – Compare exit paths based on your goals
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Aha Planner (DIY) – Get simple valuation yourself
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Invite team members or advisors to collaborate
                </li>
                {expandedPlans['business-mini'] && (
                  <>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Business valuation with market analysis
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Financial performance tracking
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Exit timeline planning
                    </li>
                  </>
                )}
              </ul>
              
              {!expandedPlans['business-mini'] && (
                <button 
                  onClick={() => togglePlan('business-mini')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show All Features
                </button>
              )}
              
              {expandedPlans['business-mini'] && (
                <button 
                  onClick={() => togglePlan('business-mini')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less features
                </button>
              )}
            </div>

            {/* Business Max */}
            <div className={`bg-white rounded-lg border p-8 relative ${
              isCurrentPlan('Business Max') 
                ? 'border-blue-300' 
                : isRecommendedPlan('Business Max')
                ? 'border-green-500 ring-2 ring-green-100'
                : 'border-gray-200'
            }`}>
              {isCurrentPlan('Business Max') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium rounded-full border border-blue-200">CURRENT PLAN</span>
                </div>
              )}
              {isRecommendedPlan('Business Max') && !isCurrentPlan('Business Max') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-600 text-white px-3 py-1 text-xs font-medium rounded-full">RECOMMENDED</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Max</h3>
              <p className="text-gray-600 text-sm mb-6">A full planning toolkit to prepare your business for transition.</p>
              
              <div className="mb-6">
                {(() => {
                  const discount = getAdvisorDiscount('Business Max');
                  if (discount) {
                    return (
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-400 line-through text-lg">${discount.originalPrice}</span>
                          <span className="text-4xl font-bold text-gray-900">${discount.discountedPrice}</span>
                          <span className="text-green-600 text-sm font-medium">{discount.discountPercent}% off</span>
                        </div>
                        <p className="text-gray-600 text-sm">/ business / year</p>
                        <div className="mt-2">
                          <span className="text-blue-600 text-xs font-medium">+ Advisor premium benefit</span>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <div>
                      <span className="text-4xl font-bold text-gray-900">$1,000</span>
                      <p className="text-gray-600 text-sm">/ business / year</p>
                    </div>
                  );
                })()}
              </div>

              {isCurrentPlan('Business Max') ? (
                <div className="space-y-2 mb-8">
                  <button className="w-full bg-gray-100 text-gray-600 py-2 px-4 rounded-md cursor-not-allowed">
                    Current Plan
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 flex items-center justify-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Plan
                  </button>
                </div>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mb-8 hover:bg-blue-700">
                  {isCurrentPlan('Business Free') || isCurrentPlan('Business Mini') ? 'Upgrade to Business Max' : 'Switch to Business Max'}
                </button>
              )}

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Day Zero Guide – Compare exit paths based on your goals
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Full Aha Planner access – Includes guided support and complete report access
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Access data on market comps transactions
                </li>
                {expandedPlans['business-max'] && (
                  <>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Advanced financial modeling and projections
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Tax optimization strategies
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Legal document templates and preparation
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Buyer qualification and vetting tools
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Priority customer support
                    </li>
                  </>
                )}
              </ul>
              
              {!expandedPlans['business-max'] && (
                <button 
                  onClick={() => togglePlan('business-max')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show All Features
                </button>
              )}
              
              {expandedPlans['business-max'] && (
                <button 
                  onClick={() => togglePlan('business-max')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less features
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Advisors Section */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Advisor Tools</h2>
            <p className="text-gray-600">Typical for Advisors managing exit planning for multiple clients</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Advisor Basic */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-gray-900">Advisor Basic</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Yearly</span>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-blue-600 cursor-pointer"></label>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-6">Help clients explore succession options—faster and with less overhead</p>
              
              <div className="mb-6">
                <span className="text-gray-400 line-through text-lg">$480</span>
                <span className="text-4xl font-bold text-gray-900 ml-2">$350</span>
                <p className="text-gray-600 text-sm">/ seat / year</p>
              </div>

              {currentCompany?.hasAdvisorPlan === 'basic' ? (
                <div className="space-y-2 mb-8">
                  <div className="text-center mb-2">
                    <span className="text-sm text-gray-600">
                      {currentCompany.advisorLicenses?.active || 0} active seats • {currentCompany.advisorLicenses?.inactive || 0} inactive seats
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Purchase another seat
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">
                    Manage seats
                  </button>
                </div>
              ) : (
                <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md mb-8 hover:bg-gray-50">
                  Purchase
                </button>
              )}

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Multi-client access: Manage all your clients from one login
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Collaborate with clients and teammates
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Earn upto 15% referral discount on every Business Max plan purchase
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Join exclusive events for Advisor Tier members
                </li>
                {expandedPlans['advisor-basic'] && (
                  <>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Advanced reporting and analytics
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Custom workflow automation
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Integration with CRM systems
                    </li>
                  </>
                )}
              </ul>
              
              {!expandedPlans['advisor-basic'] && (
                <button 
                  onClick={() => togglePlan('advisor-basic')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show All Features
                </button>
              )}
              
              {expandedPlans['advisor-basic'] && (
                <button 
                  onClick={() => togglePlan('advisor-basic')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less features
                </button>
              )}
            </div>

            {/* Advisor Premium */}
            <div className="bg-white rounded-lg border-2 border-blue-600 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-3 py-1 text-xs font-medium rounded-full">POPULAR</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advisor Premium</h3>
              <p className="text-gray-600 text-sm mb-6">Grow your practice with unlimited clients and powerful tracking tools</p>
              
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$3,000</span>
                <p className="text-gray-600 text-sm">/ seat / year</p>
              </div>

              {currentCompany?.hasAdvisorPlan === 'premium' ? (
                <div className="space-y-2 mb-8">
                  <div className="text-center mb-2">
                    <span className="text-sm text-gray-600">
                      {currentCompany.advisorLicenses?.active || 0} active seats • {currentCompany.advisorLicenses?.inactive || 0} inactive seats
                    </span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Purchase another seat
                  </button>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50">
                    Manage seats
                  </button>
                </div>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md mb-8 hover:bg-blue-700">
                  Purchase
                </button>
              )}

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Everything in Advisor Basic, plus:
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Create unlimited client accounts on the Business Mini plan—no extra fees
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Earn upto 30% referral discount or commission on every Business Max plan purchase
                </li>
                {expandedPlans['advisor-premium'] && (
                  <>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Dedicated account manager
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Custom integrations and API access
                    </li>
                    <li className="flex items-start">
                      <Check className="w-4 h-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      Advanced security and compliance features
                    </li>
                  </>
                )}
              </ul>
              
              {!expandedPlans['advisor-premium'] && (
                <button 
                  onClick={() => togglePlan('advisor-premium')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Show All Features
                </button>
              )}
              
              {expandedPlans['advisor-premium'] && (
                <button 
                  onClick={() => togglePlan('advisor-premium')}
                  className="flex items-center text-blue-600 text-sm hover:text-blue-700 mt-4"
                >
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Show less features
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel */}
      <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Debug Panel</h3>
          <button 
            onClick={() => setShowDebug(!showDebug)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showDebug ? '−' : '+'}
          </button>
        </div>
        
        {showDebug && (
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-medium text-gray-700">Company:</span>
              <span className="ml-2 text-gray-600">{selectedCompany}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Current Plan:</span>
              <span className="ml-2 text-gray-600">{currentCompany?.plan}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Advisor Plan:</span>
              <span className="ml-2 text-gray-600">{currentCompany?.hasAdvisorPlan || 'None'}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Current Scenario:</span>
              <span className="ml-2 text-gray-600">{getCurrentScenario()}</span>
            </div>
            
            <div className="pt-2 border-t border-gray-100">
              <span className="font-medium text-gray-700 mb-2 block">Switch Use Cases:</span>
              <div className="grid grid-cols-2 gap-1">
                <button 
                  onClick={() => setSelectedCompany('TechStart Inc')}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Use Case 1
                </button>
                <button 
                  onClick={() => setSelectedCompany('Acme Corp')}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Use Case 2
                </button>
                <button 
                  onClick={() => setSelectedCompany('GlobalTech Solutions')}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Use Case 3
                </button>
                <button 
                  onClick={() => setSelectedCompany('Innovate Labs')}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Use Case 4
                </button>
                <button 
                  onClick={() => setSelectedCompany('Advisor Pro')}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Use Case 5
                </button>
                <button 
                  onClick={() => {
                    setSelectedCompany('Innovate Labs');
                    // For use case 6, we'd need to simulate viewing a linked company
                    // This could be enhanced with a separate linked company view
                  }}
                  className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Use Case 6
                </button>
              </div>
            </div>
            
            {currentCompany?.advisorLicenses && (
              <div className="pt-2 border-t border-gray-100">
                <span className="font-medium text-gray-700">Seats:</span>
                <div className="mt-1 text-gray-600">
                  {currentCompany.advisorLicenses.active} active • {currentCompany.advisorLicenses.inactive} inactive
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;