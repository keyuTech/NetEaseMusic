{

  let view = {
    el: '#recommend',
    init(){
      this.$el = $(this.el)
    },
    show(){
      this.$el.removeClass('hide')
    },
    hide(){
      this.$el.addClass('hide')
    }
  }
  let model = {}
  let controller = {
    init(view, model){
      this.view = view 
      this.view.init()
      this.model = model
      this.bindEventHub()
      this.loadModule1()
      this.loadModule2()
    },
    bindEventHub(){
      window.eventHub.on('selectTab', (tabName)=>{
        if(tabName === 'recommendSong'){
          this.view.show()
        }else{
          this.view.hide()
        }
      })
    },
    loadModule1(){
      let script1 = document.createElement('script')
      script1.src = './js/index/recommendSong-1.js' 
      script1.onload = function(){
        console.log('模块一加载完毕')
      }
      document.body.appendChild(script1)

    },
    loadModule2(){
      let script2 = document.createElement('script')
      script2.src = './js/index/recommendSong-2.js' 
      script2.onload = function(){
        console.log('模块2加载完毕')
      }
      document.body.appendChild(script2)
    }

  }
  controller.init(view, model)
}