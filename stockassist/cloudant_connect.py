from dotenv import load_dotenv
import os
load_dotenv()
CLOUDANT_URL = os.environ.get('CLOUDANT_URL')
CLOUDANT_APIKEY='<varname>'+str(os.environ.get('CLOUDANT_APIKEY'))+'</varname>'

from ibmcloudant.cloudant_v1 import CloudantV1, Document

service = CloudantV1.new_instance(service_name='CLOUDANT')

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
        include_docs=True
    ).get_result()
    prices = response['rows'][-1]['doc']['price']
    return prices
    