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
    $("#loadmessages").html("<span class='spinner-border spinner-border-sm'></span> Fetching stock prices");
    $("#loadbox").slideDown(500);
    $.ajax({
        type: "GET",
        url: "../ajax/requests/get_opens",
        data: {},
        success: (response) => {
            const mystock_opens = response.open;
            for (st in mystock_opens){
                sessionStorage.setItem(st, mystock_opens[st]);
            }
            initialise_price_display();
        },
        error: (err) => {
            $("#errormessages").text("Sorry, an unexpected error occured");
            $("#errorbox").slideDown();
            $("#loadbox").slideUp(500);
        }
    });
}
const get_difference = (open, price) => {
    let final_str = '';
    let diff = 0;
    if (open > price){
        diff = (open - price).toFixed(2);
        final_str = '-' + diff.toString() + ' (';
    }
    else if (price > open){
        diff = (price - open).toFixed(2);
        final_str = '+' + diff.toString() + ' (';
    }
    else{
        return '+0.00 (0.00%)'
    }
    let per_diff = ((diff/open) * 100).toFixed(2);
    final_str = final_str + per_diff.toString() + '%)';
    return final_str;
}
const initialise_price_display = () => {
    for (let i=0;i<sessionStorage.length;i++){
        let name = sessionStorage.key(i);
        let stockname = swap_stock_symbol(name);
        try{
            let value = Number($("#watchlist_price_"+stockname).text());
            let netchange = get_difference(Number(sessionStorage.getItem(name)), Number(value));
            if (Number(sessionStorage.getItem(name)) < value){
                $("#watchlist_"+stockname).css('color', 'green');
                $("#watchlist_price_"+stockname).text(value.toFixed(2).toString());
                $("#watchlist_arrow_"+stockname).text("arrow_upward");
                $("#watchlist_netchange_"+stockname).css('color', 'darkgreen').slideUp(500).text(netchange).slideDown(500);

            }
            else if (Number(sessionStorage.getItem(name)) > value){
                $("#watchlist_"+stockname).css('color', 'firebrick');
                $("#watchlist_price_"+stockname).text(value.toFixed(2).toString());
                $("#watchlist_arrow_"+stockname).text("arrow_downward");
                $("#watchlist_netchange_"+stockname).css('color', 'tomato').text(netchange).slideDown(500);
            }
            else{
                $("#watchlist_"+stockname).css('color', 'cornflowerblue');
                $("#watchlist_price_"+stockname).text(value.toFixed(2).toString());
                $("#watchlist_arrow_"+stockname).text("remove");    
                $("#watchlist_netchange_"+stockname).css('color', 'cadetblue').slideUp(500).text(netchange).slideDown(500);
            }
        }
        catch{
            continue;
        }
        $("#loadbox").slideUp(500);
    }
}
//Starts here
$('document').ready(()=> {
    if (!($("#no_stocks_in_watchlist").text())){
        get_open_prices();
        setTimeout(get_open_prices,8000);
    }
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
                            let netchange = get_difference(Number(open_price), Number(market_prices[st]));
                            if (Number(open_price) > Number(market_prices[st])){
                                $("#watchlist_arrow_"+stock).text("arrow_downward");
                                $("#watchlist_"+stock).css('color', 'firebrick').slideUp(500).slideDown(500);
                                $("#watchlist_netchange_"+stock).css('color', 'tomato').slideUp(500).text(netchange).slideDown(500);
                            }
                            else if (Number(open_price) < Number(market_prices[st])){
                                $("#watchlist_arrow_"+stock).text("arrow_upward");
                                $("#watchlist_"+stock).css('color', 'green').slideUp(500).slideDown(500);
                                $("#watchlist_netchange_"+stock).css('color', 'darkgreen').slideUp(500).text(netchange).slideDown(500);
                            }
                            else{
                                $("#watchlist_arrow_"+stock).text("remove");
                                $("#watchlist_"+stock).css('color', 'cornflowerblue').slideUp(500).slideDown(500);
                                $("#watchlist_netchange_"+stock).css('color', 'cadetblue').slideUp(500).text(netchange).slideDown(500);    
                            }
                        }
                        catch{
                            continue;
                        }
                    }
                }
            },
            error: (err) => {
                $("#errormessages").text("We are unable to contact our servers, please try again later");
                $("#errorbox").slideDown();
            }
        });
    }, 60000);
});
