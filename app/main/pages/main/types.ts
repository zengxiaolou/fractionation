export interface Data {
  id?: number;
  customer_id: number
  name: string;
  level: string;
  createdAt?: Date;
}

export interface DataQuery {
  name?: string;
  level?: string;
  page_number?: number;
  page_size?: number;
}
