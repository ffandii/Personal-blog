var imageSize=[];
$('div.body-contents img').each(function(index){
    imageSize[index]=[];
    imageSize[index][0]=$(this).attr("width");
    imageSize[index][1]=$(this).attr("height");
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); //导航栏的提示框

    //左侧图片区域的缩放
    var widthRate,rate;
    function regulateImage(){
        var baseWidth=1680;
        var pageWidth=$(window).width();
        var $image=$('div.body-contents img');
        if(pageWidth>=992){
            rate=0;
        }
        else {
            rate=0.2;
        }
        $image.each(function(index){

            var imageWidth=imageSize[index][0];
            var imageHeight=imageSize[index][1];
            widthRate=pageWidth/baseWidth;
            imageWidth*=(widthRate+rate);
            imageHeight*=(widthRate+rate);
            $(this).attr("width",Math.round(imageWidth).toString());
            $(this).attr("height",Math.round(imageHeight).toString());
        });
        $('div.basic-information div.right-basic').css({
            marginTop: 32*(widthRate+rate)+'px'
        });
        $('div.right-basic div.job').css({
            'font-size': 24*(widthRate+rate)+'px'
        });
        $('div.right-basic div.status').css({
            marginTop: 9.6*(widthRate+rate)+'px',
            marginBottom: 9.6*(widthRate+rate)+'px',
            'font-size': 15*(widthRate+rate)+'px'
        });
        $('div.gap-line').css({
            marginTop: 27*(widthRate+rate)+'px'
        });
        $('div.major-header').css({
            marginTop: 27*(widthRate+rate)+'px'
        });
    }

    regulateImage();
    //图片响应页面的伸缩变化
    $(window).on("resize",function(){
        regulateImage();
        $('div.basic-information div.right-basic').css({
            marginTop: 32*(widthRate+rate)+'px'
        });
        $('div.right-basic div.job').css({
            'font-size': 24*(widthRate+rate)+'px'
        });
        $('div.right-basic div.status').css({
            marginTop: 9.6*(widthRate+rate)+'px',
            marginBottom: 9.6*(widthRate+rate)+'px',
            'font-size': 15*(widthRate+rate)+'px'
        });
        $('div.gap-line').css({
            marginTop: 27*(widthRate+rate)+'px'
        });
        $('div.major-header').css({
            marginTop: 27*(widthRate+rate)+'px'
        });
    });
});