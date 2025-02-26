import threading
import time
import io
import pygame
from gtts import gTTS

class AudioManager:
    def __init__(self, language="vi"):
        pygame.mixer.init()
        self.language = language
        self.last_played = {}  # To track when we last played each gesture
        self.audio_cache = {}  # Cache for audio data
        self.lock = threading.Lock()

    def play_for_gesture(self, gesture: str, cooldown: float = 2.0) -> None:
        """Play audio for a specific gesture with cooldown to prevent spam"""
        current_time = time.time()
        
        with self.lock:
            # Check if we've played this recently
            if gesture in self.last_played:
                time_since_last = current_time - self.last_played[gesture]
                if time_since_last < cooldown:
                    return  # Still in cooldown period
            
            # Generate or get cached audio
            if gesture not in self.audio_cache:
                self._generate_audio(gesture)
            
            # Play the audio in a non-blocking way
            audio_data = self.audio_cache[gesture]
            audio_data.seek(0)
            pygame.mixer.music.load(audio_data, "mp3")
            pygame.mixer.music.play()
            
            # Update the last played time
            self.last_played[gesture] = current_time

    def _generate_audio(self, gesture: str) -> None:
        """Generate and cache audio for a gesture"""
        text = self._get_text_for_gesture(gesture)
        tts = gTTS(text=text, lang=self.language)
        audio_data = io.BytesIO()
        tts.write_to_fp(audio_data)
        audio_data.seek(0)
        self.audio_cache[gesture] = audio_data

    def _get_text_for_gesture(self, gesture: str) -> str:
        """Map gesture names to spoken text"""
        # Customize these messages for your gestures
        gesture_texts = {
            "open": "Bàn tay mở",
            "close": "Bàn tay đóng",
            "pointer": "Ngón trỏ",
            "peace": "Dấu hiệu hòa bình",
            "thumbs_up": "Ngón tay cái lên",
            # Add more mappings as needed
        }
        return gesture_texts.get(gesture, gesture)