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
    console.log(e, index)
  })
})

