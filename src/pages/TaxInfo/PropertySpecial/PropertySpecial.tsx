import React from 'react';
import { FiBookOpen, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const PropertySpecial: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FiBookOpen className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">재산세 특례</h1>
            <p className="text-gray-600 mt-1">
              재산세 감면 및 특례 적용 기준을 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 주요 재산세 특례 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">1세대 1주택 특례</h3>
              <p className="text-gray-600 text-sm">주택 재산세 감면</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-gray-600">공시가격 6억원 이하: 25% 감면</span>
            </div>
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-gray-600">고령자·장애인 추가 감면</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              1세대가 1주택만 보유하는 경우
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">농지 감면</h3>
              <p className="text-gray-600 text-sm">농업용 토지 감면</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-gray-600">농지: 50% 감면</span>
            </div>
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-gray-600">축사·농업용 창고: 50% 감면</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              농업인이 직접 농업에 사용하는 농지
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">소상공인 특례</h3>
              <p className="text-gray-600 text-sm">소상공인 사업장 감면</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-gray-600">소상공인 사업장: 50% 감면</span>
            </div>
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-gray-600">영세사업자 추가 혜택</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              일정 규모 이하 소상공인 사업장
            </div>
          </div>
        </div>
      </div>

      {/* 감면 대상 및 비율 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">감면 대상 및 비율</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">대상</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">감면율</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">기준</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">1세대 1주택</td>
                <td className="px-4 py-4 text-sm text-gray-900">1세대가 1주택만 소유</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">25%</td>
                <td className="px-4 py-4 text-sm text-gray-500">공시가격 6억원 이하</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">농지</td>
                <td className="px-4 py-4 text-sm text-gray-900">농업인 직접 경작 농지</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">50%</td>
                <td className="px-4 py-4 text-sm text-gray-500">농업경영체 등록</td>
              </tr>
              <tr>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">임야</td>
                <td className="px-4 py-4 text-sm text-gray-900">산림소유자 보유 임야</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">50%</td>
                <td className="px-4 py-4 text-sm text-gray-500">임업경영체 등록</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">소상공인</td>
                <td className="px-4 py-4 text-sm text-gray-900">소상공인 사업장</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">50%</td>
                <td className="px-4 py-4 text-sm text-gray-500">매출액 기준</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 특례 적용 조건 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">특례 적용 조건</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">필수 요건</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">거주 요건</p>
                  <p className="text-gray-600 text-sm">1세대 1주택의 경우 실제 거주 필요</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">소유 기간</p>
                  <p className="text-gray-600 text-sm">일정 기간 이상 소유 필요</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">용도 제한</p>
                  <p className="text-gray-600 text-sm">해당 용도로만 사용해야 함</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">신청 절차</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-blue-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">신청서 작성</p>
                  <p className="text-gray-600 text-sm">감면신청서 및 구비서류 준비</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">제출</p>
                  <p className="text-gray-600 text-sm">해당 지방자치단체에 제출</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-orange-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">
                  <span className="text-orange-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">심사·승인</p>
                  <p className="text-gray-600 text-sm">요건 심사 후 감면 적용</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 신청 기한 및 유의사항 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiCheckCircle className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-blue-900">신청 기한</h3>
          </div>
          <div className="space-y-2 text-blue-700">
            <p className="text-sm">• 과세기준일로부터 60일 이내</p>
            <p className="text-sm">• 부과고지를 받은 날로부터 30일 이내</p>
            <p className="text-sm">• 사유 발생일로부터 60일 이내</p>
            <p className="text-xs text-blue-600 mt-2">※ 지자체별로 다를 수 있음</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <FiAlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-medium text-yellow-800">주의사항</h3>
          </div>
          <div className="space-y-2 text-yellow-700">
            <p className="text-sm">• 허위 신청 시 3배 추징</p>
            <p className="text-sm">• 용도 변경 시 감면 취소</p>
            <p className="text-sm">• 매년 재신청 필요한 경우 있음</p>
            <p className="text-xs text-yellow-600 mt-2">※ 정확한 정보는 해당 지자체 확인</p>
          </div>
        </div>
      </div>

      {/* 필요 서류 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">필요 서류</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">1세대 1주택</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 감면신청서</li>
              <li>• 주민등록등본</li>
              <li>• 건물등기부등본</li>
              <li>• 거주사실확인서</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">농지 감면</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 감면신청서</li>
              <li>• 농업경영체증명서</li>
              <li>• 농지원부</li>
              <li>• 직접경작확인서</li>
            </ul>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">소상공인</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• 감면신청서</li>
              <li>• 사업자등록증</li>
              <li>• 매출액증명서</li>
              <li>• 임대차계약서</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySpecial;