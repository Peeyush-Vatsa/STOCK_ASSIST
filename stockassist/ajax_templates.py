import csv
import random

def topStocks():
    T50_file = open("./stockassist/top_stocks.csv","r")
    csvreader = csv.reader(T50_file)
    rows = [] 
    for row in csvreader:
        rows.append(row[1:3])
    T50_file.close()
    a = random.randint(0,44)
    return rows[a:a+5]

    