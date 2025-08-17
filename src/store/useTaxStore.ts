import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TaxData, TaxItem, FilterOptions, ViewMode } from '@/types/tax.types';

interface TaxStore {
  // 데이터 상태
  taxData: TaxData | null;
  basicRates: any;
  basePrice: any;
  filteredItems: TaxItem[];
  
  // UI 상태
  viewMode: ViewMode;
  filters: FilterOptions;
  searchTerm: string;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  error: string | null;
  
  // 선택 상태
  selectedItems: string[];
  
  // Actions
  setTaxData: (data: TaxData) => void;
  setBasicRates: (data: any) => void;
  setBasePrice: (data: any) => void;
  setFilteredItems: (items: TaxItem[]) => void;
  setViewMode: (mode: ViewMode) => void;
  setFilters: (filters: FilterOptions) => void;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  toggleItemSelection: (itemId: string) => void;
  clearSelection: () => void;
  resetFilters: () => void;
}

const initialFilters: FilterOptions = {
  category: 'acquisition',
  type: 'all',
  searchTerm: '',
};

export const useTaxStore = create<TaxStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      taxData: null,
      basicRates: null,
      basePrice: null,
      filteredItems: [],
      viewMode: 'list',
      filters: initialFilters,
      searchTerm: '',
      currentPage: 1,
      itemsPerPage: 15,
      isLoading: false,
      error: null,
      selectedItems: [],

      // Actions
      setTaxData: (data) => set({ taxData: data }),
      
      setBasicRates: (data) => set({ basicRates: data }),
      
      setBasePrice: (data) => set({ basePrice: data }),
      
      setFilteredItems: (items) => set({ filteredItems: items }),
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      setFilters: (filters) => {
        set({ 
          filters,
          currentPage: 1, // 필터 변경 시 첫 페이지로
        });
      },
      
      setSearchTerm: (term) => {
        set({ 
          searchTerm: term,
          currentPage: 1, // 검색 시 첫 페이지로
        });
      },
      
      setCurrentPage: (page) => set({ currentPage: page }),
      
      setItemsPerPage: (count) => {
        set({ 
          itemsPerPage: count,
          currentPage: 1, // 페이지 크기 변경 시 첫 페이지로
        });
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      toggleItemSelection: (itemId) => {
        const { selectedItems } = get();
        const isSelected = selectedItems.includes(itemId);
        
        set({
          selectedItems: isSelected
            ? selectedItems.filter(id => id !== itemId)
            : [...selectedItems, itemId]
        });
      },
      
      clearSelection: () => set({ selectedItems: [] }),
      
      resetFilters: () => {
        set({
          filters: initialFilters,
          searchTerm: '',
          currentPage: 1,
          selectedItems: [],
        });
      },
    }),
    {
      name: 'tax-store',
    }
  )
);