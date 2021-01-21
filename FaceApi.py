import os, requests, json

client_id = "client_id"  # private info
client_secret = "client_secret"  # private info
url = "https://openapi.naver.com/v1/vision/face"  # 얼굴 감지
headers = {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}

file_count = len(os.walk(os.getcwd()+'/save_img').__next__()[2])  # save_img directory 내의 파일 개수


path_dir = './save_img/'
file_list = os.listdir(path_dir)
file_list.sort()

# emotions.json
emotions = dict()

count = [0, 0, 0, 0, 0] # smile, neutral, sad, fear, surprise

for i, file_name in enumerate(file_list):
    f = open(path_dir+file_name, 'rb')
    files = {'image': f}
    response = requests.post(url, files=files, headers=headers)
    res_code = response.status_code
    if res_code == 200:
        # faces 의 value 가 있을 경우(얼굴 감지한 경우)
        faces = response.json()['faces']
        if response.json()['faces']:
            for face in faces:
                emotion = face['emotion']['value']
                # print(emotion)
                if emotion == 'laugh' or emotion == 'smile':
                    emotion = 'smile'
                    count[0] += 1
                elif emotion == 'talking' or emotion == 'neutral':
                    emotion = 'neutral'
                    count[1] += 1
                elif emotion == 'sad':
                    count[2] += 1
                elif emotion == 'angry' or emotion == 'fear':
                    emotion = 'fear'
                    count[3] += 1
                elif emotion == 'disgust' or emotion == 'surprise':
                    emotion = 'surprise'
                    count[4] += 1
                file_name = file_name[:-4]  # .jpg 제거
                emotions[f'{file_name}'] = emotion
        else:
            # 감지한 얼굴이 없는 경우 -> "faces":[] -> 삭제
            f.close()
            os.remove(path_dir+file_name)
            print(f"{file_name} no face -> removed !")
    else:
        print("Error Code:" + res_code)
        exit(1)

total = count.index(max(count))
print(total)

if total == 0:
    emotions['total'] = 'smile'
if total == 1:
    emotions['total'] = 'neutral'
if total == 2:
    emotions['total'] = 'sad'
if total == 3:
    emotions['total'] = 'fear'
if total == 4:
    emotions['total'] = 'surprise'

# json 파일로 저장
with open('./emotions.json', 'w', encoding='utf-8') as make_file:
    json.dump(emotions, make_file, indent="\t")

# 저장한 파일 출력하기
with open('./emotions.json', 'r') as f:
    json_data = json.load(f)

print()
print("************emotions.json************")
print(json.dumps(json_data, indent="\t"))

# emotion.json
# {
#     "0000.jpg": "smile",
#     "0001.jpg": "sad",
# }


# 11초 영상을 프레임당 잘랐을 때 331개. 11/331 = 1프레임 당 0.03323263 초
# frame = 0.03323263
# ex) 0->5 : duration = 6 * frame


# 얼굴이 없는 경우 : {"info":{"size":{"width":404,"height":720},"faceCount":0},"faces":[]}
# 얼굴이 있는 경우 : {"info":{"size":{"width":354,"height":472},"faceCount":1},
# "faces":[{"roi":{"x":110,"y":124,"width":149,"height":149},"landmark":{"leftEye":{"x":145,"y":167},
# "rightEye":{"x":216,"y":165},"nose":{"x":178,"y":199},"leftMouth":{"x":153,"y":231},"rightMouth":{"x":210,"y":232}},
# "gender":{"value":"male","confidence":1.0},"age":{"value":"19~23","confidence":0.494793},"emotion":{"value":"neutral",
# "confidence":1.0},"pose":{"value":"frontal_face","confidence":0.999343}}]}
