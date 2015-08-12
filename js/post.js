$(document).ready(function() {
    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //blog-outline部分的分割线
    $('div.p-section:nth-last-child(1)').css({
        'border':'none'
    });
});