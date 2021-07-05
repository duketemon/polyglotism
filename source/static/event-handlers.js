$("#recording-btn").click(function(self){
    self = self.currentTarget;
    if (IS_RECORDING_STARTED) {
        $(self)
            .removeClass('btn-danger')
            .addClass('btn-secondary')
            .prop('disabled', true);
        $('#recording-btn-text')[0].innerText = 'Processing..';
        $('#recording-btn-spinner')[0].hidden = false;
        stopRecording();
    }
    else {
        $(self)
            .removeClass('btn-success')
            .addClass('btn-danger')
            .prop('disabled', true);
        startRecording();
        $('#recording-btn-text')[0].innerText = 'Stop recording';
        $(self).prop('disabled', false);
    }
    IS_RECORDING_STARTED = !IS_RECORDING_STARTED;
});

// $("#watch-example-btn").click(function(){
//     window.open(DATA[CURRENT_ELEMENT_INDEX]['example-url'],'_blank');
// });
