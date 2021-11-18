from dotenv import load_dotenv
import os
import time
load_dotenv()

from ibmcloudant.cloudant_v1 import CloudantV1, Document
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

authenticator = IAMAuthenticator(str(os.environ.get('CLOUDANT_APIKEY')))

service = CloudantV1(authenticator=authenticator)
service.set_service_url(str(os.environ.get('CLOUDANT_URL')))

def get_stocks():
    response = service.post_all_docs(
        db='stock-to-find',
        include_docs=True
    ).get_result()
    stocks = response['rows'][0]['doc']['equities']
    ok_stocks = []
    for stock in stocks:
        ok_stocks.append(stock)
    final_result = {'doc_id': response['rows'][0]['doc']['_id'],'rev': response['rows'][0]['doc']['_rev'], 'stocks': ok_stocks}
    return final_result

def add_stock(stocks):
    equities = {}
    for stock in stocks['stocks']:
        equities[stock] = "ok"
    res1 = service.delete_document(
        db='stock-to-find',
        doc_id=stocks['doc_id'],
        rev=stocks['rev']
    ).get_result()
    mystocklist = Document(
        equities=equities
    )
    response = service.post_document(
        db='stock-to-find',
        document=mystocklist
    ).get_result()
    return [res1, response]

def fetch_current_prices():
    response = service.post_all_docs(
            db='day-stock-price',
            include_docs=True,
            descending=True,
            limit=1
        ).get_result()
    try:
        prices = response['rows'][0]['doc']['price']
        t = response['rows'][0]['doc']['_id']
        min = int(t.split(':')[1])
        hr = int(t.split(':')[0])
        carry = 0
        min = min + 30
        if min > 59:
            min = min - 60
            carry = 1
        if time.gmtime().tm_isdst == 0:
            hr = hr + 5 + carry
        else:
            hr = hr + 4 + carry
        hr = str(hr)
        if min in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]:
            min = '0'+str(min)    
        return {'prices':prices, 'time': str(hr) + ':' + str(min)}
    except IndexError:
        time.sleep(1)
        fetch_current_prices()
    except:
        time.sleep(1)
        fetch_current_prices()    
def get_open_prices():
    response = service.post_all_docs(
        db='day-open-prices',
        include_docs=True
    ).get_result()
    try:
        open_prices = response['rows'][0]['doc']['open_prices']
        return open_prices
    except IndexError:
        time.sleep(1)
        get_open_prices()

def fetch_intraday_prices(ticker):
    response = service.post_all_docs(
        db='day-stock-price',
        include_docs=True,
    ).get_result()
    all_docs = response['rows']
    intra_prices_reverse = {}
    for doc in all_docs:
        try:
            p = doc['doc']['price'][ticker]
            t = doc['doc']['_id']
            if  (not (t.endswith('0') or t.endswith('5'))):
                continue
            min = int(t.split(':')[1])
            hr = int(t.split(':')[0])
            carry = 0
            min = min + 30
            if min > 59:
                min = min - 60
                carry = 1
            if time.gmtime().tm_isdst == 0:
                hr = hr + 5 + carry
            else:
                hr = hr + 4 + carry
            if (hr > 15) or (hr == 15 and min >31):
                break
            hr = str(hr)
            if min in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]:
                min = '0'+str(min)
            intra_prices_reverse[str(hr) + ':' + str(min)] = p
                
        except: 
            continue
    return intra_prices_reverse