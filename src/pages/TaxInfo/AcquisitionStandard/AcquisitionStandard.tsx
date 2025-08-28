import React from 'react';
import { useTaxData } from '@/hooks/useTaxData';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { FiLayers } from 'react-icons/fi';
import toast from 'react-hot-toast';

const AcquisitionStandard: React.FC = () => {
  const { isLoading, error } = useTaxData();

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    toast.error('취득세 과세표준 데이터를 불러오는 중 오류가 발생했습니다.');
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">데이터 로드 실패</h2>
        <p className="text-gray-600 mb-4">취득세 과세표준 정보를 불러올 수 없습니다.</p>
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
          <FiLayers className="h-8 w-8 text-blue-600 mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">취득세 과세표준</h1>
            <p className="text-gray-600 mt-1">
              취득세 과세표준 산정 기준을 확인하세요
            </p>
          </div>
        </div>
      </div>

      {/* 과세표준 유형별 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">부동산 과세표준</h3>
              <p className="text-gray-600 text-sm">토지 및 건물의 과세표준</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium text-gray-900">시가표준액</h4>
              <p className="text-gray-600 text-sm">개별공시지가 × 면적 × 공정시장가액비율</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-medium text-gray-900">실지거래가액</h4>
              <p className="text-gray-600 text-sm">실제 거래된 가액 (계약서상 금액)</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FiLayers className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">주택 과세표준</h3>
              <p className="text-gray-600 text-sm">주택 취득 시 적용 기준</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-medium text-gray-900">신축주택</h4>
              <p className="text-gray-600 text-sm">건축비 + 토지가격</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-medium text-gray-900">기존주택</h4>
              <p className="text-gray-600 text-sm">시가표준액 또는 실지거래가액 중 높은 금액</p>
            </div>
          </div>
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
            <h3 className="font-medium text-gray-900 mb-2">취득원인 확인</h3>
            <p className="text-gray-600 text-sm">유상/무상/원시취득 구분</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">가액 산정</h3>
            <p className="text-gray-600 text-sm">시가표준액 vs 실지거래가액</p>
          </div>
          <div className="text-center">
            <div className="bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="text-orange-600 font-bold">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">공제액 차감</h3>
            <p className="text-gray-600 text-sm">법정 공제사유 적용</p>
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
            <h3 className="text-sm font-medium text-yellow-800">주의사항</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>• 과세표준 산정 시 관련 법령과 지역별 조례를 반드시 확인하시기 바랍니다.</p>
              <p>• 실제 신고 시에는 세무전문가와 상담하시는 것을 권장합니다.</p>
              <p>• 특례나 감면 적용 여부에 따라 과세표준이 달라질 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcquisitionStandard;