$(function(){
  let id = parseInt(location.search.match(/\bid=([^&]*)/)[1])
  $.get("./songs.json").then(function(response){
      let songs = response
      let song = songs.filter((s) => {return s.id === id})[0]
      let {url, cover, title, author, lyric} = song
      initPlayer(url, cover)
      setDetails(title, author, lyric)
    }
  )

  function initPlayer(url, cover){
    let audio = new Audio
    audio.autoplay = true
    audio.src = url
    audio.oncanplay = function(){
      $('.disc-container').addClass('playing')
    }
    $('.disc').on('click', function(){
      if(audio.paused) {
        audio.play()
        $('.pause').removeClass('pausing')
        $('.disc-container').addClass('playing')
      }else{
        audio.pause()
        $('.pause').addClass('pausing')
        $('.disc-container').removeClass('playing')
      }
    })
    $('.bg').css("background-image", "url("+"'"+cover+"'"+")")
    $('.cover').attr("src", cover)
  }

  function setDetails(title, author, lyric){
    let lyricArr = lyric.split("\n")
    let reg = /^\[(.+)\](.*)$/
    lyricArr = lyricArr.map(function(str, index){
      if(str){
        let lyricStr = str.match(reg)
        return {time: lyricStr[1], contents: lyricStr[2]}
      }
    })
    let $lyric = $(".lyric")
    lyricArr.map(function(str){
      if(str){
        let $p = $("<p></p>")
        $p.attr("data-time", str.time).text(str.contents)
        $p.appendTo($lyric.children('.lines'))
      }
    })
    let $title = $(".stitle")
    $title.text(title)
    let $singer = $(".singer")
    $singer.text(author)
  }
})