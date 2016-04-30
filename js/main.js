//$('div.hid-ul').hide();

$(document).ready(function(){
    var delay={ "show": 800, "hide": 800 };
    $('[data-toggle="tooltip"]').tooltip(delay); //导航栏的提示框

//------------------删除最后一行的虚线---------------------//
    $('div.blog-outline div.post-outline').each(function(){
        $('<div class="gap-line"></div>').insertAfter(this);
    });

    //blog-outline部分的分割线
    $('div.blog-outline div.gap-line:nth-last-child(1)').remove();
//------------------计数跳动--------------------------
    $('div.cell').on('mouseenter',function(){

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
//--------------------标题书签的提示显示和隐藏---------------------------
    $('div.blog-outline div.post-outline div.post-header a').each(function(){
        $('<span class="icon fa fa-book"></span>').insertAfter(this).hide();
    });

    $('div.blog-outline').on('mouseenter mouseleave','div.post-header a',function(event){
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

//------------------------------评论区的颜色变化,分页区的颜色变化----------------------//
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

//------------------------------分页区的颜色变化----------------------//
    $('div.fenye div').on('mouseenter mouseleave',function(event) {
        if(!$(this).parent().hasClass("active")){
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

//----------------------侧边栏响应滚动条的滑动效果----------------//
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

//----------------------左侧时间标签的颜色信息-----------------//
    if($('div.fenye div').hasClass("home")){
        $('div.post-outline:nth-child(1) div.array-right').addClass("latest1");
        $('div.post-outline:nth-child(3) div.array-right').addClass("latest2");
        $('div.post-outline:nth-child(5) div.array-right').addClass("latest3");
    }
});

//--------------------侧边栏搜索功能的实现，利用ajax--------------------//
$(document).ready(function(){
    var json,lastText="",spaceNum= 6, lastNum, clicked, sum, word;
    $.ajax({
        url: 'http://ffandii.github.io/Personal-blog/search.txt',
        success: function(data) {
            json=JSON.parse(data);
        }
    });

    function showCategory(text) {
        var link = "", value;
        if(text == 'javascript'){
            text = 'Javascript';
        } else if(text == 'css'){
            text = 'CSS';
        } else if(text == 'mean框架') {
            text = 'MEAN框架';
        }
        for (var i = 0, len = json.length; i < len; i++) {
            word = json[i]["c"];
            if (text == word) {
                var html = "", num = json[i]["s"]; sum = num;
                for (var j = spaceNum*lastNum; j < num && j < spaceNum*(lastNum+1); j++) {
                    html += '<div class="post-outline"><div class="post-array"><div class="array-left"><div class="post-header">';
                    html += '<a href="';
                    html += json[i]["a"][j][0] + '">' + json[i]["a"][j][1] + '</a></div> <div class="tags">';
                    var arr = json[i]["a"][j][2].toString().split(",");
                    for (var m = 0, n = arr.length; m < n; m++) {
                        html += '<span class="label label-primary">' + arr[m] + "</span>";
                    }
                    html += '</div></div><div class="array-right';
                    value = j == 0 ? " latest1" : (j == 1 ? " latest2" : (j == 2 ? " latest3" : ""));
                    html += value;
                    html += '">';
                    html += json[i]["a"][j][3];
                    html += '</div></div><div class="post-description">';
                    html += json[i]["a"][j][4];
                    html += '</div> </div>';
                    if (j < num - 1) {
                        html += '<div class="gap-line"></div>';
                    }
                }

                if (num <= spaceNum) {
                } else {
                    if (lastNum==0) {
                        link += "<a href='/' class='link active'><div class='fenye-a'>1</div></a>";
                        for (i = 1, j = Math.floor(num / spaceNum); i <= j; i++) {
                            link += "<a href='/' class='link'><div class='fenye-a'>" + (i + 1) + "</div></a>";
                        }
                        link += "<a href='/' class='link'><div class='fenye-link'>下一页</div></a>";
                    } else if((lastNum+1)*spaceNum>sum) {
                        link += "<a href='#' class='link'><div class='fenye-link'>上一页</div></a>";
                        for (i = 0, j = Math.floor(num / spaceNum); i <= j; i++) {
                            if(i!=j){
                                link += "<a href='#' class='link'><div class='fenye-a'>" + (i + 1) + "</div></a>";
                            } else {
                                link += "<a href='#' class='link active'><div class='fenye-a'>" + (i + 1) + "</div></a>";
                            }
                        }
                    } else {
                        link += "<a href='#' class='link'><div class='fenye-link'>上一页</div></a>";
                        for (i = 0, j = Math.floor(num / spaceNum); i <= j; i++) {
                            if(i!=lastNum){
                                link += "<a href='#' class='link'><div class='fenye-a'>" + (i + 1) + "</div></a>";
                            } else {
                                link += "<a href='#' class='link active'><div class='fenye-a'>" + (i + 1) + "</div></a>";
                            }
                        }
                        link += "<a href='#' class='link'><div class='fenye-link'>下一页</div></a>";
                    }
                }

                clicked=true;
                $("div.fenye").html(link);  //更新分页信息
                return html;
            }
        }
        return "";
    }


    function outlineAnimation(element, html){
        element.slideUp(150, function () {
            $(this).html(html).hide().slideDown(400, function () {
                $('div.blog-outline div.post-outline div.post-header a').each(function () {
                    $('<span class="icon fa fa-book"></span>').insertAfter(this).hide();
                });
            });
        });
    }

    function filterPost(text){
        var html = showCategory(text);
        var blog = $('div.blog-outline');
        outlineAnimation(blog,html);
    }

    $('div.fenye').on('click',function(event){
        event.preventDefault();
        var target = event.target;
        if(clicked===true){
            var str = $(target,'div').text();
            if(str === '上一页'){
                lastNum--;
            } else if(str === '下一页'){
                lastNum++;
            } else {
                var num = parseInt(str);
                if(lastNum+1 === num ){
                } else {
                    lastNum = num-1;
                }
            }
            filterPost(lastText);
        }
    });

    $('div.click').on("click", function () {
        if (json != undefined) {
            var text = $(this).find("div.per-first").text();
            if (lastText == "" || lastText != text) {
                lastText = text;
                clicked=false; lastNum=0; word='';
                filterPost(text);
            }
        }
    });


    /*
     $("div.fenye div.link").on("click",function(){
     clicked=true;
     var value=$(this).find("div")
     });*/

    var width; //窗口宽度

    function regulateImage() {
        width = $(window).width();
        var $body=$('body');
        var fixW;
        if(width<976){  //rate 308/400
            $body.removeClass().css({
                'background-size': "0px 0px,186px,186px"
            });
        }
        else {
            if(width>1382) {
                fixW=Math.floor(360+(width-1664)*0.2614);
                $body.removeClass().css({
                    'background-size': fixW+'px '+ Math.floor(277*fixW/360)+'px,186px,186px'
                });
            }
            else if(width>1200) {
                $body.removeClass().css({
                    'background-size': "320px 246px,186px,186px"
                });
            }
            else {
                $body.removeClass().addClass("mode1").css({
                    'background-size': "280px 216px,186px,186px"
                });
            }
        }
    }

    regulateImage();

    $(window).on("resize",function(){
        regulateImage();
    });
});