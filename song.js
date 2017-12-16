$(function(){
  if(location.search.match(/&label=hotsong/)){
    let id = parseInt(location.search.match(/\bid=([^&]*)/)[1])
    $.get("./hotsongs.json").then(function(response){
        let songs = response
        let song = songs.filter((s) => {return s.id === id})[0]
        let {url, cover, title, author, lyric} = song
        initPlayer(url, cover)
        setDetails(title, author, lyric)
      }
    )
  }else{
    let id = parseInt(location.search.match(/\bid=([^&]*)/)[1])
    $.get("./songs.json").then(function(response){
        let songs = response
        let song = songs.filter((s) => {return s.id === id})[0]
        let {url, cover, title, author, lyric} = song
        initPlayer(url, cover)
        setDetails(title, author, lyric)
      }
    )
  }

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
    setInterval(()=>{
      let time = audio.currentTime
      setLyric(time)
    }, 500)
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

  function setLyric(time){
    let second = ~~(time % 60)
    second = second>=10 ? second+"" : "0"+second
    let min = ~~(time / 60)
    let now = "0"+min+":"+second
    let current = `${now}`
    let $lines = $(".lines>p")
    let $currentLine
    for(let i=0; i<$lines.length; i++){
      let currentLineTime = $lines.eq(i).attr("data-time")
      let nextLineTime = $lines.eq(i+1).attr("data-time")
      if($lines[i+1] !== undefined && currentLineTime < current && nextLineTime > current){
        $currentLine = $lines.eq(i)
        break
      }
    }
    if($currentLine){
      $currentLine.addClass('active').prev().removeClass('active')      
      let top = $currentLine.offset().top
      let linesTop = $('.lines').offset().top
      let delta = top - linesTop - $('.lyric').height()/3
      $('.lines').css('transform', `translateY(-${delta}px)`)
    }
  }
})