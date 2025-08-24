import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBook, FiUser, FiTrendingUp } from 'react-icons/fi';

const Home: React.FC = () => {
  const features = [
    {
      icon: FiBook,
      title: '세금 정보 조회',
      description: '취득세, 지방교육세, 농어촌특별세 등 다양한 세금 정보를 확인하세요.',
      link: '/tax-info',
      color: 'bg-blue-500',
    },
    {
      icon: FiUser,
      title: '세금 계산기',
      description: '부동산 취득 시 필요한 세금을 간편하게 계산해보세요.',
      link: '/calculator',
      color: 'bg-green-500',
    },
    {
      icon: FiTrendingUp,
      title: '세율 분석',
      description: '최신 세율 동향과 변경사항을 한눈에 파악하세요.',
      link: '/guide',
      color: 'bg-purple-500',
    },
  ];

  const recentUpdates = [
    { title: '2024년 부동산 취득세율 변경', date: '2024.08.15', category: '정책변경' },
    { title: '조정대상지역 추가 지정', date: '2024.08.01', category: '지역정보' },
    { title: '농어촌특별세 감면 조건 완화', date: '2024.07.15', category: '세제혜택' },
  ];



  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-lg p-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">
            대한민국 세금 정보 포털
          </h1>
          <p className="text-xl mb-6 opacity-90">
            복잡한 세금 정보를 쉽고 빠르게 확인하세요. 
            최신 세율부터 계산까지 모든 것을 한 곳에서.
          </p>
          <div className="flex space-x-4">
            <Link
              to="/tax-info"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
            >
              세금 정보 보기
            </Link>
            <Link
              to="/calculator"
              className="border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              계산기 사용하기
            </Link>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.title}
              to={feature.link}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
              <div className="flex items-center text-blue-600 text-sm font-medium">
                자세히 보기 <FiArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>



      {/* Recent Updates */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">최근 업데이트</h2>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{update.title}</h3>
                  <p className="text-sm text-gray-500">{update.date}</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                  {update.category}
                </span>
              </div>
            ))}
          </div>
          <Link
            to="/guide"
            className="mt-4 text-blue-600 text-sm font-medium flex items-center"
          >
            전체 보기 <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">자주 찾는 정보</h2>
          <div className="space-y-3">
            <Link
              to="/tax-info/paid"
              className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">부동산 유상취득 세율</div>
              <div className="text-sm text-gray-600">주택, 토지 취득 시 적용되는 세율</div>
            </Link>
            <Link
              to="/calculator"
              className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">취득세 계산기</div>
              <div className="text-sm text-gray-600">간편하게 세금을 계산해보세요</div>
            </Link>
            <Link
              to="/tax-info/housing"
              className="block p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="font-medium">주택 관련 세율</div>
              <div className="text-sm text-gray-600">주택 수에 따른 차등 세율</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;