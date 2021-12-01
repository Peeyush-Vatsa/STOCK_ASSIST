const dataperiod = ['1D', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

const plotStockChart = (TIMEPERIOD) => {
    if ($("#"+TIMEPERIOD).attr('class').includes('active') == false){
        dataperiod.forEach((val) => {
            if ($("#"+val).attr('class').includes('active') == true){
                $("#"+val).removeClass('active').removeClass('bg-secondary').addClass('text-secondary');
            }
        });
        $("#"+TIMEPERIOD).addClass('active').removeClass('text-secondary').addClass('bg-secondary');
        const stock = swap_stock_symbol_reverse($("#stock_info_name").text());
        $("#infoloadmessage").html("<span class='spinner-border spinner-border-sm'></span> Plotting chart for "+TIMEPERIOD);
        $("#infoloadbox").slideDown(500);
        $("#breakbox").slideDown(500);
        $.ajax({
            type: 'GET',
            url: '../ajax/getChartData',
            data: {
                stock: stock,
                period: TIMEPERIOD
            },
            success: (response) => {
                if (TIMEPERIOD == '1D'){
                    let prevClose;
                    if (stock == 'SENSEX'){
                        prevClose = sessionStorage.getItem('^BSESN');
                    }
                    else{
                        prevClose = sessionStorage.getItem(stock.replace('{}', '.'));
                    }
                    let prevCloseData = [];
                    let xDataset = [];
                    let yDataset = [];
                    for (let time in response){
                        xDataset.push(time);
                        yDataset.push(response[time]);
                        prevCloseData.push(prevClose);
                    }
                    if (xDataset.length < 3){
                        $("#infoerrormessage").html("Unable to plot intraday chart (Error code 11 - Insufficient data)");
                        $("#infoerrorbox").slideDown(200).slideUp(2000);
                    }
                    else {
                        var stock_direction;
                        if ($("#stock_info_name").text() == 'SENSEX'){
                            stock_direction = $("#info_price_box").css('color');
                            if (stock_direction == 'rgb(178, 34, 34)'){
                                stock_direction = 'arrow_downward';
                            }
                            else if (stock_direction == 'rgb(0, 128, 0)'){
                                stock_direction = 'arrow_upward';
                            }
                        }
                        else{
                            const stock_with_backslash = swap_stock_symbol(stock.replace('{}', '.'));
                            stock_direction = $("#watchlist_arrow_"+stock_with_backslash).html();
                        }
                        let colorset = 'rgba(100, 149, 237, 1.0)';
                        //Changes the color of the stock based on stock direction for the chart
                        if (stock_direction == 'arrow_upward'){
                            colorset = 'rgba(0,128,0,1.0)';
                        }
                        else if (stock_direction == 'arrow_downward'){
                            colorset = 'rgba(178,34,34,1.0)';
                        }
                        intradayChart.destroy();
                        plotChart(xDataset, yDataset, colorset, prevCloseData);
                        $("#infoloadbox").slideUp(500);
                        $("#breakbox").slideUp(500);
                    }
                }
                else{
                    //For any other timeperiod
                    let xDataset = [];
                    let yDataset = [];
                    for (let time in response){
                        xDataset.push(time);
                        yDataset.push(Number(response[time]).toFixed(2));
                    }
                    let colorset = 'rgba(100, 149, 237, 1.0)';
                    const netDif = yDataset[yDataset.length - 1] - yDataset[0];
                    if (netDif > 0){
                        colorset = 'rgba(0,128,0,1.0)';
                    }
                    else if (netDif < 0){
                        colorset = 'rgba(178,34,34,1.0)';
                    }
                    try{
                        intradayChart.destroy();
                    }
                    catch{
                        plotChart(xDataset, yDataset, colorset);
                        intradayChart.destroy();
                    }
                    plotChart(xDataset, yDataset, colorset);
                    $("#infoloadbox").slideUp(500);
                    $("#breakbox").slideUp(500);
                }
            },
            error: () => {
                $("#infoloadbox").slideUp(500);
                $("#infoerrormessage").html("Unable to plot the chart");
                $("#infoerrorbox").slideDown(500);
            }
        });
    }
}