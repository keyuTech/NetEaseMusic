{
  let view = {
    el: '.admin-loading',
    show() {
      $(this.el).addClass('active')
    },
    hide() {
      $(this.el).removeClass('active')
    }
  }
  let controller = {
    init(view) {
      this.view = view
      this.bindEvents()
    },
    bindEvents() {
      window.eventHub.on('beforeUpload', () => {
        this.view.show()
      })
      window.eventHub.on('trigger', () => {
        this.view.hide()
      })
    }
  }
  controller.init(view)
}