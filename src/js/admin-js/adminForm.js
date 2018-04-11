{
  let view = {
    el: '.page > main',
    init() {
      this.$el = $(this.el)
    },
    template: `
    <form>
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
        <input name="cover" type="text" value="__cover__">
      </div>
      <div class="row">
        <input type="submit" value="保存">
      </div>
    </form>
    <div class="coverArea">
      <div class="cover">
        <span>点击预览封面</span>
        <img src="__cover-url__"/>
      </div>
    </div>
    `,
    render(data = {}) {
      let placeholders = ['name', 'singer', 'url', 'cover', 'id']
      let html = this.template
      placeholders.map((string) => {
        html = html.replace(`__${string}__`, data[string] || '').replace('__cover-url__', data.cover || '')
      })
      $(this.el).html(html)
      if (data.id) {
        $(this.el).find('form').prepend("<h1>编辑歌曲</h1>")
      } else {
        $(this.el).find('form').prepend("<h1>新建歌曲</h1>")
      }
      if (data.cover) {
        $(this.el).find('img').removeClass('hide')
        $(this.el).find('.cover > span').addClass('hide')
      } else {
        $(this.el).find('img').addClass('hide')
        $(this.el).find('.cover > span').removeClass('hide')
      }
    }
  }

  let model = {
    data: {
      name: '',
      singer: '',
      url: '',
      cover: '',
      id: ''
    },
    create(data) {
      var Song = AV.Object.extend('Song')
      var song = new Song()
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      song.set('cover', data.cover)
      return song.save().then((newSong) => {
        let { id, attributes } = newSong
        Object.assign(this.data, {
          id: id,
          name: attributes.name,
          singer: attributes.singer,
          url: attributes.url,
          cover: attributes.cover
        })
      }, (error) => {
        console.error(error)
      })
    },
    update(data) {
      var song = AV.Object.createWithoutData('Song', this.data.id)
      song.set('name', data.name)
      song.set('singer', data.singer)
      song.set('url', data.url)
      song.set('cover', data.cover)
      return song.save().then((response) => {
        Object.assign(this.data, data)
        return response
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
      window.eventHub.on('select', (data) => {
        this.model.data = data
        this.view.render(this.model.data)
      })
      window.eventHub.on('new', (data) => {
        if (this.model.data.id) {
          this.model.data = {
            id: '', name: '', singer: '', url: '', cover: ''
          }
        } else {
          Object.assign(this.model.data, data)
        }
        console.log(this.model.data)
        this.view.render(this.model.data)
      })
    },
    create() {
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
    },
    update() {
      let need = 'name singer url cover'.split(' ')
      let data = {}
      need.map((string) => {
        data[string] = this.view.$el.find(`input[name="${string}"]`).val()
      })
      this.model.update(data).then(() => {
        let copy = JSON.stringify(this.model.data)
        let object = JSON.parse(copy)
        window.eventHub.trigger('update', object)
      })
    },
    previewCover() {
      let coverUrl = this.view.$el.find('input[name="cover"]').val()
      this.model.data.cover = coverUrl
      this.view.render(this.model.data)
    },
    bindEvents() {
      this.view.$el.on('submit', 'form', (e) => {
        e.preventDefault()
        if (this.model.data.id) {
          this.update()
        } else {
          this.create()
        }
      })
      this.view.$el.on('click', '.cover', () => {
        this.previewCover()
      })
    }
  }
  controller.init(view, model)
}