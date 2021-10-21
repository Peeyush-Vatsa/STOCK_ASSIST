//Add price formatting

const swap_stock_symbol = (stock) => {
    let new_stock;
    if (stock.endsWith('.NS')){
        new_stock = stock.replace('.NS', '\\.NSE');
    }
    else{
        new_stock = stock.replace('.BO', '\\.BSE');
    }
    return new_stock;
}

$('document').ready(()=> {
    //Add fetch open for the day
    setInterval(() => {
        $.ajax({
            type: "GET",
            url: "../ajax/requests/fetch_price",
            data: {},
            success: (response) => {
                //Add market is closed res box
                if (response.market == 'closed'){
                    $("#market_status").html('<p class="text-danger">Market is closed</p>');
                }
                else{
                    $("#market_status").html('<p class="text-success">Market is open</p>');
                    market_prices = response.prices;
                    for (st in market_prices){
                        let stock = swap_stock_symbol(st);
                        console.log(stock)
                        try{

                            $(("#watchlist_price_"+stock).toString()).html(market_prices[st].toString());
                            //console.log('#watchlist_price_'+stock);
                            //console.log('Adding '+ stock + ' : '+ market_prices[st].toString());
                        }
                        catch{
                            console.log('Not found')
                            continue;
                        }
                    }
                }
            }
        });
    }, 60000);
});
