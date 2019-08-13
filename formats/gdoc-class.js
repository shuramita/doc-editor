// TODO: we try to keep class of OL when convert from DocX or GDox HTML to keep OL style as definition in doc

import Quill from 'quill';
import ListItem, {ListContainer} from "quill/formats/list";
import Block from "quill/blots/block";

const Container = Quill.import('blots/container');
// const Block = Quill.import('blots/block');

// const ATTRIBUTES = ['class', 'height', 'width'];

class GDocListClass extends ListContainer {
  static create(value) {
      const node = super.create(value);
      if(typeof value == 'string') {
          node.dataset.parentClass = value;
          // node.setAttribute('data-parent-class', value);
      }
      console.log('GDocListClass create node:',node,value);
      return node;
  }
  // optimize(context) {
  //     console.log('GDocListClass create node:',context);
  //     super.optimize(context);
  // }

    constructor(scroll,node){
        super(scroll,node );
        node.setAttribute('class','ABC');
        console.log('GDocListClass constructor:', scroll, node);
  }
  // static value(domNode) {
  //   console.log('GDocListClass value:',domNode.getAttribute('class'))
  //   return domNode.getAttribute('class');
  // }

}
GDocListClass.blotName = 'list-ordered-class';
GDocListClass.tagName = 'OL';
// GDocListClass.className = 'anything-here';
// GDocListClass.allowedChildren = [ListItem];
export default GDocListClass;
