import Quill from 'quill';
import Delta from 'quill-delta';
import TableCell from './TableCellBlot';
import TableRow from './TableRowBlot';
import Table from './TableBlot';
import Contain from './ContainBlot';
import TableTrick from "./TableTrick";
import './quill.table.css';

let Container = Quill.import('blots/container');

Container.order = [
    'list', 'contain',   // Must be lower
    'td', 'tr', 'table'  // Must be higher
];


class TableModule {
    constructor(quill, options) {
        let toolbar = quill.getModule('toolbar');
        toolbar.addHandler('table', function (value) {
            return TableTrick.table_handler(value, quill);
        });
        let clipboard = quill.getModule('clipboard');
        clipboard.addMatcher('TABLE', function (node, delta) {
            return delta;
        });
        clipboard.addMatcher('TR', function (node, delta) {
            return delta;
        });
        clipboard.addMatcher('TD', function (node, delta) {
            return delta.compose(new Delta().retain(delta.length(), {
                td: node.getAttribute('table_id') + '|' +
                    node.getAttribute('row_id') + '|' +
                    node.getAttribute('cell_id') + '|' +
                    node.getAttribute('width')
            }));
        });
    }
}

export {
    Table,
    TableRow,
    TableCell,
    Contain,
    TableModule
};