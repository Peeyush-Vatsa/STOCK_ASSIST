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
        company_name_split = row[2].upper().split()
        print("for company", company_name_split)
        if len(search_result_nse) == 3:
            print("search complete")
            break
        #Special search scenarios
        if str_upper:
            print("starting upper case scenario")
            if row[1].startswith(str):
                #priority_nse.append(1) change priority with new scenarios
                print("Appending", row)
                search_result_nse.append(row)
            elif str in row[1]:
                #priority_nse.append(2)
                print("Apending", row)
                search_result_nse.append(row)
            else:
                abb = ''
                for word in company_name_split:
                    abb = abb + word[0]
                if abb.startswith(str):
                    #priority_nse.append(3)
                    print("Appending", row)
                    search_result_nse.append(row)
                    continue
        elif long_len:
            print("Starting long_len search")
            for word in company_name_split:
                if word.startswith(str):
                    #priority
                    search_result_nse.append(row)
                    print("Appending", row)
                    break
                elif str in word:
                    #priority
                    search_result_nse.append(row)
                    print("Appending", row)
                    break
        if str_space:
            print("Starting space search")
            i = 0
            search_words = str.split()
            for company_word in company_name_split:
                for search_word in search_words:
                    if search_word in company_word:
                        #priority
                        print("Appending", row)
                        search_result_nse.append(row)
                        break
                i+=1
                if i == 4:
                    break
        if row not in search_result_nse:
            print("Starting normal search")
            if row[1].startswith(str):
                search_result_nse.append(row)
                print("Appending", row)    
            else:
                for word in company_name_split[0:2]:
                    if word.startswith(str):
                        search_result_nse.append(row)
                        print("Appending", row)
                        break
    nse.close()
    return(search_result_nse)
