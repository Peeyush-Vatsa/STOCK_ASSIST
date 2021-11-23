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

//Creating a global variable for the chart in info_display
var intradayChart;
const plotChart = (xDataset, yDataset, colorset) => {
    /*
        Plots the chart with the provided datapoints xDataset, yDataset and sets the color
    */
    intradayChart = new Chart("day_chart", {
        type: 'line',   //Defines a line chart
        data: {
            labels: xDataset,   //labels the x values
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(0,0,0,0)',
                borderColor: colorset,  //Adds border color to the chart
                data: yDataset  //Adds values to y
            }]
        },
        options: {
            legend: {display: false},
            plugins: {
                tooltip: {
                    displayColors: false    //Avoids tooltip colors
                }
            }

        }
    });
    intradayChart.resize(); //Appends size after chart creation
}

const updateInfoChart = (time, price) => {
    /*
        Pushes data into chart stack and pops when required

        ! - Pops values on first fetch
    */
    if ($("#1D").attr('class').includes('active') == true){
        if (!(time.endsWith('1') || time.endsWith('6'))){
            //Pops value to ensure its not permanent
            intradayChart.data.labels.pop();
            intradayChart.data.datasets.forEach((dataset) => {
                dataset.data.pop();
            });
        }
        //Pushes stock data into stock
        intradayChart.data.labels.push(time);
        intradayChart.data.datasets.forEach((dataset) => {
            dataset.data.push(price);
        });
        intradayChart.update();
    }
}
const updateInfoChartColor = (color) => {
    /*
        Changes color of the chart if stock direction changes
     */
    if ($("#1D").attr('class').includes('active') == true){    
        intradayChart.data.datasets.forEach((dataset) => {
            dataset.borderColor = color;
        });
        intradayChart.update();
    }
}
const fetch_stock_info = (stock) => {
    /* 
        Fetches relavant information about the stock including the chart data
        Only on clicking a link in the html page
    */
   //Changes stock extension to be compatible with the server
    const stock_short = swap_stock_symbol_reverse(stock);
    //Preapares to change data in the info_display
    $("#stock_info_name").removeClass($("#stock_info_name").attr('class')).addClass(stock); //Changes class to current stock
    $("#infoerrorbox").hide(); //Hides error box if shown
    //Adds html for progress
    $("#infoloadmessage").html("<span class='spinner-border spinner-border-sm'></span> Getting details for "+stock);
    //Opens the progress bar
    $("#infoloadbox").slideDown(500);
    //Slides down the breakbox to prevent overlap
    $("#breakbox").slideDown(500);
    //Destroys current chart to prepare for a new one
    intradayChart.destroy();
    //Sends ajax request to server for relavant info
    $.ajax({
        type: 'GET',
        url: '../ajax/getInfo',
        data: {
            stock: stock_short,
        },
        success: (response) => {
            //On successful response
            //Changes the name of the info header to current stock
            $("#stock_info_name").html("<b><u>"+stock+"</u></b>");
            //Gets relavant fundamental data
            const fundamentals = response.fundamental;
            //Retrieves fundamental data and pushes it into relavant spaces
            for (at in fundamentals){
                $("#"+at).text(fundamentals[at]);
            }
            //Gets chart dataset
            const chart_dataset = response.chart_data;
            const xDataset = [];
            const ydataset = [];
            //Pushes every dataset into relavant arrays
            for (let key in chart_dataset){
                xDataset.push(key);
                ydataset.push(chart_dataset[key]);
            }
            //Adds backslashes to add support for reading/pushing html/text elements
            let stock_with_backslash = stock.replace('.', '\\.');
            //Fetches stock price
            const stock_price = $("#watchlist_price_"+stock_with_backslash).text();
            //Gets the color of the stock
            const stock_color = $("#watchlist_"+stock_with_backslash).css('color');
            //Gets the netchange in stock price
            const stock_change = $("#watchlist_netchange_"+stock_with_backslash).text();
            //Pushes the relavant data into the respective inf display settings
            $("#info_price_box").css('color', stock_color);
            $("#info_price").text(stock_price);
            $("#info_price_netchange").text("  "+stock_change); 
            //Gets the direction of the stock
            const stock_direction = $("#watchlist_arrow_"+stock_with_backslash).html();
            //Sets a default colorset for the chart
            let colorset = 'rgba(100, 149, 237, 1.0)';
            //Changes the color of the stock based on stock direction for the chart
            if (stock_direction == 'arrow_upward'){
                colorset = 'rgba(0,128,0,1.0)';
            }
            else if (stock_direction == 'arrow_downward'){
                colorset = 'rgba(178,34,34,1.0)';
            }
            //Plots the chart
            plotChart(xDataset, ydataset, colorset);   
            //Removes loading elements 
            $("#infoloadbox").slideUp(500);
            $("#breakbox").slideUp(500);
            $("#infoloadmessage").html("");
        },
        error: (error) => {
            //If an error occures
            //Displays relavant info about the error
            $("#infoerrormessage").html("Unable to fetch data from our servers");
            $("#infoloadbox").slideUp(500);
            $("#infoerrorbox").slideDown(500);
            $("#infoloadmessage").html("");
        }
    });
}


