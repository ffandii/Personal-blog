$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip(); //导航栏的提示框

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //blog-outline部分的分割线
    $('div.p-section:nth-last-child(1)').css({
        'border':'none'
    });
});