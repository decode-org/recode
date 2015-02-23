var Recode = require('./recode');
var Helper = Recode.Helper;

var CodeMirrorAdapter = function(recode) {
    this.recode = recode;

    this.languageMap = Helper.simplifyLanguageMappings(CodeMirrorAdapter.languageMappings);
    this.codemirror = CodeMirror(this.recode.element);
    this.document = this.codemirror.getDoc();
    this.mode = '';
    this.document.setValue(recode.files[0].currentContent);
}

CodeMirrorAdapter.prototype.changeText = function(text, position, length) {
    // Nothing to see here
};

CodeMirrorAdapter.prototype.changeSelection = function(position, length) {
    // Nothing to see here
};

CodeMirrorAdapter.prototype.changeFile = function(filepath, file) {
    var mode = file.language || ((typeof filepath === 'string') ? filepath.substring(filepath.lastIndexOf(".")+1) : '');

    if (mode != '') {
        this.mode = this.languageMap[mode] || mode;
        this.codemirror.setOption('mode', this.mode);
    }
};

CodeMirrorAdapter.prototype.render = function() {
    this.document.setValue(this.recode.currentFile.currentContent);
    var file = this.recode.currentFile;

    var pos = file.selections[0].position,
        len = file.selections[0].length,
        reversed = (len.row < 0 || (len.row == 0 && len.col < 0));

    var anchor = {line: pos.row, ch: pos.col};
    var head = {line: pos.row + len.row, ch: pos.col + len.col};

    if ((len.row == 0) && (len.col == 0)) {
        this.document.setCursor(anchor);
    } else {
        this.document.setSelection(anchor, head);
    }
};

CodeMirrorAdapter.languageMappings = [
    {
        names: ['html', 'htm'],
        mode: 'htmlmixed'
    },
    {
        names: ['js'],
        mode: 'javascript'
    }
];

Recode.adapters.codemirror = CodeMirrorAdapter;
module.exports = CodeMirrorAdapter;
