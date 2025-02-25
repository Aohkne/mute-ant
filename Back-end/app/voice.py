from gtts import gTTS
import pygame
import io

pygame.mixer.init()

while True:
    text = input("Nhập văn bản (hoặc gõ 'exit' để thoát): ")
    if text.lower() == "exit":
        break

    tts = gTTS(text=text, lang="vi")
    audio_data = io.BytesIO()  
    tts.write_to_fp(audio_data)
    audio_data.seek(0)

    pygame.mixer.music.load(audio_data, "mp3")
    pygame.mixer.music.play()

    while pygame.mixer.music.get_busy():
        continue
