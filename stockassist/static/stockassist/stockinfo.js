//Prepare data entry here and in index
const initialise_stock_data = () => {
    stock_name = $('#stock_info_name').attr('class');
    fetch_stock_data(stock_name);
}
const swap_stock_symbol_reverse = (st) => {
    stock = '';
    if (st.endsWith('.BSE')){
        stock = st.replace('.BSE', '.BS');
    }
    else{
        stock = st.replace('.NSE', '.NS');
    }
    return stock;
}
const fetch_stock_data = (stk) => {
    st = swap_stock_symbol_reverse(stk);
    //Add ajax req to get-info
}
$('document').ready(() => {
    setTimeout(initialise_stock_data(), 1500);
});