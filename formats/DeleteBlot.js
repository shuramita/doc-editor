import Quill from 'quill';
const Inline = Quill.import('blots/inline');
class DeleteBlot extends Inline{

    static create(value) {
        console.log('DeleteBlot',value);
        let node = super.create(value);
        return node;
    }

}
DeleteBlot.blotName = 'del';
DeleteBlot.tagName = 'del';
DeleteBlot.className = 'del';

export default DeleteBlot;