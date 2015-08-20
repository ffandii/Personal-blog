$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip(); //导航栏的提示框

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //blog-outline部分的分割线
    $('div.p-section:nth-last-child(1)').css({
        'border':'none'
    });

    /*****************给每一小节添加锚，便于阅读******************/
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