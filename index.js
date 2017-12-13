$(function(){
  $.get('./songs.json', function(response){
    console.log(response)
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
})

