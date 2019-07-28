import Quill from 'quill';
const Inline = Quill.import('blots/inline');
class InsertBlot extends Inline{

    static create(value) {
        let node = super.create(value);
        return node;
    }

}
InsertBlot.blotName = 'ins';
InsertBlot.tagName = 'ins';
InsertBlot.className = 'ins';

export default InsertBlot;