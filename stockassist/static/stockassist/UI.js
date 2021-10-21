//Javascript
function changeVis() {
    pwd = document.getElementById("pwd");
    pwdToggle = document.getElementById("togglePwdIcon");
    if (pwd.type === 'password'){
        pwd.type = 'text';
        pwdToggle.innerHTML = "visibility";
    }
    else{
        pwd.type = 'password';
        pwdToggle.innerHTML = "visibility_off";
    }
}
//Increase robustivity
function login(){
    document.getElementById("Login_button").innerHTML = "<span class='spinner-border spinner-border-sm'></span> Logging you in";
}

function signup(){
    document.getElementById("Signup_button").innerHTML = "<span class='spinner-border spinner-border-sm'></span> Signing you up";
}

//Jquery:
$(document).ready(() => {
    $("#search_field").focus(() => {
        $("#search_field").animate({
            width: '60%'
        });
        $("#search_results").slideDown("fast");
    });
    $("#search_field").blur(() => {
        $("#search_field").animate({
            width: '30%'
        });
        $("#search_results").slideUp("fast");
    });

    const all_stocks = [
        [$("#stock_1").text(), $("#company_1").text(), $("add_to_watchlist_1").attr("href")],
        [$("#stock_2").text(), $("#company_2").text(), $("add_to_watchlist_2").attr("href")] ,
        [$("#stock_3").text(), $("#company_3").text(), $("add_to_watchlist_3").attr("href")]
    ];
    let noresults = false;
    $("#search_field").keyup(() => {
        let search_string = $("#search_field").val();
        if (noresults == true){
            $("#search_panel").removeClass("text-danger").addClass("text-info");
            $("#search_header").show();
            noresults = false;
        }
        if (search_string.length != ""){
            $("#search_spinner").addClass("spinner-border").text("  ");
            $("#search_info_panel").text("");
            $.ajax({
                type: "GET",
                url: "../ajax/requests/search",
                data: {
                    searchStr: search_string
                },
                success: (response) => {
                    //Check if stock is already in watchlist
                    array_response = response.stock_result;
                    $("#search_info_panel").text("Search Results");
                    $("#search_spinner").removeClass("spinner-border");
                    let empty_stocks = ['4','3','2','1'];
                    let num = 1;
                    for (stock of array_response){
                        console.log("Stock_"+num.toString()+stock);
                        $("#stock_"+num.toString()).html(stock[0]);
                        $("#company_"+num.toString()).html(stock[1]);
                        $("#add_to_watchlist_"+num.toString()).attr("href", "../addstock/"+stock[0]+"/"+stock[1]+"/");
                        console.log($("#add_to_watchlist_"+num.toString()).css('href'));
                        $("#searchrow_"+num.toString()).show();
                        empty_stocks.pop();
                        num ++;
                    }
                    if (empty_stocks != []){
                        for (row of empty_stocks){
                            $("#searchrow_"+row).hide();
                        }
                        if (empty_stocks.length == 4){
                            $("#search_panel").removeClass("text-info").addClass("text-danger");
                            $("#search_info_panel").text("No stocks found");
                            $("#search_header").hide();
                            noresults = true;
                        }
                    }

                },
                error: () => {
                    $("#errormessages").text("An unexpected error occured. Please try again");
                    $("#errorbox").css("display", "block");
                }
            });
        }
        else{
            let num = 1;
            for (stock of all_stocks){
                $("#add_to_watchlist_"+num.toString()).attr('href', stock[2]);
                $("#stock_"+num.toString()).html(stock[0]);
                $("#company_"+num.toString()).html(stock[1]);
                $("#searchrow_"+num.toString()).show();
                num ++;
            }
            $("#searchrow_4").hide();
            $("#search_info_panel").text("Top Companies");
        }
    });
    //Add code here
});