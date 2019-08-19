import Quill from 'quill';
// const Module = Quill.import('core/module');
// import Module from 'quill/core/module';
const Module = Quill.import('core/module');

class User extends  Module{
    constructor(quill, options) {
        super(quill, options);
        // this.editor = quill;
        // this.options = options
    }
    getUser(){
        return this.options.user;
    }

}

export {User as default}