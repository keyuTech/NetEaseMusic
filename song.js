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
        $p.appendTo($lyric)
      }
    })
  })
})