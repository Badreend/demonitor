 var socket = io();
 var prevID = '';
 var pollState = false;



 $('.postIDInput').on('input', function(){
  var data = $('.postIDInput').val();
  socket.emit('newPostID', data);
  return false;
});
 $('.msgInput').submit(function(){
  var data = {};
  data.msg = $('#msg').val();
  data.sec = $('.inputSeconds').val()
  data.msgStyle = $('input[name=msgStyle]').filter(':checked').val();

  console.log(data);

  socket.emit('chat message', data);
  $('#msg').val('');
  return false;
});
 socket.on('getEmojiData', function(data){
  if(data){
    if(prevID !== data.postID){
      console.log(data);
      if(data.connected){
        $('.postIDInputLabel').css("background-color", "#1CB27A");
      }else{
        $('.postIDInputLabel').css("background-color", "#D1535D");
      }

      $('.postIDInput').val(data.postID);
      $('.postIDInput').val(data.postID);

    };
    prevID = data.postID;
    $('.totalEmojiData').text("Total: Like " + data.count.like + " - Love " + data.count.love + " - Haha " + data.count.haha + " - Sad " + data.count.sad + " - Angry " + data.count.angry);
  };
});


 $('.tickerForm').submit(function(){
  var data = {};
  data.msg = $('.tickerInput').val();
  socket.emit('newTick', data);
  $('.tickerInput').val('');
  return false;
  

});



 socket.on('getTickerList', function(tickerList){
  $('#tickerList').html('');
  $('#tickerList').val('');

  for(var i = 0; i < tickerList.length; i++){
   var $tick = $('<li>').text(tickerList[i].msg).attr('data',tickerList[i].id).appendTo('#tickerList');
   $tick.append($('<a>').attr('class','deleteTick').text('x'));
 }

 $(".deleteTick").click(function(){
  var id = $(this).parent().attr('data');

  socket.emit('removeTick', id);
  return false;
});
 $('#tickerList').scrollTop($('#tickerList')[0].scrollHeight);
});

 $('.pollActive').change(function(e){
  var pollData = {};
  pollData.bool = $('.pollActive').prop('checked');
  pollData.minutes = $('.pollDuration').val();

  pollData.nameLeft = $('.nameLeft').val();
  pollData.nameRight = $('.nameRight').val();
  pollData.fotoLeft = $('.fotoLeft').val();
  pollData.fotoRight = $('.fotoRight').val();
  console.log(pollData);
  socket.emit('pollState', pollData);
});