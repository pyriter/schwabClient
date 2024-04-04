const ROUTES = {
  hostname: 'https://api.schwabapi.com',
  endpoints: {
    oauth2Token: '/v1/oauth/token',
    auth: '/auth',
    accounts: '/trader/v1/accounts',
    orders: '/trader/v1/orders',
    optionChain: '/marketdata/v1/chains',
    quotes: '/marketdata/v1/quotes',
    hours: '/marketdata/v1/markets',
    priceHistory: '/marketdata/v1/pricehistory'
  },
};

export const AUTHENTICATION = `${ROUTES.hostname}${ROUTES.endpoints.oauth2Token}`;
export const ACCOUNTS = `${ROUTES.hostname}${ROUTES.endpoints.accounts}`;
export const OAUTH2_TOKEN = `${ROUTES.hostname}${ROUTES.endpoints.oauth2Token}`;
export const ORDERS = `${ROUTES.hostname}${ROUTES.endpoints.orders}`;
export const OPTION_CHAIN = `${ROUTES.hostname}${ROUTES.endpoints.optionChain}`;
export const QUOTES = `${ROUTES.hostname}${ROUTES.endpoints.quotes}`;
export const HOURS = `${ROUTES.hostname}${ROUTES.endpoints.hours}`;
export const PRICE_HISTORY = `${ROUTES.hostname}${ROUTES.endpoints.priceHistory}`;
