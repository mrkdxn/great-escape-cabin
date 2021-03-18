window.addEventListener('load', function () {
   	let fotos = new Photos();
	fotos.init();
});

const Photos = function () {
   
};


Photos.prototype = {

	flickrData : '',
	coverPhoto : '',


	init: function()
	{
		this.buildElements();
		this.checkStorage();
	},
	buildElements: function() 
	{
		let containerDiv = document.getElementById('photos');
		photoDiv = document.createElement('div');
		photoDiv.setAttribute('id', 'cover');
		photoDiv.setAttribute('class', 'grid');
		containerDiv.appendChild(photoDiv);

		photoList = document.createElement('div');
		photoList.setAttribute('id', 'photoList');
		containerDiv.appendChild(photoList);

	},

	checkStorage : function()
	{
		if(localStorage.getItem('flickrDataXXX'))
		{
			this.flickrData = JSON.parse(localStorage.getItem('flickrData'));
			this.showPhotos();
			console.log(this.flickrData);
		}
	else
		{
			this.getFlickerData();
		}

	},

	showPhotos: function()
    {
    	this.setCoverPhoto();
      	let photos = this.flickrData.photoset.photo;
	    	for ( image in photos)

	    	{
	    		this.addPhoto(this.buildPhotoURL(photos[image]), photos[image].title);
	    	}	
    },
    buildPhotoURL: function(photo)
		{
			
			let thePhoto = 'https://live.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'_b.jpg';
			if(photo.id == this.coverPhoto)
			{
				console.log(thePhoto);
				//this.buildCoverPhoto(thePhoto);
			}
			return thePhoto;
		},
	addPhoto: function(photo, title)
		{
			let containerDiv = document.getElementById('photoList');
			var img = document.createElement('img'); 
		    img.src = photo;
		    img.title = title;
		    containerDiv.appendChild(img);
			//img.appendChild('<p>' + title + '</p>');
		},
	setCoverPhoto: function()
		{
			this.coverPhoto = this.flickrData.photoset.primary;
		},

	buildCoverPhoto: function(cover)
		{
			console.log(cover);
			let containerDiv = document.getElementById('cover');
			let theFirstChild = containerDiv.firstChild
			var img = document.createElement('img'); 
		    img.src = cover; 
		    containerDiv.insertBefore(img, theFirstChild); 	
		},

    getFlickerData: function()
	{
		console.log('flickr 2');
		$.ajax({
	        type: "GET",
	        url: "https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=2c45c27714bec652243d7e68e869506e&photoset_id=72157715632321882&user_id=80995589%40N00&extras=tags,description&format=json&nojsoncallback=1",
	        processData: true,
	        data: {},
	        dataType: "json",
	           error: function(e){
	           console.log(e);                    
	           },
	           success: function (data) {
	           	console.log(data);
				let fotos = new Photos();
				fotos.flickrData = data;
				fotos.showPhotos(data);
	            localStorage.setItem('flickrData', JSON.stringify(data));
	            }
	     });
	}

}









