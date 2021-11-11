//Prepare data entry here and in index

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
            $("#infoloadmessage").html("");
            $("#infoerrorbox").slideDown(500);
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
                $("#infoloadmessage").html("");
                $("#infoerrorbox").slideDown(500);
            }
        });
    }, 100);
});