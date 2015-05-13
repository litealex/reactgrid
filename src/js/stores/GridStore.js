var GridConstants = require('../constants/GridConstants'),
    GridDispatcher = require('../dispatcher/GridDispatcher'),
    EventEmitter = require('events').EventEmitter,
    assign = require('object-assign'),
    CHANGE_EVENT = 'change'
    ;

/** хранилища */
var _rows = {},
    _header = {},
    _width = {};


/** обработчики событий */

function loadData(gridId, header, rows) {
    _header[gridId] = header;
    _rows[gridId] = rows;
}


function updateGridWidth(gridId, width) {
    _width[gridId] = width;
}

var GridStore = assign({}, EventEmitter.prototype, {
    EVENTS: {
        SCROLL: 'SCROLL',
        V_SCROLL: 'V_SCROLL',
        CELL_UPDATE: 'CELL_UPDATE'
    },


    emitChange: function (gridId, event) {
        event = event || '';
        this.emit(CHANGE_EVENT + gridId + event);
    },

    getRows: function (gridId) {
        return _rows[gridId] || [];
    },
    getHeader: function (gridId) {
        return _header[gridId] || [];
    },

    getRowHeight: function () {
        return 18;
    },
    getGridClassName: function (gridId) {
        return GridConstants.GRID_STYLE_PREFIX + gridId;
    },

    getPinStyle: function (gridId) {
        var gridClass = '.' + this.getGridClassName(gridId);
        var left = this.getRealScrollLeft(gridId);

        return this.getPinnedColumns(gridId).map(function (cell) {
            var styleRow = gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ left:' + left + 'px; }';

            left += cell.width;
            return styleRow;
        }.bind(this)).join('');
    },

    getPinnedColumns: function (gridId) {
        return [];
    },
    /** ширина видимой части таблицы */
    getGridWidth: function (gridId) {
        return (_width[gridId] || 0) - 20;
    },
    /** ширина всей таблицы, включая невидимую часть */
    getGridFullWidth: function (gridId) {
        return this.getHeader(gridId).reduce(function (w, h2) {
            return w + h2.width;
        }, 0);

    },
    getRealScrollLeft: function (gridId) {
        //var relative = this.getScrollLeft(gridId);
        //var holderWidth = this.getHolderWidth(gridId);
        //var fullWidth = this.getGridFullWidth(gridId);
        //var scrollBarWidth = this.getScrollWidth(gridId);
        //
        //var maxScroll = fullWidth - this.getGridWidth(gridId);
        //
        //// на сколько реально просколелно
        //var fullScroll = (relative / (scrollBarWidth - holderWidth)) * maxScroll;
        //var scrollByColumns = 0;
        //var scrollableHeader = this.getHeader(gridId).filter(function (cell) {
        //    return !cell.isPin;
        //});
        //
        //if (fullScroll == maxScroll)
        //    return maxScroll;
        //
        //for (var i = 0; i < scrollableHeader.length; i++) {
        //    if (scrollByColumns + scrollableHeader[i].width > fullScroll) {
        //        break;
        //    }
        //    scrollByColumns += scrollableHeader[i].width;
        //}
        //return scrollByColumns;
        return 0;
    },

    getColumnClassName: function (filedId) {
        return GridConstants.COLUMN_STYLE_PREFIX + filedId;
    },

    getStyle: function (gridId) {
        var gridClass = '.' + this.getGridClassName(gridId);
        var left = this.getRealScrollLeft(gridId);
        return this.getHeader(gridId).map(function (cell) {
            var styleRow = gridClass + ' .' + this.getColumnClassName(cell.fieldId)
                + '{ min-width: ' + cell.width + 'px; width: ' + cell.width + 'px;}';

            left += cell.width;
            return styleRow;
        }.bind(this)).join('');
    },

    /** если ожидается множество изменений за малый промежуток времени*/
    reduceEmitChange: function (gridId, event) {
        var key = gridId + event;
        if (timers[key] != null)
            clearTimeout(timers[key]);
        timers[key] = setTimeout(function () {
            this.emitChange(gridId, event);
        }, 15);
    },
    addChangeListeners: function (callback, gridId, event) {
        event = event || '';
        this.on(CHANGE_EVENT + gridId + event, callback);
    },
    removeChangeListener: function (callback, gridId, event) {
        event = event || '';
        this.removeListener(CHANGE_EVENT + gridId + event, callback);
    },

    dispatcherIndex: GridDispatcher.register(function (payload) {
        var action = payload.action,
            gridId = action.gridId;
        switch (action.actionType) {
            case GridConstants.LOAD_DATA:
                loadData(gridId, action.rows, action.header);
                GridStore.emitChange(gridId);
                break;
            case GridConstants.RESIZE:
                updateGridWidth(gridId, action.width);
                GridStore.emitChange(gridId);
                break;
        }


        return true;
    })
});

GridStore.setMaxListeners(0);
module.exports = GridStore;

