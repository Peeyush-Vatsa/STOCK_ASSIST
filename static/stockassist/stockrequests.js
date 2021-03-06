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
var loadcount = 0;
const get_open_prices = () => {
    if (loadcount == 0){
        $("#loadmessages").html("<span class='spinner-border spinner-border-sm'></span> Fetching stock prices");
        $("#loadbox").slideDown(500);
    }
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
                $("#watchlist_netchange_"+stockname).css('color', 'darkgreen').text(netchange).slideDown(500);

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
                $("#watchlist_netchange_"+stockname).css('color', 'cadetblue').text(netchange).slideDown(500);
            }
        }
        catch{
            continue;
        }
        if (loadcount == 0){
            $("#loadbox").slideUp(500);
        }

    }
    loadcount = loadcount + 1;
}
//Starts here
$('document').ready(()=> {
    get_open_prices();
    if (!($("#no_stocks_in_watchlist").text())){
        setTimeout(get_open_prices,5000);
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
                    const info_stock = $("#stock_info_name").attr('class');
                    for (let st in market_prices){
                        let stock_is_info_stock = false;
                        let stock = swap_stock_symbol(st);
                        if (stock.replace('\\.', '.') == info_stock){
                            stock_is_info_stock = true;
                        }
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
                            if (stock_is_info_stock == true){
                                $("#info_price").text(market_prices[st].toFixed(2).toString());
                                $("#info_price_netchange").text(netchange);
                                updateInfoChart(response.time, market_prices[st]);
                            }
                            if (Number(open_price) > Number(market_prices[st])){
                                $("#watchlist_arrow_"+stock).text("arrow_downward");
                                $("#watchlist_"+stock).css('color', 'firebrick').slideUp(500).slideDown(500);
                                $("#watchlist_netchange_"+stock).css('color', 'tomato').slideUp(500).text(netchange).slideDown(500);
                                if (stock_is_info_stock == true){
                                    $("#info_price_box").slideUp(500).css('color', 'firebrick').slideDown(500);
                                    updateInfoChartColor('rgba(178,34,34,1.0)');
                                }
                            }
                            else if (Number(open_price) < Number(market_prices[st])){
                                $("#watchlist_arrow_"+stock).text("arrow_upward");
                                $("#watchlist_"+stock).css('color', 'green').slideUp(500).slideDown(500);
                                $("#watchlist_netchange_"+stock).css('color', 'darkgreen').slideUp(500).text(netchange).slideDown(500);
                                if (stock_is_info_stock == true){
                                    $("#info_price_box").slideUp(500).css('color', 'green').slideDown(500);
                                    updateInfoChartColor('rgba(0,128,0,1.0)');
                                }
                            }
                            else{
                                $("#watchlist_arrow_"+stock).text("remove");
                                $("#watchlist_"+stock).css('color', 'cornflowerblue').slideUp(500).slideDown(500);
                                $("#watchlist_netchange_"+stock).css('color', 'cadetblue').slideUp(500).text(netchange).slideDown(500); 
                                if (stock_is_info_stock == true){
                                    $("#info_price_box").slideUp(500).css('color', 'cornflowerblue').slideDown(500);
                                    updateInfoChartColor('rgba(100, 149, 237, 1.0)');
                                }   
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
