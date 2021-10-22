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

const get_open_prices = () => {
    $.ajax({
        type: "GET",
        url: "../ajax/requests/get_opens",
        data: {},
        success: (response) => {
            //Fetch data and add to local storage accordingly
            const mystock_opens = response.open;
            for (st in mystock_opens){
                sessionStorage.setItem(st, mystock_opens[st]);
            }
        },
        error: (err) => {
            $("#errormessages").text("Sorry, an unexpected error occured");
            $("#errorbox").slideDown();
        }
    });
}
const initialise_price_display = () => {
    for (let i=0;i<sessionStorage.length;i++){
        let name = sessionStorage.key(i);
        let stockname = swap_stock_symbol(name);
        try{
            const value = Number($("#watchlist_price_"+stockname).text());
            if (Number(sessionStorage.getItem(name)) < value){
                $("#watchlist_"+stockname).css('color', 'green');
                $("#watchlist_price_"+stockname).text(value.toFixed(2).toString());
                $("#watchlist_arrow_"+stockname).text("arrow_upward");
            }
            else if (Number(sessionStorage.getItem(name)) > value){
                $("#watchlist_"+stockname).css('color', 'firebrick');
                $("#watchlist_price_"+stockname).text(value.toFixed(2).toString());
                $("#watchlist_arrow_"+stockname).text("arrow_downward");
            }
            else{
                $("#watchlist_"+stockname).css('color', 'cornflowerblue');
                $("#watchlist_price_"+stockname).text(value.toFixed(2).toString());
                $("#watchlist_arrow_"+stockname).text("remove");    
            }
        }
        catch{
            continue;
        }
    }
}

$('document').ready(()=> {
    get_open_prices();
    initialise_price_display();
    setInterval(() => {
        $.ajax({
            type: "GET",
            url: "../ajax/requests/fetch_price",
            data: {},
            success: (response) => {
                if (response.market == 'closed'){
                    $("#market_status").html('<p class="text-danger">Market is closed</p>');
                }
                else{
                    $("#market_status").html('<p class="text-success">Market is open</p>');
                    const market_prices = response.prices;
                    for (let st in market_prices){
                        let stock = swap_stock_symbol(st);
                        try{
                            $(("#watchlist_price_"+stock).toString()).html(market_prices[st].toFixed(2).toString());
                            try{
                                var open_price = sessionStorage.getItem(st);
                            }
                            catch{
                                get_open_prices();
                                var open_price = sessionStorage.getItem(st);
                            }
                            if (Number(open_price) > Number(market_prices[st])){
                                $("#watchlist_arrow_"+stock).text("arrow_downward");
                                $("#watchlist_"+stock).css('color', 'firebrick').slideUp(500).slideDown(500);
                            }
                            else if (Number(open_price) < Number(market_prices[st])){
                                $("#watchlist_arrow_"+stock).text("arrow_upward");
                                $("#watchlist_"+stock).css('color', 'green').slideUp(500).slideDown(500);
                            }
                            else{
                                $("#watchlist_arrow_"+stock).text("remove");
                                $("#watchlist_"+stock).css('color', 'cornflowerblue').slideUp(500).slideDown(500);    
                            }
                        }
                        catch{
                            continue;
                        }
                    }
                }
            },
            error: (err) => {
                $("errormessages").text("We are unable to contact our servers, please try again later");
                $("errorbox").slideDown();
            }
        });
    }, 60000);
});
