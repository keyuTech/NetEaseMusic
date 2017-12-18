$(function(){
  $.get('./songs.json', function(response){
    let items = response
    items.forEach((i) => {
      let $li = $(`
      <li>
        <a href="./song.html?id=${i.id}">
        <p class="song-title">${i.title}</p>
          <p class="song-details">
            <svg class="icon icon-sq hide" aria-hidden="true">
              <use xlink:href="#icon-sq"></use>
            </svg>
            ${i.author}-${i.title}
          </p>
          <svg class="icon icon-play" aria-hidden="true">
            <use xlink:href="#icon-play"></use>
          </svg>
        </a>
      </li>
        `)
    $(".lastestMusic").append($li)
    })
    $(".loading").addClass('hide')
  })

  $(".tab-nav").on('click', '.tab-item>li', function(e){
    let $li = $(e.currentTarget).addClass('clicked')
    $li.siblings().removeClass('clicked')
    let index = $li.index()
    $("#tabs>li").eq(index).addClass('clicked').siblings().removeClass('clicked')
    let $tabs = $("#tabs").children().eq(index)
    $tabs.removeClass('hide').addClass('show').siblings().removeClass('show').addClass('hide')
    $li.trigger('tabChange', index)
  })

  $('.tab-nav').on('tabChange', function(e, index){
    let $li = $('#tabs>li').eq(index)
    if(index === 1){
      if($li.attr('downloaded') === 'yes'){
        return
      }
      $.get('./hotsongs.json').then((response) => {
        response.forEach((i) => {
          let $id
          if(i.id < 10){
            $id = '0' + i.id
          }else{
            $id = i.id
          }
          let $template = $(`
          <li class="hot-song">
            <a href="./song.html?id=${i.id}&label=hotsong">
              <p class="rank-number">${$id}</p>
              <div class="song-content">
                <p class="song-title">${i.title}</p>
                <p class="song-details">
                  <svg class="icon icon-sq" aria-hidden="true">
                    <use xlink:href="#icon-sq"></use>
                  </svg>
                  ${i.author}-${i.title}
                </p>
                <svg class="icon icon-play" aria-hidden="true">
                  <use xlink:href="#icon-play"></use>
                </svg>
              </div>
            </a>
          </li>`)
        $(".hot-songs>ul").append($template)
        })
        $('#tabs>li').eq(index).attr('downloaded', 'yes')
        $(".loading").addClass('hide')
        $('.hot-song').slice(0, 3).addClass('rank-top')
      })
    }else if(index === 2){
      if($li.attr('downloaded') === 'yes'){
        return
      }
      $.get('./search.json', function(response){
        let items = response
        items.forEach((i) => {
          let $searchTep = $(`
          <div class="search-item"><a href="">${i.title}</a></div>
          `)
        $(".search-items").append($searchTep)
        })
        $('#tabs>li').eq(index).attr('downloaded', 'yes')
        $('.loading').addClass('hide')
      })
    }
  })

  $('.search-input input').on('input', function(e){
    let $input = $(e.currentTarget)
    let $value = $input.val().trim()
    search($value).then((result)=>{
      
    })
  })


  function search(keyword){
    return new Promise((resolve, reject)=>{
      var database = [
        {
          "id": 1,
          "title": "光るなら"
        },
        {
          "id": 2,
          "title": "前前前世 (movie ver.)"
        },
        {
          "id": 3,
          "title": "玫瑰与小鹿"
        },
        {
          "id": 4,
          "title": "那些花儿"
        },
        {
          "id": 5,
          "title": "对不起我爱你"
        },
        {
          "id": 6,
          "title": "外面的世界"
        }
      ]
      let result = database.filter(function(item){
        return item.title.indexOf(keyword) >= 0
      })

      setTimeout(function(){
        resolve(result)
      }, (Math.random()*1000+1500))
    })
  }
  window.search = search
})