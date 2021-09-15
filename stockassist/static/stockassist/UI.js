
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
    const sym_1 = document.getElementById("stksymbol_1");
    const sym_2 = document.getElementById("stksymbol_2");
    const sym_3 = document.getElementById("stksymbol_3");
    const com_1 = document.getElementById("companyname_1");
    const com_2 = document.getElementById("companyname_2");
    const com_3 = document.getElementById("companyname_3");
    $("#search_field").keyup(() => {
        let search_string = $("#search_field").val()
        if (search_string.length >= 3){
            //Add preserve code here
            $.ajax({
                type: "GET",
                url: "/ajax/requests/search",
                data: {
                    searchStr: search_string
                },
                success: (response) => {
                    array_response = response.stock_result;
                    console.log(array_response)
                    sym_1.innerHTML = array_response[0][1];
                    com_1.innerHTML = array_response[0][2];
                    sym_2.innerHTML = array_response[1][1];
                    com_2.innerHTML = array_response[1][2];
                    sym_3.innerHTML = array_response[2][1];
                    com_3.innerHTML = array_response[2][2];
                }
            });
        }
    });
});