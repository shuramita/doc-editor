import Delta from 'quill-delta';
import Quill from 'quill';
const Module = Quill.import('core/module');
import '../ui/quill.table.css';
import {
    TableCell,
    TableRow,
    TableBody,
    TableContainer,
    tableId,
} from '../formats/TableBlot';

class Table extends Module {
    static register() {
        console.log('Table: Register modules');
        Quill.register(TableCell);
        Quill.register(TableRow);
        Quill.register(TableBody);
        Quill.register(TableContainer);
    }

    constructor(quill,options) {
        super(quill,options); // for quill 1.3.6 , for 2.0 use super(...args);
        this.listenBalanceCells();
        let tableButtons = document.getElementsByClassName('ql-table');

        if (tableButtons) {
            [].slice.call( tableButtons ).forEach( ( tableButton )=> {
                tableButton.innerHTML = options.buttonIcon;
                tableButton.addEventListener('click',this.insertTableHandler.bind(this));
            });
        }
    }
    insertTableHandler(event){
      let node = event.target;
      let value = node.value;
      console.log(value);
      if(value) {
          let jsonValue = JSON.parse(value);
          // console.log(jsonValue);
          // console.log(rows,columns);
          let rows = jsonValue[0];
          let columns = jsonValue[1];
          console.log('Table: Creating and insert new Table')
          this.insertTable(rows,columns);
      }
    }
    balanceTables() {
        this.quill.scroll.descendants(TableContainer).forEach(table => {
            table.balanceCells();
        });
    }

    deleteColumn() {
        const [table, , cell] = this.getTable();
        if (cell == null) return;
        table.deleteColumn(cell.cellOffset());
        this.quill.update(Quill.sources.USER);
    }

    deleteRow() {
        const [, row] = this.getTable();
        if (row == null) return;
        row.remove();
        this.quill.update(Quill.sources.USER);
    }

    deleteTable() {
        const [table] = this.getTable();
        if (table == null) return;
        const offset = table.offset();
        table.remove();
        this.quill.update(Quill.sources.USER);
        this.quill.setSelection(offset, Quill.sources.SILENT);
    }

    getTable(range = this.quill.getSelection()) {
        if (range == null) return [null, null, null, -1];
        const [cell, offset] = this.quill.getLine(range.index);
        if (cell == null || cell.statics.blotName !== TableCell.blotName) {
            return [null, null, null, -1];
        }
        const row = cell.parent;
        const table = row.parent.parent;
        return [table, row, cell, offset];
    }

    insertColumn(offset) {
        const range = this.quill.getSelection();
        const [table, row, cell] = this.getTable(range);
        if (cell == null) return;
        const column = cell.cellOffset();
        table.insertColumn(column + offset);
        this.quill.update(Quill.sources.USER);
        let shift = row.rowOffset();
        if (offset === 0) {
            shift += 1;
        }
        this.quill.setSelection(
            range.index + shift,
            range.length,
            Quill.sources.SILENT,
        );
    }

    insertColumnLeft() {
        this.insertColumn(0);
    }

    insertColumnRight() {
        this.insertColumn(1);
    }

    insertRow(offset) {
        const range = this.quill.getSelection();
        const [table, row, cell] = this.getTable(range);
        if (cell == null) return;
        const index = row.rowOffset();
        table.insertRow(index + offset);
        this.quill.update(Quill.sources.USER);
        if (offset > 0) {
            this.quill.setSelection(range, Quill.sources.SILENT);
        } else {
            this.quill.setSelection(
                range.index + row.children.length,
                range.length,
                Quill.sources.SILENT,
            );
        }
    }

    insertRowAbove() {
        this.insertRow(0);
    }

    insertRowBelow() {
        this.insertRow(1);
    }

    insertTable(rows, columns) {
        const range = this.quill.getSelection();
        if (range == null) return;
        const delta = new Array(rows).fill(0).reduce(memo => {
            const text = new Array(columns).fill('\n').join('');
            return memo.insert(text, { table: tableId() });
        }, new Delta().retain(range.index));
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index, Quill.sources.SILENT);
        this.balanceTables();
    }

    listenBalanceCells() {
        this.quill.on(Quill.events.SCROLL_OPTIMIZE, mutations => {
            mutations.some(mutation => {
                if (['TD', 'TR', 'TBODY', 'TABLE'].includes(mutation.target.tagName)) {
                    this.quill.once(Quill.events.TEXT_CHANGE, (delta, old, source) => {
                        if (source !== Quill.sources.USER) return;
                        this.balanceTables();
                    });
                    return true;
                }
                return false;
            });
        });
    }
}
Table.DEFAULTS = {
    buttonIcon: '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="table" class="svg-inline--fa fa-table fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V80c0-26.51-21.49-48-48-48zM224 416H64v-96h160v96zm0-160H64v-96h160v96zm224 160H288v-96h160v96zm0-160H288v-96h160v96z"></path></svg>'
};
export default Table;