export interface Seed {
    id: string
    stock: number
    unitPrice: number
    measureUnit: string
    name: string
    description: string
    notes: string
    properties: Property[],
    onDelete?: () => void;
    onUpdate?: () => void;
    onDetails?: () => void;
  }
  
  export interface Property {
    name: string
    value: number
    unit: string
  }
  export interface CreateSeedDto {
    name: string
    description: string
    notes: string
    defaultUnit: string
    properties: Property[]
  }

  export interface UpdateSeedDto {
    name: string
    description: string
    notes: string
  }

  export interface CreateSupplierDto {
    quantity: number
    unitPrice: number
    measureUnit: string
    content: string
    supplier: Supplier
  }
  export interface CreateSupplierMapper {
    quantity: number
    unitPrice: number
    measureUnit: string
    content: string
    supplierId: string
    supplierName: string
    address: string
  }
  
  export interface Supplier {
    id: string
    name: string
    address: string
  }
  
  export interface CreateAllInfoOfSeedDto {
    name: string
    description: string
    notes: string
    defaultUnit: string
    properties: Property[]
    quantity: number
    unitPrice: number
    measureUnit: string
    content: string
    supplierId: string
    supplierName: string
    address: string
  }