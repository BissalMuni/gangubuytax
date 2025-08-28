import React from 'react';
import { FiPercent } from 'react-icons/fi';

const PropertyRates: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FiPercent className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">재산세 세율</h1>
            <p className="text-gray-600 mt-1">
              재산세 세율 정보를 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 재산세 세율 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiPercent className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">주택 재산세</h3>
              <p className="text-gray-600 text-sm">주택에 대한 재산세율</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">6천만원 이하</span>
              <span className="font-medium">0.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">1.5억원 이하</span>
              <span className="font-medium">0.15%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">3억원 이하</span>
              <span className="font-medium">0.25%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">3억원 초과</span>
              <span className="font-medium text-red-600">0.4%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiPercent className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">토지 재산세</h3>
              <p className="text-gray-600 text-sm">토지에 대한 재산세율</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">종합합산</span>
              <span className="font-medium">0.2% ~ 0.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">별도합산</span>
              <span className="font-medium">0.2% ~ 0.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">분리과세</span>
              <span className="font-medium">0.07% ~ 2.0%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiPercent className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">건축물 재산세</h3>
              <p className="text-gray-600 text-sm">건축물에 대한 재산세율</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">일반건축물</span>
              <span className="font-medium">0.25%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">주거용</span>
              <span className="font-medium">0.1% ~ 0.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">상업용</span>
              <span className="font-medium">0.25% ~ 0.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 재산세 과세 기준일 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">재산세 과세 기준일</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">주택·건축물·선박</h3>
            <p className="text-blue-700 text-sm">매년 6월 1일 현재 재산 상황</p>
            <p className="text-blue-600 text-xs mt-1">납세고지: 7월 / 납부기한: 9월 30일</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">토지</h3>
            <p className="text-green-700 text-sm">매년 6월 1일 현재 재산 상황</p>
            <p className="text-green-600 text-xs mt-1">납세고지: 9월 / 납부기한: 11월 30일</p>
          </div>
        </div>
      </div>

      {/* 재산세 계산 방법 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">재산세 계산 방법</h2>
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">재산세 = 과세표준 × 세율</div>
            <p className="text-gray-600">과세표준: 공시가격 × 공정시장가액비율</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-lg font-semibold text-gray-900 mb-1">1단계</div>
              <div className="text-sm text-gray-600">과세표준 산정</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-lg font-semibold text-gray-900 mb-1">2단계</div>
              <div className="text-sm text-gray-600">해당 세율 적용</div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-lg font-semibold text-gray-900 mb-1">3단계</div>
              <div className="text-sm text-gray-600">재산세액 산출</div>
            </div>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">재산세 관련 주의사항</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>• 재산세는 매년 과세기준일 현재의 재산 상황에 따라 과세됩니다.</p>
              <p>• 지역별로 세율이나 과세기준이 다를 수 있으니 해당 지자체에 확인하시기 바랍니다.</p>
              <p>• 재산세 감면이나 특례 적용 여부를 미리 확인하시기 바랍니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyRates;