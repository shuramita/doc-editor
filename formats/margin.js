import Quill from 'quill';
var Parchment = Quill.import('parchment');

const MarginStyle = new Parchment.StyleAttributor('margin-left', 'margin-left', {
    scope: Parchment.Scope.BLOCK, // apply in blck scope that affected only to <p> tag
    // whitelist: ['36pt'],
});

export default MarginStyle;
