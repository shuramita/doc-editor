import Quill from 'quill';
var Parchment = Quill.import('parchment');

const LineHeight = new Parchment.StyleAttributor('line-height', 'line-height', {
    scope: Parchment.Scope.BLOCK,
    // whitelist: ['36pt'],
});

export default LineHeight;
