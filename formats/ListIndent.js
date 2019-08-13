import Quill from 'quill';
var Parchment = Quill.import('parchment');

class ListIndentClass extends Parchment.ClassAttributor {
    add(node, value){
        console.log('ListIndentClass: add',node);
        node.dataset.classList = value;
        return super.add(node, value[0].split('-')[2]);

        // return false;
    }
    value(node) {
        return node.dataset.classList || undefined; // Don't return NaN
    }
}
const ListIndent = new ListIndentClass('gdoc-indent', 'ql-indent', {
    scope: Parchment.Scope.BLOCK, // apply in blck scope that affected only to <p> tag
    // whitelist: ['36pt'],
});

console.log('ListIndent:',ListIndent);
export default ListIndent;
