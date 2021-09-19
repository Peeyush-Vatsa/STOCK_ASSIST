import csv
import random

def topStocks():
    T50_file = open("./CSV_data/top_stocks.csv","r")
    csvreader = csv.reader(T50_file)
    rows = [] 
    for row in csvreader:
        rows.append([row[1]+'.NSE', row[2]])
    T50_file.close()
    a = random.randint(0,48)
    return rows[a:a+3]

def search_for_id(symbol):
    list = open('./CSV_data/bse_stocks.csv')
    csvdata = csv.reader(list)
    stock_id = -1
    for stock in csvdata:
        if stock[1] == symbol:
            stock_id = stock[0]
            break
    list.close()
    return stock_id 

def search(str):
    nse_stock_results = search_file(str, 'nse_stocks.csv', '.NSE')
    bse_stock_results = search_file(str, 'bse_stocks.csv', '.BSE')
    search_results = nse_stock_results + bse_stock_results
    search_rank = []
    str = str.upper()
    for result in search_results:
        resultrank = 0
        if result[1] == str:
            resultrank += 0.8
        if result[2].startswith(str):
            resultrank += 0.6
        if str in result[1]:
            resultrank += 0.4
        i = 0.6
        for word in result[2].upper().split():
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
        search_rank[int(rank_index)] = 0
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
        if len(search_result) == 20:
            break
        company_name_split = row[2].upper().split()
        #Special search scenarios
        if str_upper:
            if row[1].startswith(str):
                search_result.append([row[0], row[1]+market, row[2]])
            elif str in row[1]:
                search_result.append([row[0], row[1]+market, row[2]])
            else:
                abb = ''
                for word in company_name_split:
                    abb = abb + word[0]
                if abb.startswith(str):
                    search_result.append([row[0], row[1]+market, row[2]])
                    continue
        elif long_len:
            for word in company_name_split:
                if word.startswith(str):
                    search_result.append([row[0], row[1]+market, row[2]])
                    break
                elif str in word:
                    search_result.append([row[0], row[1]+market, row[2]])
                    break
        if str_space:
            search_words = str.split()
            for company_word in company_name_split:
                for search_word in search_words:
                    if search_word in company_word:
                        search_result.append([row[0], row[1]+market, row[2]])
                        break
        if [row[0], row[1]+market, row[2]] not in search_result:
            if row[1].startswith(str):
                search_result.append([row[0], row[1]+market, row[2]])    
            else:
                for word in company_name_split[0:2]:
                    if word.startswith(str):
                        search_result.append([row[0], row[1]+market, row[2]])
                        break
    market_file.close()
    return(search_result)