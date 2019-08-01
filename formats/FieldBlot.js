import Quill from 'quill';
const Inline = Quill.import('blots/inline');
// const Block = Quill.import('blots/block');
// const Embed = Quill.import('blots/embed');
// const TextBlot = Quill.import('blots/text');
// Implement of Blot , read at https://github.com/quilljs/parchment/#blots
import Field from '../modules/Field';
//todo: the fieldblot should always as a parent for other blot like example below
// <field><strong><em>$283,232.00</i></em></strong></field>



class FieldBlot extends Inline{

    static create(value) {
        console.log('FieldBlot',value);
        let node = super.create(value);
        let format = {};
        if(typeof value == 'string') {
            console.log('insert from toolbar');
            format = Field.getField(value);

            if(!format) {
                throw 'Insert field not found';
            }else{
                node.innerText = format.data;
            }
        }else{
            format = value;
        }

        node.setAttribute('name', format.name);
        node.setAttribute('type', format.type);
        node.setAttribute('contenteditable', format.contenteditable ? format.contenteditable : false);

        return node;
    }
    // constructor(domNode) {
        // super(domNode);

        // Bind our click handler to the class.
        // this.clickHandler = this.clickHandler.bind(this);
        // domNode.addEventListener('click',this.clickHandler);

        // this.toolTip = new FieldBlotToolTip();
    // }
    clickHandler(event) {
        console.log("field click was clicked. Blot: ", this);
        // show fix box
        //get tooltip,
    }
    optimize(context){
        // return false;
        // super.optimize(context);
        // console.log('context field blot',context);
        // console.log(this);
    }
    static formats(node) {
        // We still need to report unregistered embed formats
        let format = {};
        if (node.hasAttribute('name')) {
            format.name = node.getAttribute('name');
        }
        if (node.hasAttribute('type')) {
            format.type = node.getAttribute('type');
        }
        format.data = node.innerText;
        return format;
    }
}
// Inline.allowedChildren = [Inline, Parchment.Embed, Text];
// Lower index means deeper in the DOM tree, since not found (-1) is for embeds
// Inline.order = [
//     'cursor', 'inline',   // Must be lower
//     'underline', 'strike', 'italic', 'bold', 'script','em',
//     'link', 'code'        // Must be higher
// ];

FieldBlot.blotName = 'field';
FieldBlot.tagName = 'field';
FieldBlot.className = 'field';
export default FieldBlot;