var GridDispatcher = require('../dispatcher/GridDispatcher'),
    GridConstants = require('../constants/GridConstants');


var StylesActions = {
    resize: function (gridId, width) {
        GridDispatcher.handleViewAction({
            actionType: GridConstants.RESIZE,
            gridId: gridId,
            width: width
        });
    },
    pinColumn: function(){},
    updateRowCellHeight: function(){}
};


module.exports = StylesActions;