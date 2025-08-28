import React from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FiBookOpen, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AcquisitionSpecial: React.FC = () => {
  const { isLoading, error } = useTaxData();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    toast.error('취득세 특례 데이터를 불러오는 중 오류가 발생했습니다.');
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로드 실패</h2>
        <p className="text-gray-600 mb-4">취득세 특례 정보를 불러올 수 없습니다.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-4">
          <FiBookOpen className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">취득세 특례</h1>
            <p className="text-gray-600 mt-1">
              취득세 감면 및 특례 적용 기준을 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 주요 특례 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">1세대 1주택 특례</h3>
              <p className="text-gray-600 text-sm">주택 취득세 감면</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-gray-600">취득세율: 0.8%</span>
            </div>
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-gray-600">농특세 비과세</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              상속으로 1세대 1주택을 취득하는 경우
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">농지 취득 특례</h3>
              <p className="text-gray-600 text-sm">농업인 농지 취득</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-gray-600">취득세율: 2.3%</span>
            </div>
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-gray-600">농특세: 0.46%</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              농업인이 직접 농업에 사용할 농지 취득
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiCheckCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">서민주택 특례</h3>
              <p className="text-gray-600 text-sm">85㎡ 이하 주택</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-gray-600">농특세 비과세</span>
            </div>
            <div className="flex items-center text-sm">
              <FiCheckCircle className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-gray-600">지방교육세 감면</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              주거전용면적 85㎡ 이하 서민주택
            </div>
          </div>
        </div>
      </div>

      {/* 특례 적용 조건 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">특례 적용 조건</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">감면 대상</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">1세대 1주택자</p>
                  <p className="text-gray-600 text-sm">상속으로 주택을 취득하는 경우</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">농업인</p>
                  <p className="text-gray-600 text-sm">직접 농업에 사용할 농지 취득</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiCheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">서민주택</p>
                  <p className="text-gray-600 text-sm">85㎡ 이하 주택 취득자</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">제외 대상</h3>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiAlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">투기지역 다주택</p>
                  <p className="text-gray-600 text-sm">2주택 이상 보유 시 중과세</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiAlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">고급주택</p>
                  <p className="text-gray-600 text-sm">시가 9억원 초과 주택</p>
                </div>
              </div>
              <div className="flex items-start">
                <FiAlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">사치성 재산</p>
                  <p className="text-gray-600 text-sm">골프장, 고급오락장 등</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 신청 절차 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">특례 신청 절차</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">요건 확인</h3>
            <p className="text-gray-600 text-sm">특례 적용 요건 사전 확인</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">서류 준비</h3>
            <p className="text-gray-600 text-sm">필요 서류 및 증명서 준비</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">신고·신청</h3>
            <p className="text-gray-600 text-sm">세무서 또는 온라인 신고</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">4</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">승인·확정</h3>
            <p className="text-gray-600 text-sm">특례 적용 승인 및 세액 확정</p>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <FiAlertTriangle className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">특례 적용 시 주의사항</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>• 특례 적용 요건을 충족하지 않을 경우 추징될 수 있습니다.</p>
              <p>• 특례 신청은 취득일로부터 60일 이내에 해야 합니다.</p>
              <p>• 관련 증빙서류를 반드시 구비하여 신청하시기 바랍니다.</p>
              <p>• 법령 변경에 따라 특례 내용이 달라질 수 있으니 최신 정보를 확인하세요.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionSpecial;