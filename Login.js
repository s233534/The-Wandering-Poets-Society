/**
 * Created by giancarloavalle on 02/05/16.
 */
var twps = new Firebase("https://twps.firebaseio.com/");

function errorMail(){
    window.alert('mail non corrispondente');
}

function errorPwd(){
    window.alert('password non corrispondente');
}

function iscriviti(){
    var nm=document.getElementById('firstName').value;
    var sn=document.getElementById('lastName').value;
    var uI=document.getElementById('username').value;
    var mail=document.getElementById('email').value;
    var cmail=document.getElementById('confirmMail').value;
    if (cmail==mail){

    }else{
        errorMail();
        return
    }
    var pwd=document.getElementById('password').value;
    var cpwd=document.getElementById('confirmPassword').value;
    if (cpwd==pwd){

    }else{
        errorPwd();
        return
    }
    var dob=document.getElementById('dateOfBirth').value;
    var uT=document.getElementById('userType').value;
    var infoU=nm+" "+sn+" "+uI+" "+mail+" "+pwd+" "+dob+" "+uT;
    window.alert(infoU);

    var usersRamo=twps.child("users");
    var usersRef=usersRamo.child(uI);

    usersRef.set({
            name: nm,
            surname: sn,
            email:mail,
            password: pwd,
            dateOfBirth:dob,
            typeOfUser:uT

    });



    /*
    twps.createUser({
        nome: nm,
        cognome: sn,
        userName: uI,
        email: mail,
        password: pwd,
        dateOfBirth: dob,
        userType: uT
    }, function (error, userData) {
        if(error){
            console.log("Error creating user", error);
        }else{
            console.log("Successfully created user account", userData.uid);
        }
    });
    */
}







//function getCalendar (){
  //      $.datepicker.setDefaults($.datepicker.regional['it']);
    //    $( "#datepicker").datepicker();
      //  window.alert("1");
    //}

function getCalendar2() {
    $('.datepicker').datepicker({
        days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
        daysShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
        daysMin: ["Do", "Lu", "Ma", "Me", "Gi", "Ve", "Sa"],
        months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
        monthsShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        today: "Oggi",
        monthsTitle: "Mesi",
        clear: "Cancella",
        weekStart: 1,
        format: "dd/mm/yyyy"
    });
}

