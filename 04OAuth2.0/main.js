var queryString = location.hash.substring(1);
var params = {};
var regex = /([^&=]+)=([^&]*)/g, m;
while (m = regex.exec(queryString)) {
    params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
}
exchangeOAuth2Token(params);
function exchangeOAuth2Token(params) {
    var oauth2Endpoint = 'https://www.googleapis.com/oauth2/v3/tokeninfo';
    if (params['access_token']) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', oauth2Endpoint + '?access_token=' + params['access_token']);
        xhr.onreadystatechange = function (e) {
            try{
                var response = JSON.parse(xhr.response);
                if (xhr.readyState == 4 &&
                xhr.status == 200 &&
                response['aud'] &&
                response['aud'] == 'YOUR_CLIENT_ID') {
                    console.log("si se guardo");
                    localStorage.setItem('oauth2App', JSON.stringify(params) );
                } else if (xhr.readyState == 4) {
                    console.log('There was an error processing the token, another ' +
                        'response was returned, or the token was invalid.')
                }
            }
            catch(err){
                //console.log("------error aqui:--------");
                console.log(err);
            }
            
        };
        xhr.send(null);
    }
}


let clientID = "YOUR_CLIENT_ID";
let autorizacionURL = "https://accounts.google.com/o/oauth2/v2/auth";
let redirectURL = "http://127.0.0.1/OAuth";
let scope = "https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/plus.login";

function registrar(){
    var url = autorizacionURL;
    url += "?response_type=token"
            +"&redirect_uri=" + encodeURI(redirectURL)
            +"&client_id="+encodeURIComponent(clientID)
            +"&scope="+encodeURI(scope);
    window.open(url);

}


function visualizar(){
    let userInfo = document.getElementById("infoUser");
    let imgU = document.getElementById("imgUser");
    var parametros = JSON.parse(localStorage.getItem('oauth2App'));
    if (parametros && parametros['access_token']) {
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://www.googleapis.com/plus/v1/people/me');
        xhr.setRequestHeader('Authorization',
            JSON.parse(localStorage.getItem('oauth2App')).token_type +
            " "+ JSON.parse(localStorage.getItem('oauth2App')).access_token);


        xhr.onreadystatechange = function(e){
            var responseInfo = JSON.parse( xhr.response);
            imgU.src= responseInfo.image.url;
            console.log(responseInfo);
            userInfo.innerHTML = "<table><tr><th>Nombre</th><th>Apellido</th><th>Correo</th>"+
            "</tr><tr><td>"+responseInfo.name.givenName+"</td>"+
              "<td>"+responseInfo.name.familyName+"</td>"+
              "<td>"+responseInfo.emails[0].value+"</td>"+
            "</tr></table>";
        };
        xhr.send(null);
    }else{
        userInfo.innerHTML="<b>NO hay información que mostrar</b>";
    }
}