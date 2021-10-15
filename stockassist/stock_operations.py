from yahoo_fin import stock_info
import pandas
from datetime import datetime
import numpy as np


def get_open_price(stock):
    start_date = str(datetime.now()).split()[0]
    inf = stock_info.get_data(stock, start_date=start_date)
    return np.round(inf.loc[start_date, 'open'], 2)

def is_market_open():
    #Add time
    start_date = str(datetime.now()).split()[0]
    sen = stock_info.get_data('^BSESN', start_date=start_date)
    try:
        market = sen.loc[start_date]
        return True
    except:
        return False
def get_current_price(stock):
    return np.round(stock_info.get_live_price(stock), 2)