from flask import Flask, request
from flask_cors import  CORS
from speech import listen
app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/api', methods=['GET', 'POST'])
def indextest():
    answer = 'test'
    imgurl = ''
    question = ''
    if request.method == 'GET':
        return {'question': question, 'answer': answer, 'imgurl':imgurl,'state':2}  # ！state=2第一次前端判断

    elif request.method == 'POST':
        f = request.files['upfile']
        with open('audio.wav', 'wb') as audio:
            f.save(audio)
        question = listen()
        if '中国' or '疫情' in question:
            answer = ''
            imgurl = './img/chinese_map.png'
            return {'question': question, 'answer': answer, 'imgurl':imgurl,'state':2}  # state=4 将返回的地址处理成图片
        if '世界' and '确诊' in question:
            answer = ''
            imgurl = './img/world.png'
            return {'question': question, 'answer': answer, 'imgurl':imgurl,'state':2}
        # else:   # 进行一问一答
        #     answer = handler.chat_main(question)  # 接口1产生的answer（未return）
        #     imgurl = ''
        #     if answer == "这个问题知识库中暂时没有，请查看用户问答库中有没有您要问的问题":
        #         return {'answer': answer,'imgurl':imgurl, 'state':2}   # 1代表跳转接口2
        #     else:   # 机器可以回答
        #         answer=answer+'\n可以解决你的问题吗？'
        #         imgurl = ''
        #         return {'answer': answer, 'imgurl':imgurl,'state':2}  # ！state=2第一次前端判断
        #         # 前端判断  用户输入可以或不可  可以输出感谢您的提问  不可以跳转接口2

        return {'question': question, 'answer': answer, 'imgurl':imgurl, 'state':2}  # ！state=2第一次前端判断



@app.route('/', methods=['GET', 'POST'])
def a():
    return request.form['question']

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)
