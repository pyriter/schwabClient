export interface GetTransactionsConfig {
  accountId: string;
  transactionId?: string;
  startDate: string;
  endDate: string;
  types?: QueryTransactionType;
}

export enum QueryTransactionType {
  TRADE = 'TRADE',
  RECEIVE_AND_DELIVER = 'RECEIVE_AND_DELIVER',
  DIVIDEND_OR_INTEREST = 'DIVIDEND_OR_INTEREST',
  ACH_RECEIPT = 'ACH_RECEIPT',
  ACH_DISBURSEMENT = 'ACH_DISBURSEMENT',
  CASH_RECEIPT = 'CASH_RECEIPT',
  CASH_DISBURSEMENT = 'CASH_DISBURSEMENT',
  ELECTRONIC_FUND = 'ELECTRONIC_FUND',
  WIRE_OUT = 'WIRE_OUT',
  WIRE_IN = 'WIRE_IN',
  JOURNAL = 'JOURNAL',
  MEMORANDUM = 'MEMORANDUM',
  MARGIN_CALL = 'MARGIN_CALL',
  MONEY_MARKET = 'MONEY_MARKET',
  SMA_ADJUSTMENT = 'SMA_ADJUSTMENT',
}

export interface GetTransactionsByQueryConfig {
  accountId: string;
  types: QueryTransactionType;
  symbol?: string;
  startDate: string;
  endDate: string;
}

export enum TransactionType {
  TRADE = 'TRADE',
  RECEIVE_AND_DELIVER = 'RECEIVE_AND_DELIVER',
  DIVIDEND_OR_INTEREST = 'DIVIDEND_OR_INTEREST',
  ACH_RECEIPT = 'ACH_RECEIPT',
  ACH_DISBURSEMENT = 'ACH_DISBURSEMENT',
  CASH_RECEIPT = 'CASH_RECEIPT',
  CASH_DISBURSEMENT = 'CASH_DISBURSEMENT',
  ELECTRONIC_FUND = 'ELECTRONIC_FUND',
  WIRE_OUT = 'WIRE_OUT',
  WIRE_IN = 'WIRE_IN',
  JOURNAL = 'JOURNAL',
  MEMORANDUM = 'MEMORANDUM',
  MARGIN_CALL = 'MARGIN_CALL',
  MONEY_MARKET = 'MONEY_MARKET',
  SMA_ADJUSTMENT = 'SMA_ADJUSTMENT',
}

export enum AchStatusType {
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancel = 'Cancel',
  Error = 'Error',
}

export interface Transaction {
  type: TransactionType;
  clearingReferenceNumber: string;
  subAccount: string;
  settlementDate: string;
  orderId: string;
  sma: number;
  requirementReallocationAmount: number;
  dayTradeBuyingPowerEffect: number;
  netAmount: number;
  transactionDate: string;
  orderDate: string;
  transactionSubType: string;
  transactionId: string;
  cashBalanceEffectFlag: boolean;
  description: string;
  achStatus: AchStatusType;
  accruedInterest: number;
  fees: object;
  transferItems: TransferItem[];
}

export interface TransferItem {
  accountId: number;
  amount: number;
  price: number;
  cost: number;
  parentOrderKey: number;
  parentChildIndicator: string;
  instruction: string;
  positionEffect: string;
  instrument: OptionTransactionInstrument;
}

export interface OptionTransactionInstrument {
  assetType: string;
  status: string;
  symbol: string;
  description: string;
  instrumentId: string;
  closingPrice: string;
  expirationDate: string;
  optionPremiumMultiplier: number;
  putCall: string;
  strikePrice: number;
  type: string;
  underlyingSymbol: string;
}
