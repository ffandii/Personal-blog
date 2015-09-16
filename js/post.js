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

    /*****************���ҷ�ҳ��ť���滺Ч��******************/
    $('div.post-part2 a').on('mouseenter mouseleave',function(event) {
        var $liParent=$(this).parent('li');
        if(!($liParent.hasClass('disabled'))){
            if(event.type=='mouseenter'){
                $(this).animate({
                    color: "#dcffd4"
                },{
                    duration: "fast"
                });
            }
            else {
                $(this).animate({
                    color: "#6f9953"
                },{
                    duration: "fast"
                });
            }
        }
    });

//--------------------ҳ�����½ǵ�upͼ�ֱ꣬��ҳ�涥��--------------------//
    if($(window).width()>=960){
        $('<span class="icon glyphicon glyphicon-arrow-up"></span>').insertAfter($('body #wrap')).hide();
        var view_width=$(window).width();
        var view_height=$(window).height();
        $('body>span.icon').css({
            'left': (view_width-120)+"px",
            'top': (view_height-120)+"px"
        });
    }

    $(window).on("resize",function(){
        if($(window).width()>=960){
            var view_width=$(window).width();
            var view_height=$(window).height();
            $('body>span.icon').css({
                'left': (view_width-120)+"px",
                'top': (view_height-120)+"px"
            });
        }
    });

    $(window).scroll(function(){
        if($(window).scrollTop()>0){
            $('body>span.icon').fadeIn('slow');
        }
        else {
            $('body>span.icon').fadeOut('slow');
        }
    });

    $('body>span.icon').on('mouseenter mouseleave',function(event){
        if(event.type=="mouseenter"){
            $(this).stop().animate({
                backgroundColor: "#caccc5",
                color: "#acada7"
            },{
                duration: 400
            });
        }
        else {
            $(this).stop().animate({
                backgroundColor: "#d9dad5",
                color: "#bbbcb7"
            },{
                duration: 400
            });
        }
    });

    $('body>span.icon').on('click',function(){
        $('body,html').stop().animate({scrollTop:0},500);
    });

    var imageSize=[];
    $('div.post-contents img').each(function(index){
        imageSize[index]=[];
        imageSize[index][0]=$(this).attr("width");
        imageSize[index][1]=$(this).attr("height");
    });

    function regulateImage(){
        var baseWidth=1680;
        var pageWidth=$(window).width();
        var $image=$('div.post-contents img');
        if(pageWidth<baseWidth){
            $image.each(function(index){
                var imageWidth=imageSize[index][0];
                var imageHeight=imageSize[index][1];
                var widthRate=pageWidth/baseWidth;
                imageWidth*=widthRate;
                imageHeight*=widthRate;
                $(this).attr("width",Math.round(imageWidth).toString());
                $(this).attr("height",Math.round(imageHeight).toString());
            });

        }
    }

    regulateImage();

//ͼƬ��Ӧҳ��������仯
    $(window).on("resize",function(){
        regulateImage();
    });
});