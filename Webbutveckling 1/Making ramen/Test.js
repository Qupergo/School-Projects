$(function(){
    $( "input[type=checkbox]" ).on("change", function(){
        if($(this).is(':checked'))
            $(this).parent().css('background-color', '#4CAF50');
        else
            $(this).parent().css('background-color', '');
    });
});