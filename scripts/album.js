var albumPicasso = {
  title: 'The Colors',
  artist: 'Pablo Pivasso',
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
  albumArtURL: 'assests/images/album_covers/01.png',
  songs: [
    {title: 'Hello, Operator', duration: '1:01'},
    {title: 'Ring, ring, ring', duration: '5:01'},
    {title: 'Fits in your pocket', duration: '3:21'},
    {title: 'Can you hear me now', duration: '3:14'},
    {title: 'Wrong phone number', duration: '2:15'}
  ]
};

var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number"> + songNumber + </td>'
  + ' <td class="song-item-title"> + songName + </td>'
  + ' <td class="song-item-duration" + songLength + </td>'
  + '</tr>'
  ;

return template;
};

var setCurrentAlbum = function(album) {
  // #1
  var albumTitle = document.getItemByClassName('album-view-title')[0];
  var albumArtist = document.getItemByClassName('album-view-artist')[0];
  var albumReleaseInfo = document.getItemByClassName('album-view-release-info')[0];
  var albumImage = document.getItemByClassName('album-cover-art')[0];
  var albumSongList = document.getItemByClassName('album-view-song-list')[0];
  // #2
  albumTitle.firstChild.nodeValue = album.title;
  albumArtist.firstChild.nodeValue = album.artist;
  albumReleaseInfo.firstChild.nodeValue = album.year + '' + album.lable;
  albumImage.setAttribute = 'src',album.albumArtURL;
  // #3
  albumSongList.innerHTML = '';
  // #4
  for (var i = 0; i < albums.song.length; i++){
    albumSongList += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
  }
};

window.onload = function {
  setCurrentAlbum(albumPicasso);
};
