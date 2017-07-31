var setSong = function(songNumber) {
  if(currentSoundFile){
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
// #1
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
// #2
    formats:['mp3'],
    preload: true
  });

  setVolume(currentVolume);
};

var seek = function(time) {
  if(currentSoundFile) {
    currentSoundFile.setTime(time);
  }
}

var setVolume = function(volume) {
  if(currentSoundFile) {
      currentSoundFile.setVolume(volume);
  }
};

var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');

}

var createSongRow = function(songNumber, songName, songLength) {

  var template =
    '<tr class="album-view-song-item">'
  + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + ' <td class="song-item-title">' + songName + '</td>'
  + ' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

    var clickHandler = function() {
      var songNumber = parseInt($(this).attr('data-song-number'));


      	 if (currentlyPlayingSongNumber !== null) {
      		// Revert to song number for currently playing song because user started playing new song.
      		var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

          currentlyPlayingCell.html(currentlyPlayingSongNumber);

        }

        if (currentlyPlayingSongNumber !== songNumber) {
      		// Switch from Play -> Pause button to indicate new song is playing.
          $(this).html(pauseButtonTemplate);
          setSong(songNumber);
          currentSoundFile.play();

          var $volumeFill = $('.volume .fill');
          var $volumeThumb = $('.volume .thumb');
          $volumeFill.width(currentVolume + '%');
          $volumeThumb.css({left: currentVolume + '%'});

          updatePlayerBarSong();
          //console.log('currentlyPlaySongNumber', currentSoundFile.play)
        } else {

          // Switch from Pause -> Play button to pause currently playing song.

          if(currentSoundFile.isPaused()) {
            $(this).html(pauseButtonTemplate);
            setSong(songNumber)
            $('.main-controls .play-pause').html(playerBarPauseButton);
              currentSoundFile.play();

              var updateSeekBarWhileSongPlays = function() {
                if(currentSoundFile){
                  currentSoundFile.bind('timeupdate', function(event){
                    var seekBarFillRatio = this.getTime() / this.getDuration();
                    var $seekBar = $('.seek-control .seek-bar');

                    updateSeekPercentage($seekBar, seekBarFillRatio);

                  });
                }
              };

          } else {
            $(this).html(playButtonTemplate);
            currentlyPlayingSongNumber = null;
            $('.main-controls .play-pause').html(playerBarPlayButton);
              currentSoundFile.pause();
              //console.log('currentSoundFile',)
          }
      }
  };


var onHover = function(event) {
  // Placeholder for function logic
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));
//console.log('onHover', songNumber, currentlyPlayingSongNumber)

    if(songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);

    }
};

var offHover = function(event) {
      var songNumberCell = $(this).find('.song-item-number');
      var songNumber = parseInt(songNumberCell.attr('data-song-number'));
      //console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

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



var updateSeekBarWhileSongPlays = function() {
  if(currentSoundFile){
    currentSoundFile.bind('timeupdate', function(event){
      var seekBarFillRatio = this.getTime() / this.getDuration();
      var $seekBar = $('.seek-control .seek-bar');

      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(currentSoundFile.getTime());
      });
    }
  };

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  //console.log('updateSeekPercentage', updateSeekPercentage);

  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
  //console.log('percentageString', percentageString);
};


var setUpSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;

    if($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    }else{
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
    //console.log('updateSeekPercentage', updateSeekPercentage, seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event) {

    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {

      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if($seekBar.parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      }else{
        setVolume(seekBarFillRatio);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

  $(document).bind('mouseup.thumb', function() {
    $(document).unbind('mousemove.thumb');
    $(document).unbind('mouseup.thumb');
    console.log()
    });
  });
};



var trackIndex = function(album, song){
  return album.songs.indexOf(song);
};


var nextSong = function() {

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;

  if(currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
//Do I need to change currentlyPlayingSongNumber

  currentlyPlayingSongNumber(currentSongIndex + 1);

  //setSong(currentSongIndex + 1);
  currentSoundFile.play();

  updateSeekBarWhileSongPlays(); {
    if(currentSoundFile){
      currentSoundFile.bind('timeupdate', function(event){
        var seekBarFillRatio = this.getTime() / this.getDuration();
        var $seekBar = $('.seek-control .seek-bar');

        updateSeekPercentage($seekBar, seekBarFillRatio);
        //setCurrentTimeInPlayerBar()

      });
    }
  };


  //setSong = currentAlbum.songs[currentSongIndex];
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

$nextSongNumberCell.html(pauseButtonTemplate);
$lastSongNumberCell.html(lastSongNumber);

};



var previousSong = function() {

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;

  if(currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length -1;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
//Do I need to change currentlyPlayingSongNumber

  currentlyPlayingSongNumber(currentSongIndex + 1);

//This currentSoundFile.play() wasn't inserted previously, so I inserted while inserting updateSeekBarWhileSongPlays()
  currentsoundFile.play();

  var updateSeekBarWhileSongPlays = function() {
    if(currentSoundFile){
      currentSoundFile.bind('timeupdate', function(event){
        var seekBarFillRatio = this.getTime() / this.getDuration();
        var $seekBar = $('.seek-control .seek-bar');

        updateSeekPercentage($seekBar, seekBarFillRatio);

      });
    }
  };

//  setSong = currentAlbum.songs[currentSongIndex];
currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  updatePlayerBarSong();

  $('.main-controls .play-pause').html(playerBarPauseButton);

  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');
  //var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber'"]');
  //var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber'"]');

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
  setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
};



var updatePlayerBarSong = function() {

    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
// Store state of playing songs
// #1

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $mainPlayButton = $('.main-controls .play-pause');

$(document).ready(function() {
  setCurrentAlbum(albumPicasso);
  setUpSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  $mainPlayButton.click($togglePlayFromPlayerBar);

});
//ASSIGNMENT 20
var $togglePlayFromPlayerBar = function () {
  var songNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  if(currentSoundFile.isPaused()) {
    songNumberCell.html(pauseButtonTemplate);
    $mainPlayButton.html(playerBarPauseButton);
    setSong(currentlyPlayingSongNumber);
    currentSoundFile.play();
  }else{
    songNumberCell.html(playButtonTemplate);
    $mainPlayButton.html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

//Assignment 21
// #1
var setCurrentTimeInPlayerBar = function(currentTime) {
   $('.current-time').text(filterTimeCode(currentTime));//4
};
// #2
 var setTotalTimeInPlayerBar = function(totalTime){
   $('.total-time').text(filterTimeCode(totalTime));//5
 };
// #3
 var filterTimeCode = function (timeInSeconds){
  var wholeSeconds = Math.floor(parseFloat(timeInSeconds));
  var wholeMinutes = Math.floor(wholeSeconds / 60);
  var showSeconds = wholeSeconds % 60;
  var endTime = wholeMinutes  + ':';

  if(showSeconds < 10) {
    endTime += '0' + showSeconds;
  }else{
    endTime += showSeconds;
  }
  return endTime;
};
