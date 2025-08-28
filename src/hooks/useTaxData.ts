import { useQuery } from '@tanstack/react-query';
import { TaxService } from '@/services/taxService';

export const useTaxData = () => {
  return useQuery({
    queryKey: ['taxData'],
    queryFn: () => TaxService.getAcquisitionTaxRates(),
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간 (이전 cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};


export const useAcquisitionBasePrice = () => {
  return useQuery({
    queryKey: ['acquisitionBasePrice'],
    queryFn: () => TaxService.getAcquisitionBasePrice(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};

export const useMarketRecognitionPrice = () => {
  return useQuery({
    queryKey: ['marketRecognitionPrice'],
    queryFn: () => TaxService.getMarketRecognitionPrice(),
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
};
