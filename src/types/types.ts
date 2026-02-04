export interface IWallet {
	name: string;
	abr: string;
	sum: number;
  }

  export interface IPlans {
	id: number;
	percent: number;
	percentMin: number;
	percentMax: number;
	days: number;
	name: string;
	minsum: number;
	maxsum: number;
  }

  export type Partners = Partner[]

export interface Partner {
  id: number
  date: number
  login: string
  deposit_sum: string
  level: number
  percent: string
  bonus: number
  avatar: string
  mail: string
}

export interface IDeposit {
    sum: number;
    profit: number;
    id: number;
    username: string;
    nextdate: number;
    count: number;
    status: number;
    plan: number;
    date: number;
    paysys: string;
    period: number;
    percent: number;
	percentMin: number;
	percentMax: number;
    depositId: number;
    last_profit: number;
    total_profit: number;
    name: string;
    start_amount: number;
  }