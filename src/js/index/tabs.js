{
  let view = {
    el: '.tab-nav',
    init(){
      this.$el = $(this.el)
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view
      this.view.init()
      this.model = model
      this.bindEvents()
    },
    bindEvents(){
      this.view.$el.on('click', '.tab-item > li', (e)=>{
        let $li = $(e.currentTarget)
        let tabName = $li.attr('tab-data-name')
        $li.addClass('clicked')
          .siblings().removeClass('clicked')
        window.eventHub.trigger('selectTab', tabName)
      }) 
    }
  }
  controller.init(view, model)
}