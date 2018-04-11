{
  let view = {
    el: '#app',
    template: `
    <audio src="{{url}}"></audio>
    `,
    render(data) {
      $(this.el).find('.bg').css('background-image', `url("${data.cover}")`)
      $(this.el).find('.cover').attr("src", data.cover)
      $(this.el).find('.stitle').text(data.name)
      $(this.el).find('.singer').text(data.singer)
      $(this.el).append(this.template.replace('{{url}}', data.url))
      this.initPlay()
      let audio = $(this.el).find('audio')[0]
      audio.ontimeupdate = () => {
        this.showLyric(audio.currentTime)
      }
      let { lyric } = data
      let array = lyric.split('\\n')
      array.map((string) => {
        let p = document.createElement('p')
        let regex = /^\[(.+)\](.*)$/
        let matches = string.match(regex)
        p.textContent = string
        if (matches) {
          p.textContent = matches[2]
          let time = matches[1]
          let parts = time.split(':')
          let minutes = parts[0]
          let seconds = parts[1]
          let newTime = parseInt(minutes, 10) * 60 + parseFloat(seconds, 10)
          p.setAttribute('data-time', newTime)
        } else {
          p.textContent = string
        }
        $(this.el).find('.lines').append(p)
      })
      audio.on('ended', () => {
        $('.pause').addClass('pausing')
        $('.disc-container').removeClass('playing')
        $('.light').removeClass('playing')
      })
    },
    showLyric(time) {
      let allP = $(this.el).find('.lines>p')
      let p
      for (let i = 0; i < allP.length; i++) {
        if (i === allP.length - 1) {
          p = allP[i]
          break
        } else {
          let currentTime = allP.eq(i).attr('data-time')
          let nextTime = allP.eq(i + 1).attr('data-time')
          if (currentTime <= time && time < nextTime) {
            p = allP[i]
            break
          }
        }
      }
      if(p){
        $(p).addClass('active').prev().removeClass('active')      
        let top = $(p).offset().top
        let linesTop = $('.lines').offset().top
        let delta = top - linesTop - $('.lyric').height()/3
        $('.lines').css('transform', `translateY(-${delta}px)`)
      }
    },
    initPlay() {
      let audio = $(this.el).find('audio')[0]
      audio.autoplay = true
      audio.oncanplay = function () {
        $('.disc-container').addClass('playing')
        $('.light').addClass('playing')
      }
    },
    play() {
      let audio = $(this.el).find('audio')[0]
      audio.play()
      $('.pause').removeClass('pausing')
      $('.disc-container').addClass('playing')
      $('.light').addClass('playing')
    },
    pause() {
      let audio = $(this.el).find('audio')[0]
      audio.pause()
      $('.pause').addClass('pausing')
      $('.disc-container').removeClass('playing')
      $('.light').removeClass('playing')
    }
  }
  let model = {
    data: {
      id: '',
      name: '',
      singer: '',
      url: '',
      lyric: ''
    },
    setId(id) {
      this.data.id = id
    },
    get() {
      let query = new AV.Query('Song')
      return query.get(this.data.id).then((song) => {
        Object.assign(this.data, song.attributes)
        return song
      })
    }
  }
  let controller = {
    init(view, model) {
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.setId(id)
      this.model.get().then(() => {
        this.view.render(this.model.data)
      })
      this.bindEvents()
    },
    bindEvents() {
      $(this.view.el).on('click', '.disc', () => {
        let audio = $(this.view.el).find('audio')[0]
        if (audio.paused) {
          this.view.play()
        } else {
          this.view.pause()
        }
      })
    },
    getSongId() {
      let searchQuery = window.location.search
      if (searchQuery.indexOf('?') === 0) {
        searchQuery = searchQuery.substring(1)
      }
      //过滤空字符串
      let array = searchQuery.split('&').filter((v => v))
      let id = ''
      for (let i = 0; i < array.length; i++) {
        let keyValue = array[i].split('=')
        let key = keyValue[0]
        let value = keyValue[1]
        if (key = 'id') {
          id = value
          break
        }
      }
      return id
    }
  }

  controller.init(view, model)
}