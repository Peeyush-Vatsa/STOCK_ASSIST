const swap_stock_symbol_reverse = (st) => {
    /*
        This function is to change the stock extension to be compatible with the server extension
    */
    let stock = '';
    if (st.endsWith('.BSE')){
        stock = st.replace('.BSE', '{}BO');
    }
    else{
        stock = st.replace('.NSE', '{}NS');
    }
    return stock;
}
//TODO:

//4. Add support for retrieving other datapoints when intraday data is too small furthur in the day (No data) - 3
//6. Add support for invested in - 4
//7. Improve code readability - 2

//Creating a global variable for the chart in info_display
var intradayChart;
const plotChart = (xDataset, yDataset, colorset) => {
    /*
        Plots the chart with the provided datapoints
    */
    intradayChart = new Chart("day_chart", {
        type: 'line',
        data: {
            labels: xDataset,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: colorset,
                data: yDataset
            }]
        },
        options: {
            legend: {display: false},
            plugins: {
                tooltip: {
                    displayColors: false
                }
            }

        }
    });
    intradayChart.resize();
}

const updateInfoChart = (time, price) => {
    if (!(time.endsWith('1') || time.endsWith('6'))){
        intradayChart.data.labels.pop();
        intradayChart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
    }
    intradayChart.data.labels.push(time);
    intradayChart.data.datasets.forEach((dataset) => {
        dataset.data.push(price);
    });
    intradayChart.update();
}
const updateInfoChartColor = (color) => {
    intradayChart.data.datasets.forEach((dataset) => {
        dataset.borderColor = color;
    });
    intradayChart.update();
}
const fetch_stock_info = (stock) => {
    const stock_short = swap_stock_symbol_reverse(stock);
    $("#stock_info_name").removeClass($("#stock_info_name").attr('class')).addClass(stock);
    $("#infoerrorbox").hide();
    $("#infoloadmessage").html("<span class='spinner-border spinner-border-sm'></span> Getting details for "+stock);
    $("#infoloadbox").slideDown(500);
    $("#breakbox").slideDown(500);
    $("#chartloadscreen").fadeIn(500);
    intradayChart.destroy();
    $.ajax({
        type: 'GET',
        url: '../ajax/getInfo',
        data: {
            stock: stock_short,
        },
        success: (response) => {
            $("#stock_info_name").html("<b><u>"+stock+"</u></b>");
            const fundamentals = response.fundamental;
            for (at in fundamentals){
                $("#"+at).text(fundamentals[at]);
            }
            const chart_dataset = response.chart_data;
            const xDataset = [];
            const ydataset = [];
            for (let key in chart_dataset){
                xDataset.push(key);
                ydataset.push(chart_dataset[key]);
            }
            let stock_with_backslash = stock.replace('.', '\\.');
            const stock_price = $("#watchlist_price_"+stock_with_backslash).text();
            const stock_color = $("#watchlist_"+stock_with_backslash).css('color');
            const stock_change = $("#watchlist_netchange_"+stock_with_backslash).text();
            $("#info_price_box").css('color', stock_color);
            $("#info_price").text(stock_price);
            $("#info_price_netchange").text("  "+stock_change);    
            const stock_direction = $("#watchlist_arrow_"+stock_with_backslash).html();
            let colorset = 'rgba(100, 149, 237, 1.0)';
            if (stock_direction == 'arrow_upward'){
                colorset = 'rgba(0,128,0,1.0)';
            }
            else if (stock_direction == 'arrow_downward'){
                colorset = 'rgba(178,34,34,1.0)';
            }
            $("#chartloadscreen").fadeOut(500);
            plotChart(xDataset, ydataset, colorset);    
            $("#infoloadbox").slideUp(500);
            $("#breakbox").slideUp(500);
            $("#infoloadmessage").html("");
        },
        error: (error) => {
            //Add error box
            $("#infoerrormessage").html("Unable to fetch data from our servers");
            $("#infoloadbox").slideUp(500);
            $("#infoerrorbox").slideDown(500);
            $("#infoloadmessage").html("");
        }
    });
}


$('document').ready(() => {
    setTimeout(() => {
        const stock = $("#stock_info_name").attr('class');
        const stock_short = swap_stock_symbol_reverse(stock);
        $("#infoloadmessage").html("<span class='spinner-border spinner-border-sm'></span> Getting details for "+stock);
        $("#infoloadbox").slideDown(500);
        $("#breakbox").slideDown(500);
        $.ajax({
            type: 'GET',
            url: '../ajax/getInfo',
            data: {
                stock: stock_short,
            },
            success: (response) => {
                const fundamentals = response.fundamental;
                for (at in fundamentals){
                    $("#"+at).text(fundamentals[at]);
                }
                const chart_dataset = response.chart_data;
                const xDataset = [];
                const ydataset = [];
                for (let key in chart_dataset){
                    xDataset.push(key);
                    ydataset.push(chart_dataset[key]);
                }
                let stock_with_backslash = stock.replace('.', '\\.');
                const stock_price = $("#watchlist_price_"+stock_with_backslash).text();
                const stock_color = $("#watchlist_"+stock_with_backslash).css('color');
                const stock_change = $("#watchlist_netchange_"+stock_with_backslash).text();
                $("#info_price_box").css('color', stock_color);
                $("#info_price").text(stock_price);
                $("#info_price_netchange").text("  "+stock_change);
                const stock_direction = $("#watchlist_arrow_"+stock_with_backslash).html();
                let colorset = 'rgba(100, 149, 237, 1.0)';
                if (stock_direction == 'arrow_upward'){
                    colorset = 'rgba(0,128,0,1.0)';
                }
                else if (stock_direction == 'arrow_downward'){
                    colorset = 'rgba(178,34,34,1.0)';
                }    
                $("#chartloadscreen").fadeOut(500);
                plotChart(xDataset, ydataset, colorset);    
                $("#infoloadbox").slideUp(500);
                $("#breakbox").slideUp(500);
                $("#infoloadmessage").html("");
                
            },
            error: (error) => {
                //Add error box
                $("#infoerrormessage").html("Unable to fetch data from our servers");
                $("#infoloadbox").slideUp(500);
                $("#infoerrorbox").slideDown(500);
                $("#infoloadmessage").html("");
                
            }
        });
    }, 100);
});