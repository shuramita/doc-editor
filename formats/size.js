
import Quill from 'quill';
var SizeAttributor = Quill.import('attributors/style/size');

SizeAttributor.whitelist = [
    '8pt',
    '9pt',
    '10pt',
    '10.5pt',
    '11pt',
    '12pt', '13pt', '14pt','18pt',
    '24pt',
    '30pt',
    '36pt',
    '48pt',
    '60pt',
    '72pt',
    '96pt'
  ];
export default SizeAttributor;