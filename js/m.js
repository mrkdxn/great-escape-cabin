
window.addEventListener('load', function () {
    let fotos = new Photos();
    fotos.init();
});

const Photos = function () {

};


Photos.prototype = {

    flickrData : '',

    init: function()
    {
        this.flickrAPI();
    },

    buildPhotoURL: function(photo)
    {

        let thePhoto = 'https://live.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret;
        return thePhoto;
    },
    buildFlickrObject: function()
    {

        let photos = this.flickrData.photoset.photo;

        var myFlickrObject = [];
        for ( image in photos)
        {
            console.log();
            var obj = {
                url: this.buildPhotoURL(photos[image]),
                title: photos[image].title,
                description: photos[image].description["_content"],
                tags: photos[image].tags
            };
            myFlickrObject.push(obj);
        }
        localStorage.setItem('flickrData',  JSON.stringify(myFlickrObject));
        this.buildFlickPage();
    },
    buildFlickPage: function ()
    {
      console.log('build page');
        let flickStorage = JSON.parse(localStorage.getItem('flickrData'));
        console.log(flickStorage);

        let photos = flickStorage;
        let image;
        for ( image in photos)
        {
            this.addPhoto(photos[image]);
        }

        var lightbox = new SimpleLightbox('.photo a', { /* options */ });
    },
    addPhoto: function (photo)
    {
        var element = document.createElement("div");
        element.className = 'photo';
        var img = document.createElement('img');
        img.src = photo.url+'_e.jpg';
        img.title = photo.title;
        element.appendChild(img);
        document.getElementById('photos').appendChild(element);
        $(img).wrap("<a href='"+photo.url+'_b.jpg'+"'></a>'");

    },
    flickrAPI: function ()
    {
        console.log('flickrAPI');
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {   // XMLHttpRequest.DONE == 4
                if (xmlhttp.status == 200) {
                    let fotos = new Photos();
                    fotos.flickrData = JSON.parse(xmlhttp.responseText);
                    fotos.buildFlickrObject();
                }
                else if (xmlhttp.status == 400) {
                    alert('There was an error 400');
                }
                else {
                    alert('something else other than 200 was returned');
                }
            }
        };

        xmlhttp.open("GET", "https://www.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=2c45c27714bec652243d7e68e869506e&photoset_id=72157715632321882&user_id=80995589%40N00&extras=tags,description&format=json&nojsoncallback=1", true);
        xmlhttp.send();

    }
}