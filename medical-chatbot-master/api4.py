# 音频文件转文字：采用百度的语音识别python-SDK
# 百度语音识别API配置参数
from aip import AipSpeech

APP_ID = '23732074'
API_KEY = 'yFqNBRp7oDYqPDl6G83ViuOM'
SECRET_KEY = 'rDKmCvQ4shBLPg3WZektLIxsOEjdH0B8'
client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)
path = 'voices/myvoices.wav'

# 将语音转文本STT
def listen():
    # 读取录音文件
    with open(path, 'rb') as fp:
        voices = fp.read()
    try:
        # 参数dev_pid：1536普通话(支持简单的英文识别)、1537普通话(纯中文识别)、1737英语、1637粤语、1837四川话、1936普通话远场
        result = client.asr(voices, 'wav', 16000, {'dev_pid': 1537, })
        result_text = result["result"][0]
        print("you said: " + result_text)
        return result_text
    except KeyError:
        print("KeyError")

# 与机器人对话：调用的是图灵机器人
import requests
import json

# 图灵机器人的API_KEY、API_URL
turing_api_key = "75854c5f9e6d4be"
api_url = "http://openapi.tuling123.com/openapi/api/v2"  # 图灵机器人api网址
headers = {'Content-Type': 'application/json;charset=UTF-8'}

# 图灵机器人回复
def Turing(text_words=""):
    #请求
    req = {
        "reqType": 0,       # 输入类型 为文本
        "perception": {
            "inputText": {
                "text": text_words    # 输入文本信息
            },

            "selfInfo": {             # 客户端属性
                "location": {
                    "city": "新干县",
                    "province": "江西省",
                    "street": "善政二路"
                }
            }
        },
        #用户参数
        "userInfo": {
            "apiKey": turing_api_key,  # 你的图灵机器人apiKey
            "userId": "cheney007"  # 用户唯一标识(随便填, 非密钥)
        }
    }

    req["perception"]["inputText"]["text"] = text_words  #给json串赋值
    response = requests.request("post", api_url, json=req, headers=headers) #向接口网站发送请求
    response_dict = json.loads(response.text)

    result = response_dict["results"][0]["values"]["text"]  #得到接口的回复进行解析
    print("AI Robot said: " + result)
    return result
 
import pyttsx3
def speak(workText):
    # 初始化语音
    engine = pyttsx3.init()  # 初始化语音库
    # 设置语速
    rate = engine.getProperty('rate')
    engine.setProperty('rate', rate - 50)
    # 输出语音
    engine.say(workText)  # 合成语音
    engine.runAndWait()


my_record()
text=listen()
respondText=Turing(text)
print(respondText)
