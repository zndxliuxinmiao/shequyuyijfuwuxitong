(function() {
    // 初始化chat START
    var chat = {
        messageToSend: '',
        init: function() {
            this.cacheDOM();
            this.bindEvents();
            this.render();
        },
        cacheDOM: function () {
            this.$chatHistory = $('.chat-history');  // 聊天历史
            this.$buttonStart = $('#start');  // 开始录音按钮
            this.$buttonPlay = $('#play');  // 播放录音安妞妞
            this.$buttonUpload = $('#upload');  // 提交按钮
            this.$chatHistoryList = this.$chatHistory.find('ul');  // 聊天历史列表
        },
        bindEvents: function() {
            this.$buttonUpload.on('click', this.uploadRec.bind(this));  // 绑定上传事件
            this.$buttonPlay.on('click', this.playRec.bind(this));  // 绑定播放事件
            this.$buttonStart.on('click', this.startRec.bind(this));  // 绑定录音时间
        },
        render: function(Res_que, Res_msg, imgurl, state){
            this.scrollToBottom();
            this.messageToSend = Res_que;
            if (this.messageToSend !== ''){
                var template = Handlebars.compile($("#message-template").html());
                var context = {
                    messageOutput: this.messageToSend,
                    time: this.getCurrentTime()
                };
                this.$chatHistoryList.append(template(context));
                this.scrollToBottom();

                // 结束提问
                if (state == -1){
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
        uploadRec: function (){
            //停止录音，得到了录音文件blob二进制对象，想干嘛就干嘛
            let that = this
            rec.stop(function(blob, duration){
                var form = new FormData();
                form.append("upfile",blob,"recorder.wav"); //和普通form表单并无二致，后端接收到upfile参数的文件，文件名为recorder.mp3
                //...其他表单参数
                $.ajax({
                    url : 'http://localhost:5000/api', //上传接口地址
                    type : "POST",
                    contentType : false, //让xhr自动处理Content-Type header，multipart/form-data需要生成随机的boundary
                    processData : false, //不要处理data，让xhr自动处理
                    data : form,
                    success : function(res){
                        that.render(res.question, res.answer, res.imgurl, res.state);
                    },
                    error : function(s){
                        console.error("上传失败",s);
                    }
                });
            },function(msg){
                alert("录音失败:" + msg);
            });
            
            
        },
        startRec: function (){
            rec = Recorder({type:"wav", sampleRate:16000, bitRate:16});//使用默认配置，mp3格式
            //打开麦克风授权获得相关资源
            rec.open(function(){
                //开始录音
                rec.start();
            },function(msg,isUserNotAllow){
                //用户拒绝了权限或浏览器不支持
                alert((isUserNotAllow?"用户拒绝了权限，":"")+"无法录音:"+msg);
            });
        },
        playRec: function (){
            //停止录音，得到了录音文件blob二进制对象，想干嘛就干嘛
            rec.stop(function(blob,duration){
                var audio=document.createElement("audio");
                audio.controls=true;
                document.body.appendChild(audio);
                //非常简单的就能拿到blob音频url
                audio.src=URL.createObjectURL(blob);
                audio.play();
            },function(msg){
                alert("录音失败:"+msg);
            });
        },
        scrollToBottom: function () {
            this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
        },
        getCurrentTime: function () {
            return new Date().toLocaleTimeString().
            replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        },
    };

    chat.init();
})();