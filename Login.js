/**
 * Created by giancarloavalle on 02/05/16.
 */

var twps = new Firebase("https://twps.firebaseio.com/");

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

