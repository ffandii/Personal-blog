$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip(); //����������ʾ��

    $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
    });

    //blog-outline���ֵķָ���
    $('div.p-section:nth-last-child(1)').css({
        'border':'none'
    });
});