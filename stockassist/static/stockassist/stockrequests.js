const send_request_to_watchlist = (params) => {
    $.ajax({
        type: 'GET',
        url: '../addstock',
        data: {
            symbol: params.stock_symbol,
            stock_name: params.stock_name
        },
        success: () => {
            window.open('../home','_self');
        },
        error: () => {
            $("#errormessages").text("Unable to add stock to your watchlist. Please try again");
            $("#errorbox").css("display", "block");
        }
    });
}
$(document).ready(() => {
    $("#add_to_watchlist_1").click(() => {
        stock_symbol = $("#stock_1").text();
        stock_name = $("#company_1").text();
        send_request_to_watchlist({stock_symbol: stock_symbol, stock_name: stock_name});
    });
    $("#add_to_watchlist_2").click(() => {
        stock_symbol = $("#stock_2").text();
        stock_name = $("#company_2").text();
        send_request_to_watchlist({stock_symbol: stock_symbol, stock_name: stock_name});
    });
    $("#add_to_watchlist_3").click(() => {
        stock_symbol = $("#stock_3").text();
        stock_name = $("#company_3").text();
        send_request_to_watchlist({stock_symbol: stock_symbol, stock_name: stock_name});
    });
    $("#add_to_watchlist_4").click(() => {
        stock_symbol = $("#stock_4").text();
        stock_name = $("#company_4").text();
        send_request_to_watchlist({stock_symbol: stock_symbol, stock_name: stock_name});
    });
});
