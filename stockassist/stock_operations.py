from yahoo_fin import stock_info
from datetime import datetime
import numpy as np
import time

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
    fundamental = {
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
    for key in fundamental:
        try:
            if (np.isnan(fundamental[key])):
                fundamental[key] = "N/A"
        except:
            continue
    return fundamental

def getHistoricalData(stock, period):
    if (period == 'MAX'):
        start_date = None
        interval = '1mo'
        pass
    else:
        cur_time = time.localtime()
        year,month,date = cur_time.tm_year, cur_time.tm_mon, cur_time.tm_mday
        interval = '1d'
        if (period == '1M'):
            month -= 1
        elif (period == '3M'):
            month -= 3
        elif (period == '6M'):
            month -=6
        elif (period == '1Y'):
            interval = '1wk'
            year -=1
        else:
            interval = '1mo'
            year -=5
        if (month < 1):
            month = 12 + month
            year -= 1
        start_date = str(year) + '-' + str(month) + '-' +str(date)
    dataPoints = stock_info.get_data(stock, start_date=start_date, interval=interval)
    dataPoints = dataPoints['close']
    compressedData = {}
    if ((dataPoints.shape[0]) > 90):
        extra = round(dataPoints.shape[0]/90)
        if (extra != 1):
            for i in range(0, dataPoints.shape[0], extra):
                key = dataPoints.index[i]
                t = (key.year, key.month, key.day, 0, 0, 0, key.dayofweek, key.dayofyear, 0)
                print(time.mktime(t))
                compressedData[str(time.mktime(t))] = dataPoints.iloc[i]
    if compressedData == {}:
        compressedData = dataPoints.to_json()
    return compressedData