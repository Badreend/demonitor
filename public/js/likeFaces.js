		var access_token = '300916473635695|-JiAKyIwEKwBRoc7J2bjXYm2YYo'; 
		var postID = '1234790766605507'; 
		var likedShown = [];
		var counter = 0;
		var liked = [];


		var url = 'https://graph.facebook.com/v2.8/'+ postID + '/reactions' + '?fields=' + 'pic%2Cpic_large%2Cname%2Ctype%2Ccreated_time' + '&limit=3000' + '&access_token=' + access_token;


		function getData(){
			$.getJSON(url, function(res){
				if(!res){
					return;
				}
				liked = res.data;
				liked.reverse();
				console.log(liked.length);
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
					console.log('newObject');
					$face = $('<img>').attr('src',liked[counter].pic_large).attr('class','likeFace');
					$face.delay(2500).fadeOut(4000);
					
					$('.likeFacesContainer').append($face);
				

					counter++;
				


			}
		}
		setInterval(update, 3000);
		setInterval(getData, 3000);




		$(document).ready(function(){
			getData();
		});