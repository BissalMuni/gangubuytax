import React from 'react';
import { FiLayers } from 'react-icons/fi';

const PropertyStandard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FiLayers className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">재산세 과세표준</h1>
            <p className="text-gray-600 mt-1">
              재산세 과세표준 산정 기준을 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 과세표준 산정 원칙 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">과세표준 산정 원칙</h2>
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-900 mb-2">
              과세표준 = 공시가격 × 공정시장가액비율
            </div>
            <p className="text-blue-700">재산세 과세표준의 기본 산정 공식</p>
          </div>
        </div>
      </div>

      {/* 재산 유형별 과세표준 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">주택 과세표준</h3>
              <p className="text-gray-600 text-sm">주택 재산세 과세표준</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">공시가격 기준</h4>
              <p className="text-gray-600 text-sm">개별주택가격 × 공정시장가액비율</p>
              <p className="text-gray-500 text-xs">공정시장가액비율: 60% (2024년 기준)</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">신축주택</h4>
              <p className="text-gray-600 text-sm">건축비 + 부속토지 가격</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">토지 과세표준</h3>
              <p className="text-gray-600 text-sm">토지 재산세 과세표준</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">공시지가 기준</h4>
              <p className="text-gray-600 text-sm">개별공시지가 × 면적 × 공정시장가액비율</p>
              <p className="text-gray-500 text-xs">공정시장가액비율: 70% (2024년 기준)</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900">농지·임야</h4>
              <p className="text-gray-600 text-sm">개별공시지가 × 면적 × 공정시장가액비율</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">건축물 과세표준</h3>
              <p className="text-gray-600 text-sm">건축물 재산세 과세표준</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium text-gray-900">시가표준액</h4>
              <p className="text-gray-600 text-sm">건물신축가격기준액 × 구조지수 × 용도지수 × 위치지수</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h4 className="font-medium text-gray-900">공정시장가액비율</h4>
              <p className="text-gray-600 text-sm">70% (2024년 기준)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">선박 과세표준</h3>
              <p className="text-gray-600 text-sm">선박 재산세 과세표준</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900">신조선박</h4>
              <p className="text-gray-600 text-sm">건조가격 또는 수입가격</p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h4 className="font-medium text-gray-900">중고선박</h4>
              <p className="text-gray-600 text-sm">시가표준액 (감가상각 적용)</p>
            </div>
          </div>
        </div>
      </div>

      {/* 공정시장가액비율 변화 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">공정시장가액비율 변화</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연도</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">주택</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">토지</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">건축물</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2024</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">60%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">70%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">70%</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2023</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">60%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">70%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">70%</td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">2022</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">60%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">70%</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">70%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 과세표준 산정 절차 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">과세표준 산정 절차</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">재산 분류</h3>
            <p className="text-gray-600 text-sm">주택, 토지, 건축물, 선박 구분</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">공시가격 확정</h3>
            <p className="text-gray-600 text-sm">해당 연도 공시가격 적용</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">비율 적용</h3>
            <p className="text-gray-600 text-sm">공정시장가액비율 곱하기</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">4</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">과세표준 확정</h3>
            <p className="text-gray-600 text-sm">최종 과세표준 산출</p>
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
            <h3 className="text-sm font-medium text-yellow-800">과세표준 관련 주의사항</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>• 공정시장가액비율은 매년 변경될 수 있습니다.</p>
              <p>• 재산의 실제 거래가격과 과세표준은 다를 수 있습니다.</p>
              <p>• 특례나 감면 적용 시 과세표준이 조정될 수 있습니다.</p>
              <p>• 정확한 과세표준은 과세통지서를 통해 확인하시기 바랍니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyStandard;