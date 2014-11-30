/**
 * Created with PyCharm.
 * User: Epsirom
 * Date: 13-11-29
 * Time: 下午5:27
 */

var xmlhttp = null;

function hideElem(id) {
    document.getElementById(id).style.display = 'none';
}

function showElem(id) {
    document.getElementById(id).style.display = 'block';
}

function clearHelp(groupid, helpid) {
    document.getElementById(groupid).setAttribute('class', 'form-group');
    //document.getElementById(helpid).setAttribute('hidden', 'hidden');
    //document.getElementById(helpid).setAttribute('style', 'display:none;');
    hideElem(helpid);
}

function clearAllHelps() {
    clearHelp('usernameGroup', 'helpUsername');
    clearHelp('passwordGroup', 'helpPassword');
    clearHelp('submitGroup', 'helpSubmit');
}

function showSuccess(groupid, helpid) {
    document.getElementById(groupid).setAttribute('class', 'form-group has-success');
    //document.getElementById(helpid).setAttribute('hidden', 'hidden');
    hideElem(helpid);
}

function showError(groupid, helpid, text) {
    var dom = document.getElementById(helpid);
    dom.innerText = text;
    //dom.removeAttribute('hidden');
    showElem(helpid);
    document.getElementById(groupid).setAttribute('class', 'form-group has-error');
}

function disableOne(id, flag) {
    var dom = document.getElementById(id);
    if (flag) {
        dom.setAttribute('disabled', 'disabled');
    } else {
        dom.removeAttribute('disabled');
    }
}

function disableAll(flag) {
    disableOne('inputUsername', flag);
    disableOne('inputPassword', flag);
    disableOne('submitBtn', flag);
}

function showLoading(flag) {
    //var dom = document.getElementById('helpLoading');
    if (flag) {
        //dom.removeAttribute('hidden');
        showElem('helpLoading');
    } else {
        //dom.setAttribute('hidden', 'hidden');
        hideElem('helpLoading');
    }
}

function readyStateChanged() {
    if (xmlhttp.readyState==4)
    {// 4 = "loaded"
        if (xmlhttp.status==200)
        {// 200 = OK
            var result = xmlhttp.responseText;
            switch (result)
            {
                case 'Accepted':
                    //document.getElementById('validationHolder').setAttribute('hidden', 'hidden');
                    hideElem('validationHolder');
                    //document.getElementById('successHolder').removeAttribute('hidden');
                    showElem('successHolder');
                    return;

                case 'Rejected':
                    showError('usernameGroup', 'helpUsername', '');
                    showError('passwordGroup', 'helpPassword', '学号或密码错误！请输入登录info的学号和密码');
                    break;

                case 'Error':
                    showError('submitGroup', 'helpSubmit', '出现了奇怪的错误，我们已经记录下来了，请稍后重试。')
                    break;
            }
        }
        else
        {
            showError('submitGroup', 'helpSubmit', '服务器连接异常，请稍后重试。')
        }
        showLoading(false);
        disableAll(false);
    }
}
function ticketStateChanged(){
    if (xmlhttp.readyState==4)
    {// 4 = "loaded"
        if (xmlhttp.status==200)
        {// 200 = OK
            var result = xmlhttp.responseText;
            switch (result)
            {
                case 'OK':
                    //document.getElementById('validationHolder').setAttribute('hidden', 'hidden');
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookError');
                    showElem('bookOK');
                    //document.getElementById('successHolder').removeAttribute('hidden');
                    return;

                case 'actNotExist':
                    //showError('usernameGroup', 'helpUsername', '');
                    //showError('passwordGroup', 'helpPassword', '学号或密码错误！请输入登录info的学号和密码');
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    showElem('bookError');
                    break;

                case 'Error':
                    //showError('submitGroup', 'helpSubmit', '出现了奇怪的错误，我们已经记录下来了，请稍后重试。')
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    showElem('bookError');
                    break;

                case 'OK1':
                    showSeats();
                    break;

                case 'TicketBooked':
                    hideElem('usernameGroup');
                    hideElem('submitGroup');
                    hideElem('bookOK');
                    showElem('bookError');
                    break;


            }
        }
        else
        {
            showError('submitGroup', 'helpSubmit', '服务器连接异常，请稍后重试。')
        }
        showLoading(false);
        disableAll(false);
    }
}

function submitValidation(openid) {
    if (checkUsername() & checkPassword()) {
        disableAll(true);
        showLoading(true);
        var form = document.getElementById('validationForm'),
            elems = form.elements,
            url = form.action,
            params = "openid=" + encodeURIComponent(openid),
            i, len;
        for (i = 0, len = elems.length; i < len; ++i) {
            params += '&' + elems[i].name + '=' + encodeURIComponent(elems[i].value);
        }
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = readyStateChanged;
        xmlhttp.send(params);
    }
    return false;
}

function submitValidation2(openid, actid, seat) {
        var form = document.getElementById('validationForm'),
            elems = form.elements,
            url = form.action,
            params = "openid=" + encodeURIComponent(openid),
            i, len;
		params += '&' + "actid" + '=' + encodeURIComponent(actid);
        params += '&' + "seat"  + '=' + encodeURIComponent(seat);		
        for (i = 0, len = elems.length; i < len; ++i) {
            params += '&' + elems[i].name + '=' + encodeURIComponent(elems[i].value);
        }
        xmlhttp = new XMLHttpRequest();
        xmlhttp.open('POST', url, true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = ticketStateChanged;
        xmlhttp.send(params);    
    return false;
}

function checkNotEmpty(groupid, helpid, inputid, hintName) {
    if (document.getElementById(inputid).value.trim().length == 0) {
        document.getElementById(groupid).setAttribute('class', 'form-group has-error');
        var dom = document.getElementById(helpid);
        dom.innerText = '请输入' + hintName + '！';
        //dom.removeAttribute('hidden');
        showElem(helpid);
        return false;
    } else {
        showSuccess(groupid, helpid);
        return true;
    }
}

function checkIsDigit(groupid, helpid, inputid, hintName) {
    if (isNaN(document.getElementById(inputid).value)) {
        document.getElementById(groupid).setAttribute('class', 'form-group has-error');
        var dom = document.getElementById(helpid);
        dom.innerText = hintName + '必须为数字！';
        //dom.removeAttribute('hidden');
        showElem(helpid);
        return false;
    } else {
        showSuccess(groupid, helpid);
        return true;
    }
}

function checkUsername() {
    if (checkNotEmpty('usernameGroup', 'helpUsername', 'inputUsername', '学号')) {
        return checkIsDigit('usernameGroup', 'helpUsername', 'inputUsername', '学号');
    }
    return false;
}

function checkPassword() {
    return checkNotEmpty('passwordGroup', 'helpPassword', 'inputPassword', '密码');
}

window.setupWeixin({'optionMenu':false, 'toolbar':false});

clearAllHelps();

/*
document.getElementById('inputUsername').onfocus = function(){
    setfooter();
}

document.getElementById('inputPassword').onfocus = function(){
    setfooter();
}*/

function showValidation(isValidated) {
    if (!isValidated) {
        document.getElementById('inputUsername').focus();
    } else {
        showElem('successHolder');
        hideElem('validationHolder');
    }
}


function showSeats(){
        document.getElementById("region").style.display="none";
        document.getElementById("AArea").style.display="none";
        document.getElementById("BArea").style.display="none";
        document.getElementById("CArea").style.display="none";
        document.getElementById("DArea").style.display="none";
        //document.getElementById("seats").style.display="block";
        document.getElementById("seatSubmit").style.display="inline-block";
        document.getElementById("seat1").style.display="inline-block";
        document.getElementById("seat2").style.display="inline-block";
        document.getElementById("seat3").style.display="inline-block";
        document.getElementById("seat4").style.display="inline-block";
        document.getElementById("seat5").style.display="inline-block";
        document.getElementById("seat6").style.display="inline-block";
        document.getElementById("seat7").style.display="inline-block";
        document.getElementById("seat8").style.display="inline-block";
        document.getElementById("seat9").style.display="inline-block";
        document.getElementById("seat10").style.display="inline-block";
        document.getElementById("seat11").style.display="inline-block";
        document.getElementById("seat12").style.display="inline-block";
        document.getElementById("seat13").style.display="inline-block";
        document.getElementById("seat14").style.display="inline-block";
        document.getElementById("seat15").style.display="inline-block";
        document.getElementById("seat16").style.display="inline-block";
        document.getElementById("seat17").style.display="inline-block";
        document.getElementById("seat18").style.display="inline-block";
        document.getElementById("seat19").style.display="inline-block";
        document.getElementById("seat20").style.display="inline-block";
        document.getElementById("seat21").style.display="inline-block";
        document.getElementById("seat22").style.display="inline-block";
        document.getElementById("seat23").style.display="inline-block";
        document.getElementById("seat24").style.display="inline-block";
        document.getElementById("seat25").style.display="inline-block";
        document.getElementById("seat26").style.display="inline-block";
        document.getElementById("seat27").style.display="inline-block";
        document.getElementById("seat28").style.display="inline-block";
        document.getElementById("seat29").style.display="inline-block";
        document.getElementById("seat30").style.display="inline-block";
        document.getElementById("seat31").style.display="inline-block";
        document.getElementById("seat32").style.display="inline-block";
        document.getElementById("seat33").style.display="inline-block";
        document.getElementById("seat34").style.display="inline-block";
        document.getElementById("seat35").style.display="inline-block";
        document.getElementById("seat36").style.display="inline-block";
        document.getElementById("seat37").style.display="inline-block";
        document.getElementById("seat38").style.display="inline-block";
        document.getElementById("seat39").style.display="inline-block";
        document.getElementById("seat40").style.display="inline-block";
        document.getElementById("seat41").style.display="inline-block";
        document.getElementById("seat42").style.display="inline-block";
        document.getElementById("seat43").style.display="inline-block";
        document.getElementById("seat44").style.display="inline-block";
        document.getElementById("seat45").style.display="inline-block";
}