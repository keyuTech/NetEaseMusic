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

    }
  })


})

