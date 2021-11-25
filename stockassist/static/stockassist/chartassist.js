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
        $.ajax({
            type: 'GET',
            url: '../ajax/getChartData',
            data: {
                stock: stock,
                period: TIMEPERIOD
            },
            success: (response) => {
                if (TIMEPERIOD == '1D'){
                    const prevClose = sessionStorage.getItem(stock.replace('{}', '.'));
                    let prevCloseData = [];
                    let xDataset = [];
                    let yDataset = [];
                    for (let time in response){
                        xDataset.push(time);
                        yDataset.push(response[time]);
                        prevCloseData.push(prevClose);
                    }
                    const stock_with_backslash = swap_stock_symbol(stock.replace('{}', '.'));
                    const stock_direction = $("#watchlist_arrow_"+stock_with_backslash).html();
                    let colorset = 'rgba(100, 149, 237, 1.0)';
                    //Changes the color of the stock based on stock direction for the chart
                    console.log(stock_with_backslash)
                    if (stock_direction == 'arrow_upward'){
                        colorset = 'rgba(0,128,0,1.0)';
                    }
                    else if (stock_direction == 'arrow_downward'){
                        colorset = 'rgba(178,34,34,1.0)';
                    }
                    intradayChart.destroy();
                    plotChart(xDataset, yDataset, colorset, prevCloseData);
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
                    intradayChart.destroy();
                    plotChart(xDataset, yDataset, colorset);
                }
            },
            error: () => {
                //WRITE LATER
            }
        });
    }
}