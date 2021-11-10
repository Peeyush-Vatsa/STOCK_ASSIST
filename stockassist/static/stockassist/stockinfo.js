//Prepare data entry here and in index

const swap_stock_symbol_reverse = (st) => {
    let stock = '';
    if (st.endsWith('.BSE')){
        stock = st.replace('.BSE', '{}BS');
    }
    else{
        stock = st.replace('.NSE', '{}NS');
    }
    return stock;
}
$('document').ready(() => {
    setTimeout(() => {
        const stock = $("#stock_info_name").attr('class');
        const stock_short = swap_stock_symbol_reverse(stock);
        //Add load box
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
            },
            error: (error) => {
                //Add error box
                console.log(error);
            },
            complete: (xhr, status) => {

            }
        });
    }, 1000);
});