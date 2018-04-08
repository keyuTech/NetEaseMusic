{
  let view = {
    el: '.songListContainer',
    init(){
      this.$el = $(this.el)
    },
    template: `
    <ul class="songList">
    </ul>
    `,
    render(data){
      this.init()
      this.$el.html(this.template)
      let {songs} = data
      let liList = songs.map((song) => {
        let li = $('<li></li>').text(song.name)
        return li
      })
      this.$el.find('ul').empty()
      liList.map((li) => {
        this.$el.find('ul').append(li)
      })
    },
    removeActive(){
      this.$el.find('.active').removeClass('active')
    }
  }
  let model = {
    data: {
      songs: []
    }
  }
  let controller = {
    init(view, model){
      this.view = view
      this.model = model
      this.view.render(this.model.data)
      window.eventHub.on('upload', ()=>{
        this.view.removeActive()
      })
      window.eventHub.on('create', (data) => {
        this.model.data.songs.push(data)
        this.view.render(this.model.data)
      })
    }
  }
  controller.init(view, model)
}