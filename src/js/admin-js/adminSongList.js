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
      let { songs, selectedId } = data
      let liList = songs.map((song) => {
        let li = $('<li></li>').text(song.name).attr('data-id', song.id)
        let svg = $(`<svg class="icon" aria-hidden="true">
                      <use xlink:href="#icon-music"></use>
                    </svg>`)
        li.prepend(svg)
        if (song.id === data.selectedId) {
          li.addClass('active')
        }
        return li
      })
      this.$el.find('ul').empty()
      liList.map((li) => {
        this.$el.find('ul').append(li)
      })
    },
    removeActive() {
      this.$el.find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs: [],
      selectedId: undefined
    },
    find() {
      let query = new AV.Query('Song')
      return query.find().then((songs) => {
        this.data.songs = songs.map((song) => {
          return {
            id: song.id,
            name: song.attributes.name,
            singer: song.attributes.singer,
            url: song.attributes.url,
            cover: song.attributes.cover,
            lyric: song.attributes.lyric
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
        let songId = e.currentTarget.getAttribute('data-id')
        this.model.data.selectedId = songId
        this.view.render(this.model.data)
        let data = []
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === songId) {
            data = songs[i]
            break
          }
        }
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
      window.eventHub.on('update', (song) => {
        let songs = this.model.data.songs
        for (let i = 0; i < songs.length; i++) {
          if (songs[i].id === song.id) {
            Object.assign(songs[i], song)
          }
        }
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}