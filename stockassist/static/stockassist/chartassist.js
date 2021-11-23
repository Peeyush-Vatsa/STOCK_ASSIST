const dataperiod = ['1D', '1M', '3M', '6M', '1Y', '5Y', 'MAX'];

const plotStockChart = (TIMEPERIOD) => {
    if ($("#"+TIMEPERIOD).attr('class').includes('active') == false){
        dataperiod.forEach((val) => {
            if ($("#"+val).attr('class').includes('active') == true){
                $("#"+val).removeClass('active').removeClass('bg-secondary').addClass('text-secondary');
            }
        });
        $("#"+TIMEPERIOD).addClass('active').removeClass('text-secondary').addClass('bg-secondary');
    }
}