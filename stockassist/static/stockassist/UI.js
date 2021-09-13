
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