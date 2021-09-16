
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
    $("#search_field").keyup(() => {
        let search_string = $("#search_field").val()
        if (search_string.length != ""){
            $.ajax({
                type: "GET",
                url: "/ajax/requests/search",
                data: {
                    searchStr: search_string
                },
                success: (response) => {
                    array_response = response.stock_result;
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
                            $("#search_info_panel").css("text-align","center").addClass("bg-danger").text("No results").addClass(
                                "text-light"
                            );
                            $("#search_header").hide();
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
            $("#searchrow_4").hide()
        }
    });
});