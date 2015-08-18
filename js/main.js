$('div.hid-ul').hide();

$('div.post-header').find('span').hide();

//blog-outline部分的分割线
$('div.blog-outline div.gap-line:nth-last-child(1)').remove();

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); //导航栏的提示框

//------------------侧边栏的展开和折叠--------------------------
    $('div.cell').on('click', function() {
        if($(this).children().hasClass('hiden')){
            $(this).children().removeClass('hiden');
            $(this).find('div.hid-ul').show(300);
        }
        else {
            $(this).find('div.hid-ul').addClass('hiden');
            $(this).find('div.hid-ul').hide(300);
        }
    });

    $('div.cell').on('mouseenter',function(){
        /*
         var $details=$(this).find('span.sum');
         $details.addClass('animation');*/


        var $details=$(this).find('span');
        if(!$details.hasClass('animation')){
            $details.addClass('animation');
        }
        else {
            var el= $details,
                newone = el.clone(true);
            el.before(newone);
            $(this).find("." + el.attr("class") + ":last").remove();

        }

    });
//--------------------标题书签的提示显示和隐藏----------------------------
    $('div.post-header a').on('mouseenter mouseleave',function(event){
        if($(window).width()>=400){
            if(event.type=='mouseenter'){
                $(this).next('span').stop().fadeIn('slow');

            }
            else {
                $(this).next('span').stop().fadeOut('slow');
            }
        }
    });
});