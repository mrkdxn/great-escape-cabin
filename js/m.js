console.log(document.location);
if (document.location.protocol == 'http:')
{
    document.location.href = 'https://'+document.location.pathname;
}

window.addEventListener('load', function () {
    let fotos = new Photos();
    fotos.init();
});

const Photos = function () {
};

Photos.prototype = {

    flickrData : '',
    timestamp : '',
    init: function()
    {
        if(localStorage.getItem('flickrData'))
        {
            this.buildFlickPage();
        }
        else
        {
            this.flickrAPI();
        }
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
            var obj = {
                url: this.buildPhotoURL(photos[image]),
                title: photos[image].title,
                description: photos[image].description["_content"],
                tags: photos[image].tags
            };
            myFlickrObject.push(obj);
        }
        localStorage.setItem('flickrData',  JSON.stringify(myFlickrObject));
        this.setTimestamp();
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
        var lightbox = new SimpleLightbox('.photo a', {  });
        lazyLoadInstance.update();
    },
    setTimestamp: function ()
    {
        var d = new Date();
        var n = d.getTime();
        localStorage.setItem('flickrTime', n);
        this.timestamp = n;
    },
    addPhoto: function (photo)
    {
        // div
        var element = document.createElement("div");
        element.className = 'photo';
        // img
        var img = document.createElement('img');
        //img.src = photo.url+'_m.jpg';
        img.title = photo.title;
        img.className = 'lazy';
        img.setAttribute('data-src', photo.url+'_m.jpg');
        element.appendChild(img);
        document.getElementById('photos').appendChild(element);
        // ahref
        var a = document.createElement('a');
        a.href = photo.url+'_b.jpg';
        this.wrap(img, a);
    },
    wrap: function (el, wrapper) {
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
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