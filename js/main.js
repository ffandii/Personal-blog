$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); //����������ʾ��

    $('div.hid-ul').hide();

    //   $('div.hid-ul').show();
//   $('ul.arc-list').removeClass('hidden');
    $('div.cell').on('click', function() {
        if($('div.hid-ul').hasClass('hiden')){
            $('div.hid-ul').removeClass('hiden');
            $('div.hid-ul').show(300);
        }
        else {
            $('div.hid-ul').addClass('hiden');
            $('div.hid-ul').hide(300);
        }
    });

    //   $('div.hid-ul').show();
//   $('ul.arc-list').removeClass('hidden');

    /*
    $('div.cell').on('mouseover', function() {
        $('div.hid-ul').show();
    });

    $('div.cell').on('mouseout', function() {
        $('div.hid-ul').hide();
    });*/



    //blog-outline���ֵķָ���
    $('div.blog-outline div.gap-line:nth-last-child(1)').remove();
});