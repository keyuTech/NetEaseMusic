{
  let view = {
    el: '#search',
    template: `
    <div class="hot-search-item"><a href="./song.html?id={{song.id}}">{{song.name}}</a></div>
    `,
    init(){
      this.$el = $(this.el)
    },
    show(){
      console.log(1)
      this.$el.removeClass('hide')
    },
    hide(){
      this.$el.addClass('hide')
    },
    render(data) {
      let { songs } = data
      songs.map((song) => {
        let $div = $(this.template
          .replace('{{song.name}}', song.name)
          .replace('{{song.id}}', song.id)
        )
        this.$el.find('.hot-search-items').append($div)
      })
    },
    loaded(){
      this.$el.find(".loading > img").addClass('hide')
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
    init(view, model){
      this.view = view 
      this.view.init()
      this.model = model
      this.model.find().then(() => {
        this.view.loaded()
        this.view.render(this.model.data)
      })
      this.bindEventHub()
    },
    bindEventHub(){
      window.eventHub.on('selectTab', (tabName)=>{
        if(tabName === 'searchSong'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    }

  }
  controller.init(view, model)
}