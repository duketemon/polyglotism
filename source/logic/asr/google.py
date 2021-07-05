import speech_recognition as sr


class SpeechToTextGoogle:
    __lang_mapping = {
        'English': 'en-US',
        'Русский': 'ru-RU',
        'Español': 'es-MX',
        'Français': 'fr-FR',
    }
    __recognizer = sr.Recognizer()

    def get_text(self, path: str, lang: str) -> str:
        with sr.AudioFile(path) as source:
            audio = self.__recognizer.record(source)
        text = self.__recognizer.recognize_google(
            audio,
            language=self.__lang_mapping[lang]
        )
        return text
