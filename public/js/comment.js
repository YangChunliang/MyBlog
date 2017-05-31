/**
 * Created by sam on 2017/5/18.
 */

var comments =[]

// 提交评论
$('#messageBtn').on('click',function () {
    $.ajax({
        type:'POST',
        url:'/api/comment/post',
        data:{
            contentid : $('.contentId').val(),
            content : $('#messageContent').val()
        },
        success:function (responseData) {
            // console.log(responseData)
            $('#messageContent').val('')
            comments = responseData.data.comments.reverse()
            renderComment(comments)
        }
    })
})

function renderComment(comments) {

    var html = ''
    for (var i=0;i<comments.length;i++){
        html += '<div class="messageBox">'+
            '<p class="commentInfo clearfix">'+
            '<span class="fl">'+ comments[i].username +'</span><span class="fr time">'+ formatDate(comments[i].postTime) +'</span></p>'+
            '<p class="commentContent">'+ comments[i].content +'</p>'+
            '</div>'
    }
    $('.messageList').html(html)

}


function formatDate(d) {
    var date1 = new Date(d)
    return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日 '+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds()
}
