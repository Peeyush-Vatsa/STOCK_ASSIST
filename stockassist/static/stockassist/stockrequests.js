const get_open_price = (stock) => {
    if (stock.endsWith('.NSE')){
        stock.replace('.NSE', '.NS');
    }
    else{
        stock.replace('.BSE', '.BO');
    }
}

$('document').ready(()=> {
    setInterval(() => {
        $.ajax({
            type: "GET",
            url: "../ajax/requests/fetch_price",
            data: {},
            success: (response) => {
                //Add market is closed res box
            }
        });
    }, 60000);
});
