var twps=new Firebase("https://twps.firebaseio.com")

function isc() {
    var Email=document.getElementById('mail').value;
    var pwd=document.getElementById('pass').value;
    var firstName=document.getElementById('nom').value;
    var lastName=document.getElementById('cog').value;
    var cat=document.getElementById('usCat').value;

    twps.createUser({
        email    : Email,
        password : pwd
    }, function(error, userData) {
        if (error) {
            console.log("Error creating user:", error);
        } else {
            console.log("Successfully created user account with uid:", userData.uid);
            var UID=userData.uid;
            console.log(UID);
        }
    });

    var neoRamo=twps.child('users');
    //var neoRef=neoRamo.child(UID);
    neoRamo.push({
        nome: firstName,
        cognome: lastName,
        email: Email,
        password: pwd,
        typeOfUser: cat,
        countStories: 0,
        countComics: 0,
        countReviews: 0,
        level: "Discepolo"
    });
}

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