$('document').ready(() => {
    setTimeout(() => {
        /* Similar to the fetch_price function except it only runs once when the document loads */
        $("#1M").removeClass('active');

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
                if (stock != '^BSESN'){
                    const fundamentals = response.fundamental;
                    for (at in fundamentals){
                        $("#"+at).text(fundamentals[at]);
                    }
                }
                const chart_dataset = response.chart_data;
                const xDataset = [];
                const ydataset = [];
                for (let key in chart_dataset){
                    xDataset.push(key);
                    ydataset.push(chart_dataset[key]);
                }
                if (stock != '^BSESN'){
                    let stock_with_backslash = stock.replace('.', '\\.');
                    const stock_price = $("#watchlist_price_"+stock_with_backslash).text();
                    const stock_color = $("#watchlist_"+stock_with_backslash).css('color');
                    const stock_change = $("#watchlist_netchange_"+stock_with_backslash).text();
                    $("#info_price_box").css('color', stock_color);
                    $("#info_price").text(stock_price);
                    $("#info_price_netchange").text("  "+stock_change);
                    const stock_direction = $("#watchlist_arrow_"+stock_with_backslash).html();
                    var colorset = 'rgba(100, 149, 237, 1.0)';
                    if (stock_direction == 'arrow_upward'){
                        colorset = 'rgba(0,128,0,1.0)';
                    }
                    else if (stock_direction == 'arrow_downward'){
                        colorset = 'rgba(178,34,34,1.0)';
                    }  
                }
                else{
                    colorset = 'rgba(100, 149, 237, 1.0)';
                    let netchange = ydataset[ydataset.length - 1] - ydataset[ydataset.length -2];
                    let color = "cornflowerblue";
                    if (netchange > 0){
                        color = "green";
                        colorset = 'rgba(0,128,0,1.0)';
                    }
                    else if (netchange < 0){
                        color = 'firebrick';
                        colorset = 'rgba(178,34,34,1.0)';
                    }
                    $("#info_price_box").css('color', color);
                    $("#info_price").text(((ydataset[ydataset.length - 1]).toFixed(2)).toString());
                }  
                plotChart(xDataset, ydataset, colorset);
                $("#chart_options").fadeIn(500);    
                $("#infoloadbox").slideUp(500);
                $("#breakbox").slideUp(500);
                $("#infoloadmessage").html("");
                
            },
            error: (error) => {
                $("#infoerrormessage").html("Unable to fetch data from our servers");
                $("#infoloadbox").slideUp(500);
                $("#infoerrorbox").slideDown(500);
                $("#infoloadmessage").html("");
                
            }
        });
    }, 100);
});