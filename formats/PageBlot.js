import Quill from 'quill';
const Block = Quill.import('blots/block');
class PageBlot extends Block{

    static create(value) {
        console.log('PageBlot',value);
        let node = super.create(value);
        return node;
    }

}
PageBlot.blotName = 'page-break';
PageBlot.tagName = 'page-break';
PageBlot.className = 'page-break';

export default PageBlot;