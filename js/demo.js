$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); //导航栏的提示框

    $('div.demo-ui div.cell').hover(function() {
        $(this).find('.details').fadeTo('fast', 0.7);
    }, function() {
        $(this).find('.details').fadeOut('fast');
    });
});