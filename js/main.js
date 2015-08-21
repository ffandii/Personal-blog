$('div.hid-ul').hide();

//$('div.post-header').find('span').hide();

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
    $('div.blog-outline div.post-outline div.post-header a').each(function(){
        $('<span class="icon fa fa-book"></span>').insertAfter(this).hide();
    });

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

//----------------侧边栏书签在鼠标悬停及进入时的额颜色变化---------------------//
    $('div.blog-side-bar div.cell').on('mouseenter mouseleave',function(event) {
        if(event.type=='mouseenter'){
            $(this).stop().animate({
                backgroundColor: "#b1d8d8"
            },{
                duration: "fast"
            });
        }
        else {
            $(this).stop().animate({
                backgroundColor: "#b6dede"
            },{
                duration: "fast"
            });
        }
    });

//------------------------------隐藏以及点击时添加评论区----------------------//
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
});