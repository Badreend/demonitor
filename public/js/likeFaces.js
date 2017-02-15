		var access_token = '300916473635695|-JiAKyIwEKwBRoc7J2bjXYm2YYo'; 
		var likedShown = [];
		var counter = 0;
		var liked = [];

			var postID = undefined; 
			var url = undefined;
		socket.on('getEmojiData', function(data){
			postID = data.postID;
			url = 'https://graph.facebook.com/v2.8/'+ postID + '/reactions' + '?fields=' + 'pic%2Cpic_large%2Cname%2Ctype%2Ccreated_time' + '&limit=3000' + '&access_token=' + access_token;
		});



		function getData(){
			$.getJSON(url, function(res){
				if(!res){
					return;
				}
				liked = res.data;
				liked.reverse();
			});
		}


		function update(){
			if(liked[counter]){
				for(var i = 0; i < likedShown.length; i++){
					if(likedShown[i].id === liked[counter].id){
						return;
					}
				}
					likedShown.push(liked[counter]);
					$face = $('<img>').attr('src',liked[counter].pic_large).attr('class','likeFace');
					$face.delay(2700).fadeOut(400);					
					$('.likeFacesContainer').append($face);
					counter++;	

			}
		}
				setInterval(getData, 3500);

		setInterval(update, 3500);




		$(document).ready(function(){
			getData();
		});