import Quill from 'quill';
const Inline = Quill.import('blots/inline');
class SelectionBlot extends Inline{

    static create(value) {
        return false;
        console.log('SelectionBlot',value);
        let node = super.create(value);
        return node;
    }

}
// ThreadBlot.allowedChildren = [Inline, Parchment.Embed, Text,ThreadBlot];
SelectionBlot.blotName = 'mark';
SelectionBlot.tagName = 'mark';
SelectionBlot.className = 'mark-selection';

export default SelectionBlot;