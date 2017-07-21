
var createSongRow = function(songNumber, songName, songLength) {
  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;



  var $row = $(template);

    var clickHandler = function() {
      var songNumber = $(this).attr('.data-song-number');

      	if (currentlyPlayingSongNumber !== null) {
      		// Revert to song number for currently playing song because user started playing new song.
      		var currentlyPlayingCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      		currentlyPlayingCell.html(currentlyPlayingSongNumber);
      	}

        if (currentlyPlayingSongNumber !== songNumber) {
      		// Switch from Play -> Pause button to indicate new song is playing.
      		$(this).html(pauseButtonTemplate);
      		currentlyPlayingSongNumber = songNumber;
          currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

        } else if (currentlyPlayingSongNumber === songNumber) {

          // Switch from Pause -> Play button to pause currently playing song.
      		$(this).html(playButtonTemplate);
      		currentlyPlayingSongNumber = null;
          currentSongFromAlbum = null;
      	}
  };


var onHover = function(event) {
  // Placeholder for function logic
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = songNumberCell.attr('data-song-number');
    //console.log('onHover', currentlyPlayingSong, songNumber)

    if(songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);

    }
};

var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = songNumberCell.attr('data-song-number');
      //console.log('offHover', currentlyPlayingSong, songNumber)

      if(songNumber !== currentlyPlayingSongNumber) {
        songNumberCell.html(songNumber);
    }
};


  // #1
  $row.find('.song-item-number').click(clickHandler);
  // #2
  $row.hover(onHover, offHover);
  // #3
  return $row;
};


// #1

var $albumTitle = $('.album-view-title');
var $albumArtist = $('.album-view-artist');
var $albumReleaseInfo = $('.album-view-release-info');
var $albumImage = $('.album-cover-art');
var $albumSongList = $('.album-view-song-list');



var findParentByClassName = function(element) {
  if(element === true)
    console.log()
}

var setCurrentAlbum = function(album) {
  currentAlbum = album;


  $albumTitle.text(album.title);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + '' + album.label);
  $albumImage.attr('src', album.albumArtURL);


  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++){

    var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    $albumSongList.append($newRow);
  }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
// #1

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;


//window.onload = function () {
$(document).ready(function() {
  setCurrentAlbum(albumPicasso);


});
