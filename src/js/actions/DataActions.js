var GridDispatcher = require('../dispatcher/GridDispatcher'),
    GridConstants = require('../constants/GridConstants');


var DataActions = {
    loadData: function (gridId, header, rows) {
        GridDispatcher.handleViewAction({
            actionType: GridConstants.LOAD_DATA,
            gridId: gridId,
            rows: rows,
            header: header
        });
    }
};


module.exports = DataActions;