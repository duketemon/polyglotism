var DATA = {};
var CURRENT_ELEMENT_INDEX = 0;
var IS_RECORDING_STARTED = false;

$.get("/texts", function(data) {
   DATA = data;

    var html = '';
    for (const key in DATA) {
        const title = DATA[key]['title'];
        const lang = DATA[key]['lang'];
        html += `<button type="button" class="list-group-item list-group-item-action" onclick="updateValues(${key})">${title} - ${lang}</button>`;
    }
    $('#texts-list')[0].innerHTML = html;
    updateValues(CURRENT_ELEMENT_INDEX);
});

function updateValues(newIndex) {
    const list = $('#texts-list >');
    list[CURRENT_ELEMENT_INDEX].classList.remove('active');
    CURRENT_ELEMENT_INDEX = newIndex;
    list[CURRENT_ELEMENT_INDEX].classList.add('active');
    $('#current-text')[0].value = DATA[CURRENT_ELEMENT_INDEX]['content'];
}
