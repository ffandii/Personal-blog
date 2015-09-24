//$('div.hid-ul').hide();

$(document).ready(function(){
    var delay={ "show": 800, "hide": 800 };
    $('[data-toggle="tooltip"]').tooltip(delay); //����������ʾ��

//------------------ɾ�����һ�е�����---------------------//
    $('div.blog-outline div.post-outline').each(function(){
        $('<div class="gap-line"></div>').insertAfter(this);
    });

    //blog-outline���ֵķָ���
    $('div.blog-outline div.gap-line:nth-last-child(1)').remove();

//------------------�������չ�����۵�--------------------------
    $('div.cell').on('click', function() {
        if($(this).next('div.hid-ul').hasClass('hiden')){
            $(this).next('div.hid-ul').removeClass('hiden');
            $(this).next('div.hid-ul').show(300);
        }
        else {
            $(this).next('div.hid-ul').addClass('hiden');
            $(this).next('div.hid-ul').hide(300);
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
//--------------------������ǩ����ʾ��ʾ������----------------------------
    $('div.blog-outline div.post-outline div.post-header a').each(function(){
        $('<span class="icon fa fa-book"></span>').insertAfter(this).hide();
    });

    $('div.post-header a').on('mouseenter mouseleave',function(event){
        if($(window).width()>=480){
            if(event.type=='mouseenter'){
                $(this).next('span').stop().fadeIn('slow');
                $(this).stop().animate({
                    color: "#b47160"
                },{
                    duration: 300
                });
            }
            else {
                $(this).next('span').stop().fadeOut('slow');
                $(this).stop().animate({
                    color: "#60acb4"
                },{
                    duration: 300
                });
            }
        }
    });

//----------------�������ǩ�������ͣ������ʱ�Ķ���ɫ�仯---------------------//
    $('div.blog-side-bar div.cell').on('mouseenter mouseleave',function(event) {
        if(event.type=='mouseenter'){
            $(this).stop().animate({
                backgroundColor: "#96B86C"
            },{
                duration: "fast"
            });
        }
        else {
            $(this).stop().animate({
                backgroundColor: "#a1c279"
            },{
                duration: "fast"
            });
        }
    });

//------------------------------�����Լ����ʱ���������----------------------//
    $('#show_disqus').click(function(){
        var $comment=$(this).parent('div.comment');
        var html='';
        html+='<div id="disqus_thread"></div>';
        html+='<script type="text/javascript">';
        html+="var disqus_shortname = 'FCBmessi';";
        html+="(function() {var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;";
        html+="dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';";
        html+="(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);})();";
        html+=' </script><noscript>';
        html+=' Please enable JavaScript to view the';
        html+='<a href="http://disqus.com/?ref_noscript">';
        html+='comments powered by Disqus.</a></noscript>';
        $(this).fadeOut('slow');
        setTimeout(function(){
            $comment.html(html);
        },300);
    });

//------------------------------����������ɫ�仯----------------------//
    $('#show_disqus div.center').on('mouseenter mouseleave',function(event) {
        if(event.type=='mouseenter'){
            $(this).stop().animate({
                color: "#b47160"
            },{
                duration: 400
            });
        }
        else {
            $(this).stop().animate({
                color: "#60acb4"
            },{
                duration: 400
            });
        }
    });

//------------------------------��ҳ������ɫ�仯----------------------//
    $('div.fenye div').on('mouseenter mouseleave',function(event) {
        if(!$(this).hasClass("active")){
            if(event.type=='mouseenter'){
                $(this).stop().animate({
                    backgroundColor: "#b47160"
                },{
                    duration: 400
                });
            }
            else {
                $(this).stop().animate({
                    backgroundColor: "#60acb4"
                },{
                    duration: 400
                });
            }
        }
    });

//----------------------�������Ӧ�������Ļ���Ч��----------------//
    var divTop=60;
    $(window).scroll(function(){
        var offsetop;//$('div.sidebar-outline').offset().top;
        if($(window).width()>=960){
            if($(window).scrollTop()<=45){
                offsetop=divTop+($(window).scrollTop())+"px";
            }
            else {
                offsetop=divTop+($(window).scrollTop()-60)+"px";
            }
            $('div.sidebar-outline').animate({marginTop:offsetop},{duration:1200,queue:false})
        }
    });

    $(window).on("resize",function(){
        if($(window).width()<960) {
            $('div.sidebar-outline').css({marginTop:0});
        }
        else {
            var offsetop=divTop+($(window).scrollTop())+"px";
            $('div.sidebar-outline').animate({marginTop:offsetop},{duration:1200,queue:false})
        }
    });

//----------------------���ʱ���ǩ����ɫ��Ϣ----------------//
    if($('div.fenye div').hasClass("home")){
        $('div.post-outline:nth-child(1) div.array-right').addClass("latest1");
        $('div.post-outline:nth-child(3) div.array-right').addClass("latest2");
        $('div.post-outline:nth-child(5) div.array-right').addClass("latest3");
    }

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
            $('body>span.icon').stop().fadeIn('slow');
        }
        else {
            $('body>span.icon').stop().fadeOut('slow');
        }
    });

    $('body>span.icon').on('mouseenter mouseleave',function(event){
        if(event.type=="mouseenter"){
            $(this).stop().animate({
                backgroundColor: "#d9dad5",
                color: "#bbbcb7"
            },{
                duration: 400
            });
        }
        else {
            $(this).stop().animate({
                backgroundColor: "#e8e8e5",
                color: "#cacbc7"
            },{
                duration: 400
            });
        }
    });

    $('body>span.icon').on('click',function(){
        $('body,html').stop().animate({scrollTop:0},500);
    });
});
