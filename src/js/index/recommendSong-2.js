{
  let view = {
    el: 'section#lastestMusic',
    template: `
    <li>
      <a href="./song.html?id={{song.id}}">
        <div class="song-content">
          <p class="song-title">{{song.name}}</p>
          <p class="song-details">
            <svg class="icon icon-sq" aria-hidden="true">
              <use xlink:href="#icon-sq"></use>
            </svg>
            {{song.singer}} - {{song.name}}
          </p>
          <svg class="icon icon-play" aria-hidden="true">
            <use xlink:href="#icon-play"></use>
          </svg>
        </div>
      </a>
    </li>
    `,
    init() {
      this.$el = $(this.el)
    },
    render(data) {
      let { songs } = data
      songs.map((song) => {
        let $li = $(this.template
          .replace('{{song.name}}', song.name)
          .replace('{{song.singer}}', song.singer)
          .replace('{{song.id}}', song.id)
          .replace('{{song.name}}', song.name)
        )
        this.$el.find('ul.lastestMusic').append($li)
      })
    },
    loaded(){
      this.$el.find(".loading").addClass('hide')
    }
  }
  let model = {
    data: {
      songs: []
    },
    find() {
      var query = new AV.Query('Song');
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return { id: song.id, ...song.attributes }
        })
        return songs
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.model.find().then(() => {
        this.view.loaded()
        this.view.render(this.model.data)
      })

    }
  }
  controller.init(view, model)
}