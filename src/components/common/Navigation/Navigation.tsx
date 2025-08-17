import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { 
  FiHome, 
  FiFileText, 
  FiBookOpen,
  FiMenu,
  FiX,
  FiChevronDown,
  FiChevronRight
} from 'react-icons/fi';
import { HiCalculator } from 'react-icons/hi';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const mainMenuItems = [
    {
      id: 'home',
      label: '홈',
      path: '/',
      icon: <FiHome className="w-5 h-5" />
    },
    {
      id: 'tax',
      label: '세금 정보',
      icon: <FiFileText className="w-5 h-5" />,
      subItems: [
        { label: '취득세', path: '/tax-info/acquisition' },
        { label: '재산세', path: '/tax-info/property' },
        { label: '양도소득세', path: '/tax-info/transfer' },
        { label: '종합부동산세', path: '/tax-info/comprehensive' },
        { label: '상속세', path: '/tax-info/inheritance' },
        { label: '증여세', path: '/tax-info/gift' }
      ]
    },
    {
      id: 'calculator',
      label: '세금 계산기',
      path: '/calculator',
      icon: <HiCalculator className="w-5 h-5" />
    },
    {
      id: 'guide',
      label: '가이드',
      path: '/guide',
      icon: <FiBookOpen className="w-5 h-5" />
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">TaxInfo</span>
              </Link>
            </div>

            {/* Main Menu */}
            <div className="flex items-center space-x-1">
              {mainMenuItems.map((item) => (
                <div key={item.id} className="relative group">
                  {item.subItems ? (
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2
                        ${expandedMenus.includes(item.id) 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      <FiChevronDown 
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.path!}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2
                        ${isActive(item.path!) 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {item.subItems && expandedMenus.includes(item.id) && (
                    <div className="absolute top-full left-0 mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            className={`block px-4 py-2 text-sm transition-colors
                              ${isActive(subItem.path)
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'}`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-4">
              <button className="text-gray-600 hover:text-gray-900" title="알림">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">TaxInfo</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="px-4 pt-2 pb-4 space-y-1">
            {mainMenuItems.map((item) => (
              <div key={item.id}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      <FiChevronRight 
                        className={`w-4 h-4 transition-transform ${
                          expandedMenus.includes(item.id) ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedMenus.includes(item.id) && (
                      <div className="ml-8 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`block px-3 py-2 rounded-md text-sm
                              ${isActive(subItem.path)
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium
                      ${isActive(item.path!)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;