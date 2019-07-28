import Quill from 'quill';
import TextBlot from "quill/blots/text";
import Parchment from 'parchment';
const Inline = Quill.import('blots/inline');
// Implement of Blot , read at https://github.com/quilljs/parchment/#blots
class ThreadBlot extends Inline{

    static create(value) {
        console.log('ThreadBlot',value);
        let node = super.create(value);
        // set attribute here...
        // node.id = value.id;
        node.setAttribute('threadId', value.id);
        // if(value.start) node.setAttribute('thread-start',value.start);
        // if(value.end)  node.setAttribute('thread-end',value.end);
        console.log(node);
        // node.innerText = 'ABC';

        return node;
    }
    static formats(node){
        let format = {};
        if (node.hasAttribute('threadId')) {
            format.id = node.getAttribute('threadId');
        }
        return format;
    }

}
// ThreadBlot.allowedChildren = [Inline, Parchment.Embed, Text,ThreadBlot];
ThreadBlot.blotName = 'thread';
ThreadBlot.tagName = 'thread';
ThreadBlot.className = 'thread';

export default ThreadBlot;