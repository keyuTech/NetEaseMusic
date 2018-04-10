{
  let view ={
    el: '.page',
    template: `
    <audio src="{{url}}"></audio>
    `,
    render(data){
      $(this.el).append(this.template.replace('{{url}}', data.url))
      this.initPlay()
    },
    initPlay(){
      let audio = $(this.el).find('audio')[0]
      audio.autoplay = true
      audio.oncanplay = function(){
        $(this.el).find('.disc-container').addClass('playing')
      }
    },
    play(){
      let audio = $(this.el).find('audio')[0]
      audio.play()
      $('.pause').removeClass('pausing')
      $('.disc-container').addClass('playing')
    },
    pause(){
      let audio = $(this.el).find('audio')[0]
      audio.pause()
      $('.pause').addClass('pausing')
      $('.disc-container').removeClass('playing')
    }
  }
  let model = {
    data:{
      id: '',
      name: '',
      singer: '',
      url: ''
    },
    setId(id){
      this.data.id = id
    },
    get(){
      let query = new AV.Query('Song')
      return query.get(this.data.id).then((song) => {
        Object.assign(this.data, song.attributes)
        return song
      })
    }
  }
  let controller = {
    init(view , model){
      this.view = view
      this.model = model
      let id = this.getSongId()
      this.model.setId(id)
      this.model.get().then(() => {
        this.view.render(this.model.data)
      })
      this.bindEvents()
    },
    bindEvents(){
      $(this.view.el).on('click', '.disc', () => {
        let audio = $(this.view.el).find('audio')[0]
        if(audio.paused) {
          this.view.play()
        }else{
          this.view.pause()
        }
      })
    },
    getSongId(){
      let searchQuery = window.location.search
      if(searchQuery.indexOf('?') === 0){
        searchQuery = searchQuery.substring(1)
      }
      //过滤空字符串
      let array = searchQuery.split('&').filter((v => v))
      let id = ''
      for(let i = 0; i < array.length; i++){
        let keyValue = array[i].split('=')
        let key = keyValue[0]
        let value = keyValue[1]
        if(key = 'id'){
          id = value
          break
        }
      }
      return id
    }
  }

  controller.init(view, model)
}