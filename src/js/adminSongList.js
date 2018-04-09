{
  let view = {
    el: '.songListContainer',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <ul class="songList">
    </ul>
    `,
    render(data) {
      this.init()
      this.$el.html(this.template)
      let { songs } = data
      let liList = songs.map((song) => {
        let li = $('<li></li>').text(song.name).attr('data-id', song.id)
        return li
      })
      this.$el.find('ul').empty()
      liList.map((li) => {
        this.$el.find('ul').append(li)
      })
    },
    activeItem(li) {
      let $li = $(li)
      $li.addClass('active').siblings('.active').removeClass('active')
    },
    removeActive() {
      this.$el.find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs: []
    },
    find() {
      let query = new AV.Query('Song')
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return {
            id: song.id,
            name: song.attributes.name,
            singer: song.attributes.singer,
            url: song.attributes.url
          }
        })
        return songs
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      this.getAllSongs()
      this.bindEvents()
      this.bindEventHub()
    },
    getAllSongs() {
      return this.model.find().then(() => {
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      this.view.$el.on('click', 'li', (e) => {
        this.view.activeItem(e.currentTarget)
        let songId = e.currentTarget.getAttribute('data-id')
        let data = []
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songId) {
            data = songs[i]
            break
          }
        }
        console.log(data)
        let copy = JSON.stringify(data)
        let object = JSON.parse(copy)
        window.eventHub.trigger('select', object)
      })
    },
    bindEventHub() {
      window.eventHub.on('upload', () => {
        this.view.removeActive()
      })
      window.eventHub.on('create', (data) => {
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', () => {
        this.view.removeActive()
      })
    }
  }
  controller.init(view, model)
}