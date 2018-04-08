{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <form>
      <h1>新建歌曲</h1>
      <div class="row">
        <label>
          歌曲名
        </label>
        <input name="name" type="text" value="__name__">
      </div>
      <div class="row">
        <label>
          歌手
        </label>
        <input name="singer" type="text" value="__singer__">
      </div>
      <div class="row">
        <label>
          链接
        </label>
        <input name="url" type="text" value="__url__">
      </div>
      <div class="row">
        <label>
          封面链接
        </label>
        <input name="cover" type="text">
      </div>
      <div class="row">
        <input type="submit" value="保存">
      </div>
    </form>
    <div class="coverArea">
      <p>封面</p>
      <div class="cover"></div>
    </div>
    `,
    render(data = {}) {
      let placeholders = ['name', 'singer', 'url', 'id']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '')
      })
      $(this.el).html(html)
    }
  }

  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      id: ''
    },
    create(data) {
      var Song = AV.Object.extend('Song')
      var song = new Song()
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      return song.save().then((newSong) => {
        let { id, attributes } = newSong
        Object.assign(this.data, {
          id: id,
          name: attributes.name,
          singer: attributes.singer,
          url: attributes.url
        })
      }, (error) => {
        console.error(error)
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.view.init()
      this.model = model
      this.view.render(this.model.data)
      this.bindEvents()
      window.eventHub.on('upload', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        let need = 'name singer url'.split(' ')
        let data = {}
        need.map((string) => {
          data[string] = this.view.$el.find(`input[name="${string}"]`).val()
        })
        this.model.create(data).then(() => {
          this.view.render({})
          let string = JSON.stringify(this.model.data)
          let object = JSON.parse(string)
          window.eventHub.trigger('create', object)
        })
      })
    }
  }
  controller.init(view, model)
}