# 音频文件转文字：采用百度的语音识别python-SDK
# 百度语音识别API配置参数
from aip import AipSpeech

APP_ID = '23732074'
API_KEY = 'yFqNBRp7oDYqPDl6G83ViuOM'
SECRET_KEY = 'rDKmCvQ4shBLPg3WZektLIxsOEjdH0B8'
client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)

# 将语音转文本STT
def listen():
    # 读取录音文件
    with open('audio.wav', 'rb') as fp:
        voices = fp.read()
    # 参数dev_pid：1536普通话(支持简单的英文识别)、1537普通话(纯中文识别)、1737英语、1637粤语、1837四川话、1936普通话远场
    result = client.asr(voices, 'wav', 16000, {'dev_pid': 1536,})
    result_text = result['result'][0]
    return result_text

result = listen()
print(result)