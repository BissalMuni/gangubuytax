import axios from 'axios';
import { TaxData } from '@/types/tax.types';

// API 기본 설정
const api = axios.create({
  baseURL: '/',
  timeout: 10000,
});

// 새로운 tax_rates 시스템 타입 정의
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
    personal: {
      housing: string[];
      non_agricultural: string[];
      agricultural: string[];
    };
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

interface TaxRateFile {
  topic: string;
  topic_code: string;
  effective_date: string;
  legal_basis: string[];
  sections: any[];
}

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
   * 개인 주택 유상취득 세율 로드
   */
  static async getPersonalHousingPaidRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/housing/paid_acquisition.json');
      return response.data;
    } catch (error) {
      console.error('개인 주택 유상취득 세율 로드 실패:', error);
      throw new Error('개인 주택 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 개인 건물 세율 로드
   */
  static async getPersonalBuildingRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/non_agricultural/buildings/general.json');
      return response.data;
    } catch (error) {
      console.error('개인 건물 세율 로드 실패:', error);
      throw new Error('개인 건물 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 개인 농지 세율 로드
   */
  static async getPersonalAgriculturalRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/agricultural/paid_acquisition.json');
      return response.data;
    } catch (error) {
      console.error('개인 농지 세율 로드 실패:', error);
      throw new Error('개인 농지 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 특수 유상취득 세율 로드
   */
  static async getSpecialPaidRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/special_paid_acquisition.json');
      return response.data;
    } catch (error) {
      console.error('특수 유상취득 세율 로드 실패:', error);
      throw new Error('특수 취득 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 무상취득 세율 로드
   */
  static async getFreeAcquisitionRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/free_acquisition.json');
      return response.data;
    } catch (error) {
      console.error('무상취득 세율 로드 실패:', error);
      throw new Error('무상취득 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 원시취득 세율 로드
   */
  static async getOriginalAcquisitionRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/original_acquisition.json');
      return response.data;
    } catch (error) {
      console.error('원시취득 세율 로드 실패:', error);
      throw new Error('원시취득 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 개인 주택 증여 세율 로드
   */
  static async getPersonalHousingGiftRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/housing/free_acquisition/gift/general.json');
      return response.data;
    } catch (error) {
      console.error('개인 주택 증여 세율 로드 실패:', error);
      throw new Error('개인 주택 증여 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 개인 주택 상속 세율 로드
   */
  static async getPersonalHousingInheritanceRates(): Promise<TaxRateFile> {
    try {
      const response = await api.get('/data/tax_rates/personal/housing/free_acquisition/inheritance.json');
      return response.data;
    } catch (error) {
      console.error('개인 주택 상속 세율 로드 실패:', error);
      throw new Error('개인 주택 상속 세율 데이터를 불러올 수 없습니다.');
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
   * 레거시: 기존 rate2.json 호환성을 위한 메서드 - 모든 개인 세율 데이터 통합
   */
  static async getAcquisitionTaxRates(): Promise<TaxData> {
    try {
      // 모든 개인 세율 데이터 로드
      const allPersonalRates = await this.getAllPersonalTaxRates();
      
      // 각 데이터 파일의 sections에 원래 topic 정보를 추가
      const sectionsWithTopic = [
        ...allPersonalRates.housing.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.housing.topic
        })),
        ...allPersonalRates.buildings.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.buildings.topic
        })),
        ...allPersonalRates.agricultural.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.agricultural.topic
        })),
        ...allPersonalRates.specialPaid.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.specialPaid.topic
        })),
        ...allPersonalRates.freeAcquisition.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.freeAcquisition.topic
        })),
        ...allPersonalRates.originalAcquisition.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.originalAcquisition.topic
        })),
        ...allPersonalRates.housingGift.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.housingGift.topic
        })),
        ...allPersonalRates.housingInheritance.sections.map(section => ({
          ...section,
          originalTopic: allPersonalRates.housingInheritance.topic
        }))
      ];

      // 기존 TaxData 형식에 맞게 변환
      const legacyFormat: TaxData = {
        topic: "개인 취득세 세율",
        topic_code: "personal_all_acquisition",
        sections: sectionsWithTopic,
        legal_references: [
          ...allPersonalRates.housing.legal_basis,
          ...allPersonalRates.buildings.legal_basis,
          ...allPersonalRates.agricultural.legal_basis,
          ...allPersonalRates.specialPaid.legal_basis,
          ...allPersonalRates.freeAcquisition.legal_basis,
          ...allPersonalRates.originalAcquisition.legal_basis,
          ...allPersonalRates.housingGift.legal_basis,
          ...allPersonalRates.housingInheritance.legal_basis
        ]
      };
      
      return legacyFormat;
    } catch (error) {
      console.error('취득세율 데이터 로드 실패:', error);
      throw new Error('세금 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 모든 개인 세율 데이터 로드
   */
  static async getAllPersonalTaxRates(): Promise<{
    main: TaxRatesMain;
    housing: TaxRateFile;
    buildings: TaxRateFile;
    agricultural: TaxRateFile;
    specialPaid: TaxRateFile;
    freeAcquisition: TaxRateFile;
    originalAcquisition: TaxRateFile;
    housingGift: TaxRateFile;
    housingInheritance: TaxRateFile;
  }> {
    try {
      const [main, housing, buildings, agricultural, specialPaid, freeAcquisition, originalAcquisition, housingGift, housingInheritance] = await Promise.all([
        this.getTaxRatesMain(),
        this.getPersonalHousingPaidRates(),
        this.getPersonalBuildingRates(),
        this.getPersonalAgriculturalRates(),
        this.getSpecialPaidRates(),
        this.getFreeAcquisitionRates(),
        this.getOriginalAcquisitionRates(),
        this.getPersonalHousingGiftRates(),
        this.getPersonalHousingInheritanceRates(),
      ]);

      return {
        main,
        housing,
        buildings,
        agricultural,
        specialPaid,
        freeAcquisition,
        originalAcquisition,
        housingGift,
        housingInheritance,
      };
    } catch (error) {
      console.error('전체 개인 세율 데이터 로드 실패:', error);
      throw new Error('세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 레거시: 기존 호환성을 위한 메서드들
   */
  static async getBasicAcquisitionRates(): Promise<any> {
    try {
      const response = await api.get('/data/tax/acquisitiontax/rate.json');
      return response.data;
    } catch (error) {
      console.error('기본 취득세율 데이터 로드 실패:', error);
      throw new Error('기본 세율 데이터를 불러올 수 없습니다.');
    }
  }

  static async getAcquisitionBasePrice(): Promise<any> {
    try {
      const response = await api.get('/data/tax/acquisitiontax/standard_price.json');
      return response.data;
    } catch (error) {
      console.error('취득 기준가격 데이터 로드 실패:', error);
      throw new Error('기준가격 데이터를 불러올 수 없습니다.');
    }
  }

  static async getMarketRecognitionPrice(): Promise<any> {
    try {
      const response = await api.get('/data/tax/acquisitiontax/market_recognition_price.json');
      return response.data;
    } catch (error) {
      console.error('시가인정액 데이터 로드 실패:', error);
      throw new Error('시가인정액 데이터를 불러올 수 없습니다.');
    }
  }

  static async getAllTaxData(): Promise<{
    rates: TaxData;
    basicRates: any;
    basePrice: any;
    marketRecognitionPrice: any;
  }> {
    try {
      const [rates, basicRates, basePrice, marketRecognitionPrice] = await Promise.all([
        this.getAcquisitionTaxRates(),
        this.getBasicAcquisitionRates(),
        this.getAcquisitionBasePrice(),
        this.getMarketRecognitionPrice(),
      ]);

      return {
        rates,
        basicRates,
        basePrice,
        marketRecognitionPrice,
      };
    } catch (error) {
      console.error('전체 세금 데이터 로드 실패:', error);
      throw new Error('세금 데이터를 불러올 수 없습니다.');
    }
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