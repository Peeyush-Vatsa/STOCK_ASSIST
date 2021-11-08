from yahoo_fin import stock_info
from datetime import datetime
import numpy as np


def get_open_price(stock):
    start_date = str(datetime.now()).split()[0]
    inf = stock_info.get_data(stock, start_date=start_date)
    return np.round(inf.loc[start_date, 'open'], 2)

def is_market_open():
    #Tuned to GMT +00:00
    start_date = str(datetime.now()).split()[0]
    try:
        sen = stock_info.get_data('^BSESN', start_date=start_date)
        market = sen.loc[start_date]
        cur_time = datetime.now().strftime("%H:%M")
        hour = cur_time.split(':')[0]
        if hour in ['04', '05','06','07','08', '09']:
            return True
        if hour == '03' and int(cur_time.split(':')[1]) >= 45:
            return True
        return False
    except:
        return False
def get_current_price(stock):
    return np.round(stock_info.get_live_price(stock), 2)

def fetch_quote(stock):
    data = stock_info.get_quote_table(stock)
    return {
        '52week': data['52 Week Range'],
        'eps': data['EPS (TTM)'],
        'mcap': data['Market Cap'],
        'open': data['Open'],
        'beta': data['Beta (5Y Monthly)'],
        'dividend': data['Forward Dividend & Yield'],
        'peRatio': data['PE Ratio (TTM)'],
        'earningsDate': data['Earnings Date'],
        'pClose': data['Previous Close']
    }