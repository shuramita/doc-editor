import Quill from 'quill';
var Parchment = Quill.import('parchment');

const PaddingBottomStyle = new Parchment.StyleAttributor('padding-bottom', 'padding-bottom', {
    scope: Parchment.Scope.BLOCK, // apply in blck scope that affected only to <p> tag
    // whitelist: ['36pt'],
});

export default PaddingBottomStyle;
