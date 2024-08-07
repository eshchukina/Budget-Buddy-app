export interface Account {
  id: number;
  name: string;
  currency: string;
  currentBalance: number;
  futureBalance: number;
  user_id: number;
}

export interface Transaction {
  id?: number;
  account_id: number;
  amount: number;
  date: string;
  description: string;
  tag: string;
  balance?: number;
}
