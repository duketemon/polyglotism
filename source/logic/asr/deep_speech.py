import subprocess


class SpeechToTextConverterDeepSpeech:

    def __init__(self):
        self.path_to_model = '/home/duketemon/Desktop/asr/deep-speech/deepspeech-0.6.1-models'

    def convert(self, path_to_file: str):
        cmd = 'deepspeech ' \
              f'--model {self.path_to_model}/output_graph.pbmm ' \
              f'--lm {self.path_to_model}/lm.binary ' \
              f'--trie {self.path_to_model}/trie ' \
              f'--audio {path_to_file}'
        text = self.__extract_text(self.__run_command(cmd))
        return text

    def __extract_text(self, output: str):
        print(output)
        lines = output.split('\n')
        return lines[-2]

    def __run_command(self, cmd: str):
        return subprocess.getoutput(cmd)
