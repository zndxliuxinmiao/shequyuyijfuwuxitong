(function () {
  //初始化chat  START
  var chat = {
    messageToSend: '',
    messageResponses: [
      '感谢您的提问'
    ],
    messageToAsk: '',
    init: function () {
      this.cacheDOM();
      this.bindEvents();
      this.render();
    },
    cacheDOM: function () {
      this.$chatHistory = $('.chat-history');  // 聊天历史
      this.$button = $('button');  // 提交按钮
      this.$textarea = $('#message-to-send');  // 要发送的信息
      this.$chatHistoryList = this.$chatHistory.find('ul');  // 聊天历史列表
    },
    bindEvents: function () {
      this.$button.on('click', this.addMessage.bind(this));  // 绑定点击事件
      this.$textarea.on('keyup', this.addMessageEnter.bind(this));
    },
    render: function (Res_msg, imgurl, state) {
      this.scrollToBottom();  // 滑动到底部
      if (this.messageToSend.trim() !== '') {
        // 如果message不为空
        var template = Handlebars.compile($("#message-template").html());
        var context = {
          // messageOutput: this.messageToSend,
          messageOutput: this.messageToAsk,
          time: this.getCurrentTime()
        };

        // 加入一条提问记录
        this.$chatHistoryList.append(template(context));
        this.scrollToBottom();
        this.$textarea.val('');

        if (state == -1) {
          Res_msg = "感谢您的提问"
          imgurl = "./img/smile.gif"
        }

        // responses
        var templateResponse = Handlebars.compile($("#message-response-template").html());
        var contextResponse = {
          response: Res_msg,
          imgurl: imgurl,
          state: state,
          time: this.getCurrentTime()
        };

        setTimeout(function () {
          this.$chatHistoryList.append(templateResponse(contextResponse));
          this.scrollToBottom();
        }.bind(this), 1500);

      }

    },
    //发送
    addMessage: function () {
      let msg = this.$textarea.val()
      msg = msg.replace(/[\r\n]/g, "") //去掉回车换行

      var no = $('.chat-history ul li:last-child .message').text();  // 得到提问的描述
      var state = $('.chat-history ul li:last-child .message').attr('data-state');  // 得到后端返回的状态代码
      let q = no.includes('可以解决你的问题吗');

      if (state == 2 && msg.includes("不可以")) { //api 返回 
        var api = 'http://localhost:5001/api' //api2
      } else if (state == 3 && msg.includes("不满意")) {
        var api = 'http://localhost:5002/api' //api3
      } else if (msg.includes("可以")) {
        var end = true
      } else if (state == 2 && msg.includes("好的")) {
        var api = 'http://localhost:5001/api'
      } else {
        var api = 'http://localhost:5000/api' //默认api  
      }
      if (end) {
        this.messageToSend = msg //加了这句
        this.render(msg, false, -1);
      } else {

        let that = this
        $.ajax({
          url: api,
          method: "post",
          dataType: 'json',
          type: "post",
          data: { question: msg },
          headers: {
            "Access-Control-Allow-Origin": true,
          },
          success: function (res) {
            this.messageToAsk = res.question
            that.messageToSend = that.$textarea.val()
            that.render(res.answer, res.imgurl, res.state);
            //判断服务端返回 答案 跑
            if (res.state == 1 && res.answer.includes("请查看用户问答库中有没有您要问的问题aaaaa")) {
              $.ajax({
                url: 'http://localhost:5000/api',
                method: "post",
                dataType: 'json',
                type: "post",
                data: { question: '0' },
                headers: {
                  "Access-Control-Allow-Origin": true,
                },
                success: function (res) {
                  that.messageToSend = that.$textarea.val()
                  that.render(res.answer, res.imgurl, res.state);
                }

              });


            }

          }

        });
      }
    },
    addMessageEnter: function (event) {
      // enter was pressed
      if (event.keyCode === 13) {
        this.addMessage();
      }
    },
    scrollToBottom: function () {
      this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
    },
    getCurrentTime: function () {
      return new Date().toLocaleTimeString().
        replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
    },
    getRandomItem: function (arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

  };


  //初始化chat  END
  chat.init();

  var searchFilter = {
    options: { valueNames: ['name'] },
    init: function () {
      var userList = new List('people-list', this.options);
      var noItems = $('<li id="no-items-found">No items found</li>');

      userList.on('updated', function (list) {
        if (list.matchingItems.length === 0) {
          $(list.list).append(noItems);
        } else {
          noItems.detach();
        }
      });
    }
  };

  searchFilter.init();

})();