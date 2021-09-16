import csv
import random

def topStocks():
    T50_file = open("./CSV_data/top_stocks.csv","r")
    csvreader = csv.reader(T50_file)
    rows = [] 
    for row in csvreader:
        rows.append(row[1:3])
    T50_file.close()
    a = random.randint(0,48)
    return rows[a:a+3]

def search(str):
    str_upper, long_len,str_space = False, False, False
    if str.isupper():
        str_upper = True
    if len(str) >= 4:
        long_len = True
    if str.isspace():
        str_space = True
    str = str.upper()
    nse = open('./CSV_data/nse_stocks.csv')
    csvreader = csv.reader(nse)
    search_result_nse = []
    for row in csvreader:
        if len(search_result_nse) == 4:
            break
        company_name_split = row[2].upper().split()
        #Special search scenarios
        if str_upper:
            if row[1].startswith(str):
                search_result_nse.append([row[0], row[1]+".NSE", row[2]])
            elif str in row[1]:
                search_result_nse.append([row[0], row[1]+".NSE", row[2]])
            else:
                abb = ''
                for word in company_name_split:
                    abb = abb + word[0]
                if abb.startswith(str):
                    search_result_nse.append([row[0], row[1]+".NSE", row[2]])
                    continue
        elif long_len:
            for word in company_name_split:
                if word.startswith(str):
                    search_result_nse.append([row[0], row[1]+".NSE", row[2]])
                    break
                elif str in word:
                    search_result_nse.append([row[0], row[1]+".NSE", row[2]])
                    break
        if str_space:
            i = 0
            search_words = str.split()
            for company_word in company_name_split:
                for search_word in search_words:
                    if search_word in company_word:
                        search_result_nse.append([row[0], row[1]+".NSE"], row[2])
                        break
                i+=1
                if i == 4:
                    break
        if [row[0], row[1]+".NSE", row[2]] not in search_result_nse:
            if row[1].startswith(str):
                search_result_nse.append([row[0], row[1]+".NSE", row[2]])    
            else:
                for word in company_name_split[0:2]:
                    if word.startswith(str):
                        search_result_nse.append([row[0], row[1]+".NSE", row[2]])
                        break
    nse.close()
    return(search_result_nse)
