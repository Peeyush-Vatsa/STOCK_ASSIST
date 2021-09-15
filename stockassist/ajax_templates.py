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
    nse = open('./CSV_data/nse_stocks.csv')
    csvreader = csv.reader(nse)
    search_result = []
    for row in csvreader:
        if str.isupper():
            if row[1].startswith(str):
                search_result.append(row)
        else:
            str.lower()
            if row[1].lower().startswith(str):
                search_result.append(row)
            else:
                for word in row[2].lower().split():
                    if word.startswith(str):
                        search_result.append(row)
                        break
        if len(search_result) == 3:
            break
    nse.close()
    return search_result

