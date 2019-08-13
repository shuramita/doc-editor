import Quill from 'quill';
var Parchment = Quill.import('parchment');

class BlockMarginStyle extends Parchment.StyleAttributor {
    add(node, value){
        if(node.nodeName === 'P') {
            super.add(node, value);
            return true;
        }
        return false;

    }
}
const MarginStyle = new BlockMarginStyle('margin-left', 'margin-left', {
    scope: Parchment.Scope.BLOCK, // apply in blck scope that affected only to <p> tag
    // whitelist: ['36pt'],
});

console.log('MarginStyle:',MarginStyle);
export default MarginStyle;
