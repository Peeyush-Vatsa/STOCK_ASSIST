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

const fetch_stock_info = (stock) => {
    const stock_short = swap_stock_symbol_reverse(stock);
    //Add loadbox support
    $("#infoerrorbox").hide();
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
            $("#stock_info_name").html("<b class='text-info'>"+stock+"</b>");
            const fundamentals = response.fundamental;
            for (at in fundamentals){
                $("#"+at).text(fundamentals[at]);
            }
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

const plotChart = (xDataset, yDataset) => {
    new Chart("day_chart", {
        type: 'line',
        data: {
            labels: xDataset,
            datasets: [{
                fill: false,
                lineTension: 0,
                backgroundColor: 'rgba(255,0,0,1.0)',
                borderColor: 'rgba(255,0,0,0.2)',
                data: yDataset
            }]
        },
        options: {
            legend: {display: false},

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
    //Remove later
    setTimeout(plotChart(['12:20','12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55','13:00','13:05'], 
                            [1000,1001,1004,1003,1008,1010.80,1009.20,1004.30,1000.40,997.20,990.90]), 3000);
    setTimeout(plotChart(['12:20','12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55','13:00','13:05', '13:10'], 
                            [1000,1001,1004,1003,1008,1010.80,1009.20,1004.30,1000.40,997.20,990.90, 994.23]), 20000);
        
});