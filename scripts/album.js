
var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtURL: 'assets/images/album_covers/01.png',
  songs: [
    {title: 'Blue', duration: '4:26' },
    {title: 'Green', duration: '3:14' },
    {title: 'Red', duration: '5:01' },
    {title: 'Pink', duration: '3:21' },
    {title: 'Magenta', duration: '2:15' }
  ]
};

var albumMarconi = {
  title: 'The Telephone',
  artist: 'Guglielmo Marconi',
  label: 'EM',
  year: '1909',
  albumArtURL: 'assets/images/album_covers/20.png',
  songs: [
    {title: 'Hello, Operator', duration: '1:01'},
    {title: 'Ring, ring, ring', duration: '5:01'},
    {title: 'Fits in your pocket', duration: '3:21'},
    {title: 'Can you hear me now', duration: '3:14'},
    {title: 'Wrong phone number', duration: '2:15'}
  ]
};

var albumCivilWar = {
  title: 'Lincolns Inaugural',
  artist: 'The United States Marine Corps Band',
  label: 'D.C.',
  year: '1865',
  albumArtURL: 'assets/images/album_covers/05.png',
  songs: [
    {title: 'The Presidential waltz', duration: '3:25'},
    {title: 'Secession', duration: '3:45'},
    {title: 'Union Dissolved', duration: '1:30'},
    {title: 'The first short (the Battle of Fort Sumter)', duration: '4:26'},
    {title: 'Interlude: Mobilization', duration: '1:30'},
    {title: 'The Peninsula Campaign', duration: '7:38'},
    {title: 'The Western Theater', duration: '8:32'}
  ]
};



var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  return template;
};

// #1
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];


var findParentByClassName = function(element, targetClass) {
  if (element) {
    var currentParent = element.parentElement;
    if(currentParent) {
      while (currentParent.className !== targetClass && currentParent.className !== null) {
        currentParent = currentParent.parentElement;
      }
      if(currentParent) {
        return currentParent
      } else {
        console.log("No parent found with that class name")
      }      
    } else {
      console.log("No parent found")
    }
  }
};

var getSongItem = function(element) {
  switch (element.className) {
    case 'album-song-button':
    case 'ion-play':
    case 'ion-pause':
      return findParentByClassName(element, 'song-item-number');
    case 'album-view-song-item':
      return element.querySelector('.song-item-number');
    case 'song-item-title':
    case 'song-item-duration':
      return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    case 'song-item-number':
      return element;
    default:
      return;
  }
};

var clickHandler = function(targetElement) {

  var songItem = getSongItem(targetElement);

  if(currentlyPlayingSong === null) {
      songItem.innerHTML = pauseButtonTemplate;
      currentlyPlayingSong = songItem.getAttribute('data-song-number');

  } else if(currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
      songItem.innerHTML = playButtonTemplate;
      currentlyPlayingSong = null;

  } else if(currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
      var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
      currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
      songItem.innerHTML = pauseButtonTemplate;
      currentlyPlayingSong = songItem.getAttribute('data-song-number');

  }
};

var setCurrentAlbum = function(album) {
  // #2
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + '' + album.label;
  albumImage.setAttribute ('src',album.albumArtURL);
  // #3
  albumSongList.innerHTML = '';
  // #4
  for (var i = 0; i < album.songs.length; i++){
    albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

  // Store state of playing songs
var currentlyPlayingSong = null;

window.onload = function () {
  setCurrentAlbum(albumPicasso);

  songListContainer.addEventListener('mouseover', function(event) {

  // #1
    //console.log('mouseover')
    if(event.target.parentElement.className === 'album-view-song-item') {
      //event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;
      var songItem = getSongItem(event.target);

      if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
          songItem.innerHTML = playButtonTemplate;
      }
    }
  });

  for (var i = 0; i < songRows.length; i++) {
    songRows[i].addEventListener('mouseleave', function(event) {
        //console.log('mouseleave')
    // #1
    var songItem = getSongItem(event.target);
    var songItemNumber = songItem.getAttribute('data-song-number');

    // #2
    if (songItemNumber !== currentlyPlayingSong) {
        songItem.innerHTML = songItemNumber;
      }
    });

    songRows[i].addEventListener('click', function(event) {
      clickHandler(event.target);
    });
  }


  // var albums = [albumPicasso, albumMarconi, albumCivilWar];
  // var index = 1;
  //   albumImage.addEventListener("click", function(event) {
  //     setCurrentAlbum(albums[index]);
  //     index++;
  //     if (index == albums.length) {
  //       index = 0;
  //   }
  // });
};
