import React from 'react';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Enterprise Security",
      description: "AES-256 encryption, secure key storage, and compliance with industry standards including SOC 2 and GDPR.",
      color: "blue"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Real-time Analytics",
      description: "Monitor API usage, track performance metrics, and get insights into your API consumption patterns.",
      color: "green"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Smart Rate Limiting",
      description: "Automatically prevent API abuse with intelligent rate limiting and custom usage quotas.",
      color: "purple"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Team Management",
      description: "Collaborate with your team, assign permissions, and manage access controls across projects.",
      color: "indigo"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM16 3H4v2h12V3zM4 7h12v2H4V7zM4 11h12v2H4v-2z" />
        </svg>
      ),
      title: "API Documentation",
      description: "Auto-generated documentation, code examples, and SDKs for popular programming languages.",
      color: "yellow"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
      ),
      title: "Custom Integrations",
      description: "Connect with your existing tools and workflows through webhooks and custom integrations.",
      color: "red"
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      indigo: "bg-indigo-100 text-indigo-600",
      yellow: "bg-yellow-100 text-yellow-600",
      red: "bg-red-100 text-red-600"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Modern APIs</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Everything you need to manage, secure, and scale your API infrastructure with confidence
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 ${getColorClasses(feature.color)} rounded-full flex items-center justify-center mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for Scale and Security
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From startups to enterprise, our platform grows with your needs
            </p>
          </div>

          <div className="space-y-20">
            {/* Feature 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Advanced Security Controls</h3>
                <p className="text-gray-600 mb-6">
                  Protect your API keys with military-grade encryption, IP whitelisting, and time-based access controls. 
                  Our zero-trust architecture ensures your keys are never exposed.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    AES-256 encryption at rest and in transit
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    IP whitelisting and geolocation restrictions
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Time-based access and automatic expiration
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                    <div>$ curl -H "Authorization: Bearer ak_live_..." \</div>
                    <div className="ml-4">https://api.example.com/secure-endpoint</div>
                    <div className="text-green-300 mt-2">✓ Key validated</div>
                    <div className="text-green-300">✓ IP authorized</div>
                    <div className="text-green-300">✓ Rate limit: 95/100</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Get deep insights into your API usage patterns, performance metrics, and cost optimization opportunities. 
                  Make data-driven decisions with real-time dashboards.
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Real-time usage monitoring
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Cost tracking and optimization
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Custom alerts and notifications
                  </li>
                </ul>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">API Calls Today</span>
                      <span className="text-2xl font-bold text-blue-600">12,847</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-green-600">99.2%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-orange-600">145ms</div>
                        <div className="text-xs text-gray-600">Avg Response</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to experience these features?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start your free trial today and see how APIKey Pro can transform your API management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link 
              to="/pricing" 
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;