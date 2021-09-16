
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

function login(){
    document.getElementById("Login_button").innerHTML = "<span class='spinner-border spinner-border-sm'></span> Logging you in";
}

function signup(){
    document.getElementById("Signup_button").innerHTML = "<span class='spinner-border spinner-border-sm'></span> Signing you up";
}
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
        [$("#stock_1").text(), $("#company_1").text()],
        [$("#stock_2").text(), $("#company_2").text()] ,
        [$("#stock_3").text(), $("#company_3").text()]
    ];
    let noresults = false;
    $("#search_field").keyup(() => {
        let search_string = $("#search_field").val();
        if (noresults == true){
            $("#search_info_panel").removeClass("text-danger").addClass("text-info");
            $("#search_header").show();
            noresults = false;
        }
        if (search_string.length != ""){
            $("#search_info_panel").addClass("spinner-border").text("");
            $.ajax({
                type: "GET",
                url: "/ajax/requests/search",
                data: {
                    searchStr: search_string
                },
                success: (response) => {
                    array_response = response.stock_result;
                    $("#search_info_panel").removeClass("spinner-border").text("Search Results");
                    let empty_stocks = ['4','3','2','1'];
                    let num = 1;
                    for (stock of array_response){
                        $("#icon_"+num.toString()).html("playlist_add"); //Update to include links
                        $("#stock_"+num.toString()).html(stock[1]);
                        $("#company_"+num.toString()).html(stock[2]);
                        $("#searchrow_"+num.toString()).show();
                        empty_stocks.pop();
                        num ++;
                    }
                    if (empty_stocks != []){
                        for (row of empty_stocks){
                            $("#searchrow_"+row).hide();
                        }
                        if (empty_stocks.length == 4){
                            $("#search_info_panel").removeClass("text-info").addClass("text-danger").text("No stocks found");
                            $("#search_header").hide();
                            noresults = true;
                        }
                    }

                },
                error: () => {
                    //add alert box for unexpected error
                }
            });
        }
        else{
            let num = 1;
            for (stock of all_stocks){
                $("#icon_"+num.toString()).html("trending_up");
                $("#stock_"+num.toString()).html(stock[0]);
                $("#company_"+num.toString()).html(stock[1]);
                $("#searchrow_"+num.toString()).show();
                num ++;
            }
            $("#searchrow_4").hide();
            $("#search_info_panel").text("Top Companies");
        }
    });
});