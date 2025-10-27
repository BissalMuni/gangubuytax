import axios from 'axios';
import { TaxRateFile, ProcessedTaxSection } from '@/types/tax.types';

// API 기본 설정
const api = axios.create({
  baseURL: '/',
  timeout: 10000,
});

// tax_rates 시스템 타입 정의
interface TaxRatesMain {
  version: string;
  description: string;
  last_updated: string;
  structure_version: string;
  system_info: {
    name: string;
    description: string;
    total_files: number;
    total_directories: number;
  };
  file_references: {
    personal: string[];
    corporate: string[];
    conditions: string[];
    relationships: string[];
    common: string[];
    validation: string[];
    references: string[];
    versions: string[];
  };
  dependencies: {
    all_files_reference: string[];
    calculation_system_reference: string[];
    version_management: string[];
  };
}

// TaxRateFile, TaxRateSection, TaxRateContent는 types/tax.types.ts에서 import

export class TaxService {
  /**
   * 메인 설정 파일 로드
   */
  static async getTaxRatesMain(): Promise<TaxRatesMain> {
    try {
      const response = await api.get('/data/tax_rates/main.json');
      return response.data;
    } catch (error) {
      console.error('main.json 로드 실패:', error);
      throw new Error('세율 시스템 설정을 불러올 수 없습니다.');
    }
  }

