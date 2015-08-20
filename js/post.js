$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip(); //����������ʾ��

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //blog-outline���ֵķָ���
    $('div.p-section:nth-last-child(1)').css({
        'border':'none'
    });

    /*****************��ÿһС�����ê�������Ķ�******************/
    $('div.content div.p-section').each(function(index){
        var idText="top"+(index+1);
        $(this).attr("id",idText);
    });

    $('div.content div.p-section h3').wrap('<div class="section-header"></div>');

    $('div.content div.p-section h3').each(function(index){
        var hrefText="#top"+(index+1);
        $('<a class="anchor" aria-hidden="true" href='+hrefText+' ><span class="icon glyphicon glyphicon-link"></span></a>')
            .insertAfter(this).hide();
    });

    $('div.p-section div.section-header').on('mouseenter mouseleave',function(event){
        if($(window).width()>=400){
            if(event.type=='mouseenter'){
                $(this).children('a').stop().fadeIn('slow');

            }
            else {
                $(this).children('a').stop().fadeOut('slow');
            }
        }
    });
});