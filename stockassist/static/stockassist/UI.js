
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
});