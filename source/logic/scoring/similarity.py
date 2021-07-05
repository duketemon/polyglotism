from collections import Counter


def get_similarity(source_text: str, user_text: str) -> (int, str):
    source_text_counter = Counter(__clean_text(source_text))
    user_text_counter = Counter(__clean_text(user_text))
    total_diff, total = 0, 0
    for key, value in source_text_counter.items():
        if key:
            total_diff += value - user_text_counter[key] if value - user_text_counter[key] > 0 else 0
            total += value
    score = (total - total_diff) / total
    return int(score * 100), __get_score_comment(score)


def __get_score_comment(value: float):
    if value > 0.8:
        return 'Good job!'
    elif value > 0.6:
        return 'Well done!'
    elif value > 0.4:
        return "Not bad"
    return "It ain't much, but it's honest work"


def __clean_text(text: str) -> [str]:
    return text\
        .lower()\
        .replace('\n', ' ')\
        .replace('.', ' ')\
        .replace(',', ' ')\
        .replace('-', ' ') \
        .replace('ё', 'е') \
        .split(' ')
