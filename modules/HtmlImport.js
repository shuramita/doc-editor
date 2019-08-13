import Module from 'quill/core/module';
import Quill from 'quill';
const Delta = Quill.import('delta');

import MarginStyle from "../formats/margin";
import FontAttributor from "../formats/font";
import SizeAttributor from "../formats/size";
import LineHeight from "../formats/line-height";
import GDocListClass from "../formats/gdoc-class";
import PaddingBottomStyle from "../formats/padding-bottom";
import ListIndent from "../formats/ListIndent";
Quill.register(MarginStyle,true);
Quill.register(FontAttributor,true);
Quill.register(SizeAttributor,true);
Quill.register(LineHeight,true);
Quill.register(GDocListClass,true);
Quill.register(ListIndent,true);
Quill.register(PaddingBottomStyle,true);


// const Delta = Quill.import('delta');
class HtmlImport extends  Module{
    constructor(quill, options) {
        super(quill, options);
        this.quill.clipboard.addMatcher('OL[class^="lst-"] LI', function(node, delta) {
            console.log('HtmlImport: delta before',node,delta);
            let newDelta =  delta.compose(new Delta().retain( delta.length(), { 'gdoc-indent': node.parentElement.classList } ));
            console.log('HtmlImport: delta after',node,newDelta);
            return newDelta;
        });
    }
    getUser(){
        return this.quill.getModule('user').getUser();
    }

}

export {HtmlImport as default}