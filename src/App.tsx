import React from 'react';
import { Check, Building2, ChevronDown, ChevronUp, Users, Globe, Settings, Target, TrendingUp, Crown, Star, Zap, Plus } from 'lucide-react';

function App() {
  const [expandedPlans, setExpandedPlans] = React.useState<Record<string, boolean>>({});
  const [selectedCompany, setSelectedCompany] = React.useState('Acme Corp');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('business');
  const [showComparison, setShowComparison] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [showDebug, setShowDebug] = React.useState(false);
  
  // New state for comparison plan selection
  const [comparisonPlans, setComparisonPlans] = React.useState(['Business Free', 'Business Max', 'Advisor Premium']);
  const [comparisonDropdownsOpen, setComparisonDropdownsOpen] = React.useState<Record<number, boolean>>({});

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
      const target = event.target as Element;
      
      // Don't close if clicking on the company card button
      if (target.closest('.company-card-button')) {
        return;
      }
      
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCompanyDropdownOpen(false);
      }
      
      // Close comparison dropdowns when clicking outside
      if (!target.closest('.comparison-dropdown')) {
        setComparisonDropdownsOpen({});
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

  // Helper functions for comparison plan management
  const toggleComparisonDropdown = (index: number) => {
    setComparisonDropdownsOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const switchComparisonPlan = (index: number, newPlan: string) => {
    setComparisonPlans(prev => {
      const newPlans = [...prev];
      newPlans[index] = newPlan;
      return newPlans;
    });
    setComparisonDropdownsOpen(prev => ({
      ...prev,
      [index]: false
    }));
  };

  const getAllAvailablePlans = () => {
    return ['Business Free', 'Business Mini', 'Business Max', 'Advisor Basic', 'Advisor Premium'];
  };

  const getPlanPrice = (planName: string) => {
    const prices: Record<string, string> = {
      'Business Free': '$0/year',
      'Business Mini': '$100/year',
      'Business Max': '$1,000/year',
      'Advisor Basic': '$50/year',
      'Advisor Premium': '$200/year'
    };
    return prices[planName] || '$0/year';
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

  // Feature comparison data
  const featureComparison = {
    'Business Free': {
      'Day Zero Guide': 'full',
      'Valuation report - Aha Planner (DIY)': 'none',
      'Aha Planner - full exit analysis, Statements, KPIs': 'none',
      'What If Simulator': 'none',
      'Market comparable': 'none',
      'Team collaboration': 'full',
      'Referrals & Commissions': 'none',
      'Multi client management': 'none',
      'Advisor dashboard': 'none'
    },
    'Business Mini': {
      'Day Zero Guide': 'full',
      'Valuation report - Aha Planner (DIY)': 'full',
      'Aha Planner - full exit analysis, Statements, KPIs': 'none',
      'What If Simulator': 'none',
      'Market comparable': 'none',
      'Team collaboration': 'full',
      'Referrals & Commissions': 'none',
      'Multi client management': 'none',
      'Advisor dashboard': 'none'
    },
    'Business Max': {
      'Day Zero Guide': 'full',
      'Valuation report - Aha Planner (DIY)': 'full',
      'Aha Planner - full exit analysis, Statements, KPIs': 'full',
      'What If Simulator': 'full',
      'Market comparable': 'full',
      'Team collaboration': 'full',
      'Referrals & Commissions': 'none',
      'Multi client management': 'none',
      'Advisor dashboard': 'none'
    },
    'Advisor Basic': {
      'Day Zero Guide': 'full',
      'Valuation report - Aha Planner (DIY)': 'none',
      'Aha Planner - full exit analysis, Statements, KPIs': 'none',
      'What If Simulator': 'none',
      'Market comparable': 'none',
      'Team collaboration': 'full',
      'Referrals & Commissions': 'full',
      'Multi client management': 'full',
      'Advisor dashboard': 'full'
    },
    'Advisor Premium': {
      'Day Zero Guide': 'full',
      'Valuation report - Aha Planner (DIY)': 'full',
      'Aha Planner - full exit analysis, Statements, KPIs': 'none',
      'What If Simulator': 'none',
      'Market comparable': 'none',
      'Team collaboration': 'full',
      'Referrals & Commissions': 'full',
      'Multi client management': 'full',
      'Advisor dashboard': 'full'
    }
  };

  const getFeatureIcon = (feature: string, level: string, plan?: string) => {
    if (level === 'full') {
      // Special case for Advisor Premium with client discount text
      if (plan === 'Advisor Premium' && feature === 'Valuation report - Aha Planner (DIY)') {
        return (
          <div className="flex flex-col items-center">
            <Check className="w-5 h-5 text-green-600 mb-1" />
            <span className="text-xs text-gray-600 font-medium">unlimited valuations for your clients</span>
          </div>
        );
      }
      return (
        <Check className="w-5 h-5 text-green-600" />
      );
    }
    if (level === 'partial') return <div className="w-5 h-5 bg-yellow-100 rounded-full flex items-center justify-center"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div></div>;
    return <div className="w-5 h-5 text-gray-300 text-center font-bold">—</div>;
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
        {/* Enhanced Hero Section */}
        <div className="text-center mb-16">
          {/* Hero Content */}
          <div className="mb-8">
            <div className="relative mb-8">
              <h1 className="text-6xl font-bold text-gray-900 mb-8 mt-8">
                Pricing that pays for itself
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Unlock value in your business—wherever you are in your exit journey
              </p>
            </div>
          </div>

          {/* Company Switcher */}
          <div className="max-w-md mx-auto">
            <button
              onClick={() => setIsCompanyDropdownOpen(!isCompanyDropdownOpen)}
              className="company-card-button w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-3 h-3 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900">{selectedCompany}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 font-medium">Currently viewing</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span><span className="font-medium">{currentCompany?.plan}</span> • {currentCompany?.users} users</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCompanyDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Company Dropdown */}
            {isCompanyDropdownOpen && (
              <div className="absolute mt-2 w-[450px] bg-white border border-gray-200 rounded-lg shadow-lg z-50" ref={dropdownRef}>
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-base font-semibold text-gray-900 mb-2">Switch Company</h3>
                    <p className="text-sm text-gray-600">Choose which company to view plans for</p>
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
                                <span>{company.plan}{company.hasAdvisorPlan && `, ${company.hasAdvisorPlan} advisor`}</span>
                                <span>•</span>
                                <span>{company.users} users</span>
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
                                                                      <div className="font-medium text-gray-900">
                                    {company.name}
                                  </div>
                                                                      <div className="text-sm text-gray-600 flex items-center space-x-2">
                                    <span>{company.plan}{company.hasAdvisorPlan && `, ${company.hasAdvisorPlan} advisor`}</span>
                                    <span>•</span>
                                    <span>{company.users} users</span>
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
                  
                  <div className="p-4 border-t border-gray-100">
                    <button className="w-full flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 font-medium">
                      <Plus className="w-4 h-4" />
                      <span>Create New Company</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Advisor Link */}
        <div className="text-center -mt-10 mb-16">
          <p className="text-gray-600">
            Are you an advisor?{' '}
            <span 
              className="text-blue-600 underline cursor-pointer hover:text-blue-700" 
              onClick={() => document.getElementById('advisor-plans')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View advisor plans →
            </span>
          </p>
        </div>

        {/* Business Owners Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Business plans</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Business Free */}
            <div className={`bg-white rounded-lg border p-8 relative ${
              isCurrentPlan('Business Free') 
                ? 'border-blue-300' 
                : isRecommendedPlan('Business Free')
                ? 'border-purple-500 ring-2 ring-purple-100'
                : 'border-gray-200'
            }`}>
              {isCurrentPlan('Business Free') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium rounded-full border border-blue-200">CURRENT PLAN</span>
                </div>
              )}
              {isRecommendedPlan('Business Free') && !isCurrentPlan('Business Free') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="text-white px-3 py-1 text-xs font-medium rounded-full" style={{backgroundColor: '#5C00B8'}}>POPULAR</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Free</h3>
              <p className="text-gray-600 text-sm mb-6">
                <span className="font-semibold text-gray-900">Get a personalized roadmap</span> of your exit options—at no cost.
              </p>
              
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
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Compare exit paths based on your goals with Day Zero Guide
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Invite team members or advisors to collaborate
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Pre-built AI prompts with Zolid AI for common exit planning questions
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Upgrade anytime
                </li>
              </ul>
              

            </div>

            {/* Business Mini */}
            <div className={`bg-white rounded-lg border p-8 relative ${
              isCurrentPlan('Business Mini') 
                ? 'border-blue-300' 
                : isRecommendedPlan('Business Mini')
                ? 'border-purple-500 ring-2 ring-purple-100'
                : 'border-gray-200'
            }`}>
              {isCurrentPlan('Business Mini') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium rounded-full border border-blue-200">CURRENT PLAN</span>
                </div>
              )}
              {isRecommendedPlan('Business Mini') && !isCurrentPlan('Business Mini') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="text-white px-3 py-1 text-xs font-medium rounded-full" style={{backgroundColor: '#5C00B8'}}>POPULAR</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Mini</h3>
              <p className="text-gray-600 text-sm mb-6">
                <span className="font-semibold text-gray-900">See what your business might be worth</span> and how that impacts your path.
              </p>
              
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
                  <button className="w-full bg-transparent text-blue-600 py-2 px-4 rounded-md hover:bg-gray-50">
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
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-gray-900">Everything in Business Free, plus:</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Get business valuation with basic Aha Planner
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Collaborate with your team or advisor
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Custom AI prompts with Zolid AI for personalized exit planning insights
                </li>
              </ul>
              

            </div>

            {/* Business Max */}
            <div className={`bg-white rounded-lg border p-8 relative ${
              isCurrentPlan('Business Max') 
                ? 'border-blue-300' 
                : isRecommendedPlan('Business Max')
                ? 'border-purple-500 ring-2 ring-purple-100'
                : 'border-gray-200'
            }`}>
              {isCurrentPlan('Business Max') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-medium rounded-full border border-blue-200">CURRENT PLAN</span>
                </div>
              )}
              {isRecommendedPlan('Business Max') && !isCurrentPlan('Business Max') && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="text-white px-3 py-1 text-xs font-medium rounded-full" style={{backgroundColor: '#5C00B8'}}>POPULAR</span>
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Business Max</h3>
              <p className="text-gray-600 text-sm mb-6">
                <span className="font-semibold text-gray-900">A full planning toolkit</span> to prepare your business for transition.
              </p>
              
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
                  <button className="w-full bg-transparent text-blue-600 py-2 px-4 rounded-md hover:bg-gray-50">
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
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-gray-900">Everything in Business Mini, plus:</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Complete valuation with 21 KPIs, financial feasibility of exit options, scenario modeling, and more with Aha Planner
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Access data on market comps transactions
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Custom AI prompts with Zolid AI for personalized exit planning insights
                </li>

              </ul>
              

            </div>
          </div>
        </div>

        {/* Advisors Section */}
        <div id="advisor-plans">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Advisor Plans</h2>
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
              
              <p className="text-gray-600 text-sm mb-6">
                <span className="font-semibold text-gray-900">Help clients explore succession options</span>—faster and with less overhead.
              </p>
              
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
                  <button className="w-full bg-transparent text-blue-600 py-2 px-4 rounded-md hover:bg-gray-50">
                    Manage seats
                  </button>
                </div>
              ) : (
                <button className="w-full bg-white border border-blue-600 text-blue-600 py-2 px-4 rounded-md mb-8 hover:bg-blue-50">
                  Purchase
                </button>
              )}

              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Multi-client access: Manage all your clients from one login
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Collaborate with clients and teammates
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Earn upto 15% referral discount on every Business Max plan purchase
                </li>
              </ul>
              

            </div>

            {/* Advisor Premium */}
            <div className="bg-white rounded-lg border-2 border-purple-500 p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="text-white px-3 py-1 text-xs font-medium rounded-full" style={{backgroundColor: '#5C00B8'}}>POPULAR</span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">Advisor Premium</h3>
              
              <p className="text-gray-600 text-sm mb-6">
                <span className="font-semibold text-gray-900">Grow your practice with unlimited clients</span> and powerful tracking tools.
              </p>
              
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
                  <button className="w-full bg-transparent text-blue-600 py-2 px-4 rounded-md hover:bg-gray-50">
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
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="font-medium text-gray-900">Everything in Advisor Basic, plus:</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Generate unlimited valuation reports for all your clients or even prospective ones.
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  Earn upto 30% referral discount or commission on every Business Max plan purchase
                </li>
              </ul>
              

            </div>
          </div>
        </div>

        {/* Feature Comparison Matrix */}
        <div className="mb-20 mt-32">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Compare Plans</h2>
            <p className="text-gray-600">See exactly what's included in each plan</p>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mx-auto" style={{ width: '80vw' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900"></th>
                    {comparisonPlans.map((plan, index) => (
                      <th key={index} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                        <div className="flex flex-col items-center">
                          <div className="relative">
                            <button
                              onClick={() => toggleComparisonDropdown(index)}
                              className="comparison-dropdown flex items-center justify-between w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            >
                              <span className="font-bold text-gray-900">{plan}</span>
                              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${comparisonDropdownsOpen[index] ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Plan Selection Dropdown */}
                            {comparisonDropdownsOpen[index] && (
                              <div className="comparison-dropdown absolute left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="py-1">
                                  {getAllAvailablePlans().map((availablePlan) => (
                                    <button
                                      key={availablePlan}
                                      onClick={() => switchComparisonPlan(index, availablePlan)}
                                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                                        comparisonPlans[index] === availablePlan ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                      }`}
                                    >
                                      <div className="flex items-center justify-between">
                                        <span>{availablePlan}</span>
                                        {comparisonPlans[index] === availablePlan && (
                                          <Check className="w-4 h-4" />
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 mt-3 font-medium">{getPlanPrice(plan)}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.keys(featureComparison['Business Free']).map((feature) => (
                    <tr key={feature} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{feature}</td>
                      {comparisonPlans.map((plan, index) => (
                        <td key={index} className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            {getFeatureIcon(feature, featureComparison[plan]?.[feature] || 'none', plan)}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          

          
          {showComparison && (
            <div className="mt-8 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Feature Breakdown</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {comparisonPlans.map((plan, index) => (
                  <div key={index}>
                    <h4 className="font-medium text-gray-900 mb-3">{plan}</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {Object.entries(featureComparison[plan] || {}).map(([feature, level]) => (
                        <li key={feature} className="flex items-start">
                          {level === 'full' ? (
                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          ) : level === 'partial' ? (
                            <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                          ) : (
                            <div className="w-4 h-4 bg-gray-200 rounded-full mr-2 mt-0.5 flex-shrink-0"></div>
                          )}
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
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