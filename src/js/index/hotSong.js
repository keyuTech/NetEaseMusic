{
  let view = {
    el: '#hot',
    template: `
    <li class="hot-song">
      <a href="./song.html?id={{song.id}}">
        <p class="rank-number" data-rankNum="{{rankNum}}">{{rankStr}}</p>
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
    show() {
      this.$el.removeClass('hide')
    },
    hide() {
      this.$el.addClass('hide')
    },
    render(data) {
      let { songs } = data
      let rankNum = 0
      songs.map((song) => {
        let rankStr
        rankNum += 1
        if (rankNum < 10) {
          rankStr = '0' + rankNum
        } else {
          rankStr = rankNum + ''
        }
        let $li = $(this.template
          .replace('{{song.name}}', song.name)
          .replace('{{song.singer}}', song.singer)
          .replace('{{song.id}}', song.id)
          .replace('{{song.name}}', song.name)
          .replace('{{rankStr}}', rankStr)
          .replace('{{rankNum}}', rankNum)
        )
        this.$el.find('.hot-songs > ul').append($li)
      })
    },
    top() {
      console.log(1)
      let $ps = this.$el.find('p.rank-number')
      for (let i = 0; i < $ps.length; i++) {
        if($ps[i].getAttribute('data-ranknum') < 4){
          $($ps[i]).addClass('rank-top')
        }
      }
    },
    loaded() {
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
        this.view.top()
      })
      this.bindEventHub()
    },
    bindEventHub() {
      window.eventHub.on('selectTab', (tabName) => {
        if (tabName === 'hotSong') {
          this.view.show()
        } else {
          this.view.hide()
        }
      })
    }
  }
  controller.init(view, model)
}