//Prepare data entry here and in index
//Declaring global access var

const swap_stock_symbol_reverse = (st) => {
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

//1. Reduce or compress datapoints
//2. Add support for changing color w.r.t price change
//3. Add a huge price block below the chart
//4. Add support for retrieving other datapoints when intraday data is too small furthur in the day
//5. Update open price algo for preventing prevoius open at weekends (Update microservice architecture)
//6. Add support for invested in

var intradayChart;
const plotChart = (xDataset, yDataset, colorset) => {
    intradayChart = new Chart("day_chart", {
        type: 'line',
        data: {
            labels: xDataset,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(0,255,0,0)',
                borderColor: 'rgba(0,255,0,1.0)',
                data: yDataset
            }]
        },
        options: {
            legend: {display: false},

        }
    });
    intradayChart.resize();
}

const fetch_stock_info = (stock) => {
    const stock_short = swap_stock_symbol_reverse(stock);
    //Add loadbox support
    $("#infoerrorbox").hide();
    $("#infoloadmessage").html("<span class='spinner-border spinner-border-sm'></span> Getting company details");
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
            $("#chartloadscreen").fadeOut(500);
            plotChart(xDataset, ydataset);    
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
        //Add load box
        $("#infoloadmessage").html("<span class='spinner-border spinner-border-sm'></span> Getting company details");
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
                $("#chartloadscreen").fadeOut(500);
                plotChart(xDataset, ydataset);    
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