  /**
   * 법적 근거 데이터 로드
   */
  static async getLegalBasisData(): Promise<any> {
    try {
      const response = await api.get('/data/tax_rates/legal_basis.json');
      return response.data;
    } catch (error) {
      console.error('legal_basis.json 로드 실패:', error);
      throw new Error('법적 근거 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 통합된 취득세율 데이터 로드 (acquisitionrate.json)
   */
  static async getAcquisitionRates(): Promise<TaxRateFile[]> {
    try {
      const response = await api.get('/data/tax_rates/acquisitionrate.json');
      const dataArray = response.data;

      return dataArray;
    } catch (error) {
      console.error('취득세율 데이터 로드 실패:', error);
      throw new Error('취득세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 사치성 재산 취득세율 데이터 로드 (acquisitionrate_luxury.json)
   */
  static async getLuxuryAcquisitionRates(): Promise<TaxRateFile[]> {
    try {
      const response = await api.get('/data/tax_rates/acquisitionrate_luxury.json');
      const dataArray = response.data;

      return dataArray;
    } catch (error) {
      console.error('사치성 재산 취득세율 데이터 로드 실패:', error);
      throw new Error('사치성 재산 취득세율 데이터를 불러올 수 없습니다.');
    }
  }



  /**
   * 법인 주택 세율 로드
   */
  static async getCorporateHousingRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/corporate/housing.json');
      return response.data;
    } catch (error) {
      console.error('법인 주택 세율 로드 실패:', error);
      throw new Error('법인 주택 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
 * 모든 취득세율 데이터 로드 (통합된 구조)
 */
  static async getAcquisitionTaxRates(): Promise<ProcessedTaxSection[]> {
    try {
      // 통합된 취득세율 데이터와 사치성 재산 데이터, 법적 근거 데이터 로드
      const [acquisitionRates, luxuryRates, legalBasisData] = await Promise.all([
        this.getAcquisitionRates(),
        this.getLuxuryAcquisitionRates(),
        this.getLegalBasisData()
      ]);

      // 모든 케이스들을 순회하며 section을 변환하여 통합
      const sectionsWithTopic: ProcessedTaxSection[] = [];

      // 통합된 JSON 파일들의 모든 케이스를 하나의 배열로 통합하여 처리
      [
        ...acquisitionRates,
        ...luxuryRates
      ].forEach((fileData: any) => {
        if (fileData.section) {
          fileData.section.forEach((section: any) => {
            // 새 JSON 구조를 그대로 사용
            const newStructureSection: ProcessedTaxSection = {
              id: section.id,
              title: section.title,
              description: section.description,
              content: section.content || [],
              originalCase: fileData.case,
              originalLegalBasis: [],
              centralLegalBasis: legalBasisData
            };

            sectionsWithTopic.push(newStructureSection);
          });
        }
      });

      // 새 JSON 구조를 직접 반환
      return sectionsWithTopic;
    } catch (error) {
      console.error('취득세율 데이터 로드 실패:', error);
      throw new Error('세금 데이터를 불러올 수 없습니다.');
    }
  }

  //전체 취득세율 데이터 로드 (통합된 구조)
  static async getAllTaxRates(): Promise<{
    main: TaxRatesMain;
    acquisitionRates: TaxRateFile[];
    luxuryRates: TaxRateFile[];
  }> {
    try {
      const [main, acquisitionRates, luxuryRates] = await Promise.all([
        this.getTaxRatesMain(),
        this.getAcquisitionRates(),
        this.getLuxuryAcquisitionRates(),
      ]);

      return {
        main,
        acquisitionRates,
        luxuryRates
      };
    } catch (error) {
      console.error('전체 취득세율 데이터 로드 실패:', error);
      throw new Error('세율 데이터를 불러올 수 없습니다.');
    }
  }


  // 과세표준 섹션
  static async getAcquisitionBasePrice(): Promise<any> {
    try {
      const response = await api.get('/data/tax_price/standard_price.json');
      return response.data;
    } catch (error) {
      console.error('취득 기준가격 데이터 로드 실패:', error);
      throw new Error('기준가격 데이터를 불러올 수 없습니다.');
    }
  }

  static async getMarketRecognitionPrice(): Promise<any> {
    try {
      const response = await api.get('/data/tax_price/market_recognition_price.json');
      return response.data;
    } catch (error) {
      console.error('시가인정액 데이터 로드 실패:', error);
      throw new Error('시가인정액 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 세율별 법적 근거 정보를 파싱하는 유틸리티 함수
   * @param legalBasisData JSON 파일의 legal_basis 섹션
   * @param legalBasisId 찾을 ID (예: "지방교육세-1", "농특세-2")
   * @returns 해당하는 법적 근거 정보 또는 null
   */
  static parseLegalBasisInfo(legalBasisData: any[], legalBasisId: string | string[]): any[] | null {
    if (!legalBasisData || !Array.isArray(legalBasisData) || !legalBasisId) {
      return null;
    }

    // legal_basis가 배열인 경우 직접 반환 (이미 법적 근거 내용이 포함된 경우)
    if (Array.isArray(legalBasisId)) {
      return legalBasisId;
    }

    // legal_basis가 문자열이 아닌 경우 null 반환
    if (typeof legalBasisId !== 'string') {
      return null;
    }

    // ID에서 세금 타입과 번호 추출 (예: "지방교육세-1" -> "지방교육세", "1")
    const parts = legalBasisId.split('-');
    if (parts.length !== 2) return null;

    const [taxType, idNumber] = parts;
    if (!taxType || !idNumber) return null;

    // 새로운 구조에서 tax_type으로 찾기
    const taxTypeData = legalBasisData.find(item => item.tax_type === taxType);
    if (!taxTypeData || !taxTypeData.cases) return null;

    // ID 번호로 해당 항목 찾기
    const targetItem = taxTypeData.cases.find((caseItem: any) => caseItem.tax_id === idNumber);

    return targetItem ? targetItem.tax_basis : null;
  }


  /**
   * 세금 계산
   * @param amount 취득가액
   * @param taxType 세금 종류
   * @param conditions 조건 (주택 수, 지역 등)
   */
  static calculateTax(
    amount: number,
    _taxType: string,
    conditions?: {
      housingCount?: number;
      isAdjustmentArea?: boolean;
      propertyType?: string;
    }
  ): Promise<{
    acquisitionTax: number;
    localEducationTax: number;
    agriculturalTax: number;
    total: number;
  }> {
    return new Promise((resolve) => {
      // 기본 계산 로직 (실제로는 더 복잡한 로직이 들어갈 예정)
      let acquisitionTaxRate = 0.01; // 1%
      let localEducationTaxRate = 0.001; // 0.1%
      let agriculturalTaxRate = 0.002; // 0.2%

      // 조건에 따른 세율 조정
      if (conditions?.housingCount && conditions.housingCount >= 2) {
        if (conditions.isAdjustmentArea) {
          acquisitionTaxRate = 0.08; // 8%
          localEducationTaxRate = 0.012; // 1.2%
          agriculturalTaxRate = 0.024; // 2.4%
        }
      }

      // 계산
      const acquisitionTax = Math.floor(amount * acquisitionTaxRate);
      const localEducationTax = Math.floor(amount * localEducationTaxRate);
      const agriculturalTax = Math.floor(amount * agriculturalTaxRate);
      const total = acquisitionTax + localEducationTax + agriculturalTax;

      resolve({
        acquisitionTax,
        localEducationTax,
        agriculturalTax,
        total,
      });
    });
  }
}

export default TaxService;