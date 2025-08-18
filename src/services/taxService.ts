import axios from 'axios';
import { TaxData } from '@/types/tax.types';

// API 기본 설정
const api = axios.create({
  baseURL: '/',
  timeout: 10000,
});

export class TaxService {
  /**
   * 취득세율 데이터 로드
   */
  static async getAcquisitionTaxRates(): Promise<TaxData> {
    try {
      const response = await api.get('/data/tax/acq_rate2.json');
      return response.data;
    } catch (error) {
      console.error('취득세율 데이터 로드 실패:', error);
      throw new Error('세금 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 기본 취득세율 데이터 로드
   */
  static async getBasicAcquisitionRates(): Promise<any> {
    try {
      const response = await api.get('/data/tax/acq_rate.json');
      return response.data;
    } catch (error) {
      console.error('기본 취득세율 데이터 로드 실패:', error);
      throw new Error('기본 세율 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 취득 기준가격 데이터 로드
   */
  static async getAcquisitionBasePrice(): Promise<any> {
    try {
      const response = await api.get('/data/tax/acq_baseprice.json');
      return response.data;
    } catch (error) {
      console.error('취득 기준가격 데이터 로드 실패:', error);
      throw new Error('기준가격 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 시가인정액 데이터 로드
   */
  static async getMarketRecognitionPrice(): Promise<any> {
    try {
      const response = await api.get('/data/tax/acquisitiontax/market_recognition_price.json');
      return response.data;
    } catch (error) {
      console.error('시가인정액 데이터 로드 실패:', error);
      throw new Error('시가인정액 데이터를 불러올 수 없습니다.');
    }
  }

  /**
   * 모든 세금 데이터 로드
   */
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