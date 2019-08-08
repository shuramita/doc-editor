
import Module from 'quill/core/module';
import Quill from 'quill';
import MarginStyle from "../formats/margin";
import FontAttributor from "../formats/font";
import SizeAttributor from "../formats/size";
import LineHeight from "../formats/line-height";
import GDocListClass from "../formats/gdoc-class";
import PaddingBottomStyle from "../formats/padding-bottom";
Quill.register(MarginStyle,true);
Quill.register(FontAttributor,true);
Quill.register(SizeAttributor,true);
Quill.register(LineHeight,true);
Quill.register(GDocListClass,true);
Quill.register(PaddingBottomStyle,true);


// const Delta = Quill.import('delta');
class HtmlImport extends  Module{
    constructor(quill, options) {
        super(quill, options);
        // this.quill.clipboard.addMatcher('OL', function(node, delta) {
        //     return delta.compose(new Delta().retain(delta.length(), { 'list-ordered-class': node.getAttribute('class') }));
        // });
    }
    getUser(){
        return this.quill.getModule('user').getUser();
    }

}

export {HtmlImport as default}