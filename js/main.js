$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); //导航栏的提示框

    //   $('div.hid-ul').show();
//   $('ul.arc-list').removeClass('hidden');
    $('div.cell').on('mouseover', function() {
        $('div.hid-ul').show();
    });

    $('div.cell').on('mouseout', function() {
        $('div.hid-ul').hide();
    });

    //blog-outline部分的分割线
    $('div.blog-outline div.gap-line:nth-last-child(1)').remove();
});