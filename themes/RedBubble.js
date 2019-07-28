// thx SO https://stackoverflow.com/questions/44625868/es6-babel-class-constructor-cannot-be-invoked-without-new
// import BubbleTheme, { BubbleTooltip } from 'quill/themes/bubble'
// import icons from 'quill/ui/icons'
import Quill from 'quill';
const BubbleTheme = Quill.import('themes/bubble')
const {BubbleTooltip} = Quill.import('themes/bubble')

class RedBubble extends BubbleTheme {
  extendToolbar (toolbar) {
    this.tooltip = new RedBubbleTooltip(this.quill, this.options.bounds)
    this.tooltip.root.appendChild(toolbar.container)

    // you could override Quill's icons here with yours if you want
    // this.buildButtons([].slice.call(toolbar.container.querySelectorAll('button')), icons)
    // this.buildPickers([].slice.call(toolbar.container.querySelectorAll('select')), icons)
  }
}

class RedBubbleTooltip extends BubbleTooltip {
}

RedBubbleTooltip.TEMPLATE = [
  '<a class="ql-close"></a>',
  '<div class="ql-tooltip-editor">',
  '<input type="text" data-formula="e=mc^2" data-link="https://yoururl.com" data-video="Embed URL">',
  '</div>',
  '<span class="ql-tooltip-arrow"></span>'
].join('')

export { RedBubbleTooltip, RedBubble as default }