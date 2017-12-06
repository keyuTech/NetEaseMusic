$(function(){
  $.get("./lyric.json").then(function(obj){
    let {lyric} = obj
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
  })

  let audio = new Audio
  audio.autoplay = true
  audio.src = "http://dl.stream.qqmusic.qq.com/C400001CFYXK4afx2j.m4a?vkey=56A52BF4F5355C7B487DC2D192F5784C2A8F7A986561FFAFE1DED174F29940197A1EA9E7E0A46203E171BB1994E6F0FCFEAB7F8E1B7CE002&guid=8994004800&uin=0&fromtag=66"
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
})