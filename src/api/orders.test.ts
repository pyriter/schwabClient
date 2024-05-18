import {OrdersApi} from './orders';
import {
  AssetType,
  ComplexOrderStrategyType,
  DurationType,
  InstructionType,
  OptionInstrument,
  Order,
  OrderLegType,
  OrdersConfig,
  OrderStrategyType,
  OrderType,
  PutCall,
  SessionType,
  StatusType,
} from '../models/order';
import {provideClientWithLocalFileCredentialProvider} from '../utils/testUtils';
import {SecuritiesAccount} from '../models/accounts';
import {ContractType, OptionChainConfig, OptionStrategyType, RangeType} from '../models/optionChain';
import {Quote} from '../models/quotes';
import {convertToMonth} from '../utils/month';
import {AccountApi} from './accounts';
import {OptionChainApi} from './optionChain';
import {QuotesApi} from './quotes';

xdescribe('Orders', () => {
  let validAccount: SecuritiesAccount;
  const client = provideClientWithLocalFileCredentialProvider();
  const ordersApi = new OrdersApi(client);
  const accountApi = new AccountApi(client);
  const optionChainApi = new OptionChainApi(client);
  const quotesApi = new QuotesApi(client);

  beforeAll(async () => {
    validAccount = await checkForValidAccount();
  });

  it('should be able to get orders after a certain date', async () => {
    const response = await ordersApi.getOrdersByQuery({
      fromEnteredTime: new Date().toISOString(),
      toEnteredTime: new Date().toISOString(),
    });

    expect(response.length).toBeGreaterThanOrEqual(0);
    response.forEach((order) => {
      expect(order.orderId).toBeDefined();
    });
  });

  it('should be able to get all orders from 3 months ago', async () => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setMonth(today.getMonth() - 3);
    const response = await ordersApi.getOrdersByQuery({
      fromEnteredTime: pastDate.toISOString(),
      toEnteredTime: new Date().toISOString(),
    });

    expect(response);
  });

  it('should be able to place a stock order and then cancel it', async () => {
    const accountId = validAccount.hashValue;
    const order = {
      orderType: OrderType.LIMIT,
      price: 10.0,
      session: SessionType.NORMAL,
      duration: DurationType.DAY,
      orderStrategyType: OrderStrategyType.SINGLE,
      orderLegCollection: [
        {
          instruction: InstructionType.BUY,
          quantity: 1,
          instrument: {
            symbol: 'AAPL',
            assetType: AssetType.EQUITY,
          },
        },
      ],
    } as Order;

    const orderConfig = {
      accountId,
      order,
    } as OrdersConfig;

    const placeOrdersResponse = await ordersApi.placeOrder(orderConfig);
    const orderId = placeOrdersResponse.orderId;

    const getOrderResponse = await ordersApi.getOrder({
      accountId,
      orderId,
    });

    if (getOrderResponse.status === StatusType.FILLED) {
      const cancelOrderResponse = await ordersApi.cancelOrder({
        accountId,
        orderId,
      });
      expect(cancelOrderResponse);
    }

    expect(placeOrdersResponse).toBeTruthy();
    expect(getOrderResponse).toBeTruthy();
  });

  it('should be able to place a put credit spread and then cancel it', async () => {
    const symbol = 'SPX';

    const accountId = validAccount.hashValue;

    const optionOrder = await generateOptionsOrder(symbol, PutCall.PUT);

    const orderConfig = {
      accountId,
      order: optionOrder,
    } as OrdersConfig;

    const placeOrdersResponse = await ordersApi.placeOrder(orderConfig);
    const orderId = placeOrdersResponse.orderId;

    const getOrderInfoResponse1 = await ordersApi.getOrder({
      accountId: validAccount.hashValue,
      orderId
    })

    if (getOrderInfoResponse1.status === StatusType.WORKING) {
      await ordersApi.cancelOrder({
        accountId,
        orderId,
      });
    }

    const getOrderInfoResponse2 = await ordersApi.getOrder({
      accountId: validAccount.hashValue,
      orderId
    })

    expect(placeOrdersResponse.orderId).toBeTruthy();
    expect(getOrderInfoResponse2.status === StatusType.CANCELED || getOrderInfoResponse2.status === StatusType.REJECTED).toBeTruthy();
  });

  it('should be able to place a call credit spread and then cancel it', async () => {
    const symbol = 'SPX';

    const accountId = validAccount.hashValue;

    const optionOrder = await generateOptionsOrder(symbol, PutCall.CALL);

    const orderConfig = {
      accountId,
      order: optionOrder,
    } as OrdersConfig;

    const placeOrdersResponse = await ordersApi.placeOrder(orderConfig);
    const orderId = placeOrdersResponse.orderId;

    await ordersApi.cancelOrder({
      accountId,
      orderId,
    });

    expect(placeOrdersResponse.orderId).toBeTruthy();
  });

  xit('should be able to place a put credit spread, replace it, and then cancel it', async () => {
    const symbol = 'SPX';

    const accountId = validAccount.hashValue;

    const optionOrder = await generateOptionsOrder(symbol, PutCall.PUT);

    const orderConfig = {
      accountId,
      order: optionOrder,
    } as OrdersConfig;

    const {orderId: placedOrderId} = await ordersApi.placeOrder(orderConfig);

    optionOrder.price = optionOrder.price + 0.5;
    const {orderId: replacedOrderId} = await ordersApi.replaceOrder({
      accountId,
      order: optionOrder,
      orderId: placedOrderId,
    });

    await ordersApi.cancelOrder({
      accountId,
      orderId: replacedOrderId,
    });

    expect(placedOrderId).toBeTruthy();
    expect(replacedOrderId).toBeTruthy();
  });

  async function checkForValidAccount(): Promise<SecuritiesAccount> {
    const accountResponse = await accountApi.getAllAccounts();
    const account = accountResponse.filter((r) => r.currentBalances.buyingPower > 10).pop();
    if (!account) {
      throw Error('Since there is no money in account, we cannot run this test');
    }

    return account;
  }

  async function generateOptionsOrder(symbol: string, putCall: PutCall) {
    const quotesResponse = await quotesApi.getQuotes({
      symbols: [symbol],
    });

    const spx = quotesResponse[0] as Quote;
    console.log(spx.quote.lastPrice);
    const contractType = putCall === PutCall.PUT ? ContractType.PUT : ContractType.CALL;

    const optionChainResponse = await optionChainApi.getOptionChain({
      symbol,
      strike: spx.quote.closePrice - 50, // TODO: Get the price by querying the market
      interval: 5,
      contractType,
      strategy: OptionStrategyType.VERTICAL,
      range: RangeType.OTM,
      expMonth: convertToMonth(new Date().getMonth()),
      daysToExpiration: 1
    } as OptionChainConfig);
    const {optionStrategyList} = optionChainResponse.monthlyStrategyList[1];

    const {primaryLeg, secondaryLeg, strategyBid, strategyAsk} = optionStrategyList[0];

    const price = (strategyBid + strategyAsk) / 2;
    return {
      orderType: OrderType.NET_CREDIT,
      price,
      session: SessionType.NORMAL,
      duration: DurationType.DAY,
      orderStrategyType: OrderStrategyType.SINGLE,
      complexOrderStrategyType: ComplexOrderStrategyType.VERTICAL,
      orderLegCollection: [
        {
          orderLegType: OrderLegType.OPTION,
          instruction: InstructionType.SELL_TO_OPEN,
          quantity: 1,
          instrument: {
            assetType: AssetType.OPTION,
            putCall,
            symbol: primaryLeg.symbol,
          } as OptionInstrument,
        },
        {
          orderLegType: OrderLegType.OPTION,
          instruction: InstructionType.BUY_TO_OPEN,
          quantity: 1,
          instrument: {
            assetType: AssetType.OPTION,
            putCall,
            symbol: secondaryLeg.symbol,
          },
        },
      ],
    } as Order;
  }
});
