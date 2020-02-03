window.addEventListener('load', function () {
   	let fotos = new Photos();
	fotos.checkStorage();
});

const Photos = function () {
   
};


Photos.prototype = {

	flickrData : '',


	checkStorage : function()
	{
		if(localStorage.getItem('flickrData'))
		{
			this.flickrData = JSON.parse(localStorage.getItem('flickrData'));
			this.showPhotos();
		}
	else
		{
			this.getFlickerData();
		}

	},

	showPhotos: function()
    {
    	
      let photos = this.flickrData.photoset.photo;
    	for ( image in photos)
    	{
    		this.addPhoto(this.buildPhotoURL(photos[image]));
    	}	
    },
    buildPhotoURL: function(photo)
		{
			return 'https://live.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_b.jpg';
		},
	addPhoto: function(photo)
		{
			let containerDiv = document.getElementById('photos');
			var img = document.createElement('img'); 
		    img.src = photo; 
		    containerDiv.appendChild(img); 
		},

    getFlickerData: function()
	{
		console.log('flickr 2');
		$.ajax({
	        type: "GET",
	        url: "https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=2c45c27714bec652243d7e68e869506e&photoset_id=72157711964481417&user_id=80995589%40N00&format=json&nojsoncallback=1",
	        processData: true,
	        data: {},
	        dataType: "json",
	           error: function(e){
	           console.log(e);                    
	           },
	           success: function (data) {
				let fotos = new Photos();
				fotos.flickrData = data;
				fotos.showPhotos(data);
	            localStorage.setItem('flickrData', JSON.stringify(data));
	            }
	     });
	}

}









