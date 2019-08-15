import { Previewer, Chunker } from 'pagedjs';
import Quill from 'quill';
// const Module = Quill.import('core/module');
import Module from 'quill/core/module';
import PageBlot from "../formats/PageBlot";
const Delta =  Quill.import('delta');
Quill.register({
    'formats/page-break': PageBlot,
}, true);
import ContentParser from 'pagedjs/lib/chunker/parser';

class PageBreak extends  Module{
    constructor(quill, options) {
        super(quill, options);
        this.pageHeight = 842; // in pixel
        console.log('PageBreak: ',this.pageHeight);
        if(this.options.enabled){
            this.quill.on('text-change', this.calculatePagePositionIndex.bind(this));
        }
        this.currentFlow = null;
    }
    getUser(){
        return this.quill.getModule('User').getUser();
    }
    //TODO: not sure how to calculate the page break position
    calculatePagePositionIndex(delta, oldDelta, source){
        // from 0 to the place where height > 842 pixel is first page
        console.log('PageBreak: ',delta, oldDelta, source);
        let flowText = document.querySelector(`#${this.quill.container.id} .ql-editor`);
        let paged = new Previewer();
        let pageBreaks = document.querySelectorAll('.page-break');
        console.log('PageBreak: ', pageBreaks);
        pageBreaks.forEach(pageBreak=>{
            // pageBreak.parentElement.removeChild(pageBreak);
            console.log('PageBreak: pagebreak from Dom', Quill.find(pageBreak));
            let pageBlot = Quill.find(pageBreak);
            if(pageBlot) {
                let index = this.quill.getIndex(pageBlot);
                console.log('PageBreak: page break index', index);
                let delta = new Delta().retain(index).delete(1);
                console.log('PageBreak: updated Delta to remove page break', delta);
                this.quill.updateContents(delta,'silent');
            }
        });

        console.log('PageBreak: paged object',paged);
        // let chunker = new Chunker();
        // let parser = new ContentParser(flowText.innerHTML);

        // console.log('PageBreak: parser object',parser);

        paged.preview(flowText.innerHTML).then(flow=>{
             console.log( 'PageBreak: flow ',flow);
             // TODO: would find other way to get pages without rendering
             document.querySelector('.pagedjs_pages').remove();
            if(flow.pages && flow.pages.length > 1) {
                this.reRenderPageBreak(flow);
            }
        });



    }
    reRenderPageBreak(flow){
        console.log('PageBreak: let try to calculate page break position and add pageBreak blot to editor',flow);
        let currentPagePosition = 0;
        flow.pages.forEach(page=>{
            currentPagePosition += page.element.innerText.length;
            this.quill.insertEmbed(currentPagePosition,'page-break',currentPagePosition,'silent');

        })
    }
}

export {PageBreak as default}