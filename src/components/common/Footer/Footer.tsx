import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">세금 정보 시스템</h3>
          <p className="text-sm text-gray-300 mb-2">
            © 2024 Tax Information System. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            본 시스템은 정보 제공 목적으로만 사용되며, 법적 효력은 없습니다.
          </p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              이용약관
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;