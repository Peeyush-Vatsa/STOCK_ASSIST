import csv
import random
import requests

from stockassist.cloudant_connect import add_stock, get_stocks
from datetime import datetime
from stockassist.models import watchlist_stocks_current
from stockassist.stock_operations import get_current_price

import os
from dotenv import load_dotenv
load_dotenv()

def topStocks():
    T50_file = open("./CSV_data/top_stocks.csv","r")
    csvreader = csv.reader(T50_file)
    rows = [] 
    for row in csvreader:
        rows.append([row[1]+'.NSE', row[2]])
    T50_file.close()
    a = random.randint(0,48)
    return rows[a:a+3]

def search(str):
    nse_stock_results = search_file(str, 'nse_stocks.csv', '.NSE')
    bse_stock_results = search_file(str, 'bse_stocks.csv', '.BSE')
    search_results = nse_stock_results + bse_stock_results
    search_rank = []
    str = str.upper()
    for result in search_results:
        resultrank = 0
        if result[0] == str:
            resultrank += 1.2
        if result[1].startswith(str):
            resultrank += 0.6
        if str in result[0]:
            resultrank += 0.3
        i = 0.6
        for word in result[1].upper().split():
            if word.startswith(str):
                resultrank += i + 0.2
            elif str in word:
                resultrank += i
            i -=0.2
        search_rank.append(resultrank)
    final_result = []
    no = len(search_results)
    if no > 4:
        no = 4
    for a in range(no):
        a = max(search_rank)
        rank_index = search_rank.index(a)
        final_result.append(search_results[int(rank_index)])
        search_rank[int(rank_index)] = -1
    return final_result


def search_file(str, file_name, market):
    str_upper, long_len,str_space = False, False, False
    if str.isupper():
        str_upper = True
    if len(str) >= 5:
        long_len = True
    if str.isspace():
        str_space = True
    str = str.upper()
    market_file = open('./CSV_data/'+file_name)
    csvreader = csv.reader(market_file)
    search_result = []
    for row in csvreader:
        if len(search_result) == 40 and market=='.BSE':
            break
        if len(search_result) == 80 and market=='.NSE':
            break
        company_name_split = row[2].upper().split()
        #Special search scenarios
        if str_upper:
            if row[1].startswith(str):
                search_result.append([row[1]+market, row[2]])
            elif str in row[1]:
                search_result.append([row[1]+market, row[2]])
            else:
                abb = ''
                for word in company_name_split:
                    abb = abb + word[0]
                if abb.startswith(str):
                    search_result.append([row[1]+market, row[2]])
                    continue
        elif long_len:
            for word in company_name_split:
                if word.startswith(str):
                    search_result.append([row[1]+market, row[2]])
                    break
                elif str in word:
                    search_result.append([row[1]+market, row[2]])
                    break
        if str_space:
            search_words = str.split()
            for company_word in company_name_split:
                for search_word in search_words:
                    if search_word in company_word:
                        search_result.append([row[1]+market, row[2]])
                        break
        if [row[1]+market, row[2]] not in search_result:
            if row[1].startswith(str):
                search_result.append([row[1]+market, row[2]])    
            else:
                for word in company_name_split[0:2]:
                    if word.startswith(str):
                        search_result.append([row[1]+market, row[2]])
                        break
    market_file.close()
    return(search_result)

def add_stock_to_db(stock):
    stock_details = get_stocks()
    if stock in stock_details['stocks']:
        return True
    else:
        stock_split = stock.split(".")
        if stock_split[1] == 'NSE':
            stock = stock_split[0]+'.NS'
        elif stock_split[1] == 'BSE':
            stock = stock_split[0]+'.BO'
        else:
            return False
        existing_stocks = stock_details['stocks']
        existing_stocks.append(stock)
        stock_details['stocks'] = existing_stocks
        res = add_stock(stock_details)
        if res[0]['ok'] and res[1]['ok']:
            return True
        else: return False

def remove_stock_from_db(stock):
    stock_details = get_stocks()
    stock_split = stock.split('.')
    if stock_split[1] == 'NSE':
        stock = stock_split[0]+ '.NS'
    else:
        stock = stock_split[0]+ '.BO'
    existing_stocks = stock_details['stocks']
    existing_stocks.remove(stock)
    stock_details['stocks'] = existing_stocks
    add_stock(stock_details)

def update_price_in_local_db(prices, uname):
    for key in prices:
        if key.split('.')[1] == 'NS':
            key_formatted=key.split('.')[0]+'.NSE'
        else:
            key_formatted=key.split('.')[0]+'.BSE'
        try:
            row = watchlist_stocks_current.objects.get(stk_symbol=key_formatted, watchlist_user=uname)
        except:
            continue
        row.stk_price = prices[key]
        row.save()

    while True:
        try:
            row = watchlist_stocks_current.objects.get(stk_price=-1.0, watchlist_user=uname)
            stock_split = (row.stk_symbol).split('.')
            if stock_split[1] == 'NSE':
                stock = stock_split[0]+'.NS'
            else:
                stock = stock_split[0]+'.BO'
            row.stk_price = get_current_price(stock)
            row.save()
        except:
            break
'''
def fetch_month_price(ticker):
    stock_split = ticker.split('.')
    if stock_split[1] == '.NS':
        ticker = stock_split[0]+ '.NSE'
    else:
        ticker = stock_split[0]+ '.BSE'
    url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+ticker+'&apikey='+str(os.environ.get('ALPHAAPI'))
    r = requests.get(url)
    data = r.json()
    #Append for a month only
    print(data)
'''