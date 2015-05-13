var React = require('react'),
    GridStore = require('../stores/GridStore'),
    HeaderCell = require('./HeaderCell.react'),
    assign = require('object-assign');


function getStateFromStore(gridId) {
    return {
        pinnedColumns: GridStore.getPinnedColumns(gridId),
        width: GridStore.getGridWidth(gridId),
        fullWidth: GridStore.getGridFullWidth(gridId),
        header: GridStore.getHeader(gridId)
    };
}


var Header = React.createClass({
    getInitialState: function () {
        return assign(getStateFromStore(), {
            rowHeight: GridStore.getRowHeight(this.props.gridId, this.rowId)
        });
    },


    componentDidMount: function () {
        this.node = this.getDOMNode();
        GridStore.addChangeListeners(this._onChange, this.props.gridId);
        GridStore.addChangeListeners(this._onScroll, this.props.gridId, GridStore.EVENTS.SCROLL);
        GridStore.addChangeListeners(this._onCellUpdate, this.props.gridId, GridStore.EVENTS.CELL_UPDATE);
    },
    componentWillUnmount: function () {
        GridStore.removeChangeListener(this._onChange, this.props.gridId);
        GridStore.removeChangeListener(this._onScroll, this.props.gridId, GridStore.EVENTS.SCROLL);
        GridStore.removeChangeListener(this._onCellUpdate, this.props.gridId, GridStore.EVENTS.CELL_UPDATE);
    },

    getInitialState: function () {
        return getStateFromStore(this.props.gridId);
    },
    render: function () {
        var headerStyle = {
            width: this.state.width
        };

        var rowStyle = {
            width: this.state.fullWidth,
            height: this.state.rowHeight,
            paddingLeft: this.state.pinnedColumns.reduce(function (w, c) {
                return w + c.width;
            }, 0)
        };

        this.setStyle();

        console.log(this.state.header);
        var header = this.state.header.map(function (cell) {
            var options = {
                isPinned: this.state.pinnedColumns.indexOf(cell) != -1,
                left: this.node.scrollLeft
            };

            return (
                <HeaderCell rowId={this.rowId} options={options} gridId={this.props.gridId} cell={cell} />
            );
        }.bind(this));
        return (
            <div style={headerStyle} className="qtable__header">
                <div style={rowStyle} className="qtable__row qtable__row--header">{header}</div>
            </div>);
    },
    rowId: "headerRow",
    _onChange: function () {
        this.setState(getStateFromStore(this.props.gridId));
        this.setPinStyle();
    },
    node: null,
    style: null,
    setStyle: function () {
        if (this.style == null) {
            this.style = document.createElement('style');
            document.head.appendChild(this.style);
        }
        var style = GridStore.getStyle(this.props.gridId);
        if (this.style.textContent !== undefined) {
            this.style.textContent = style;
        } else {
            this.style.innerText = style;
        }
    },

    prevStyle: null,
    pinStyle: null,
    pervScrollSize: 0,
    setPinStyle: function () {
        if (this.pinStyle == null) {
            this.pinStyle = document.createElement('style');
            document.head.appendChild(this.pinStyle);
        }
        var style = GridStore.getPinStyle(this.props.gridId, this.props.header);

        if (style == this.prevStyle) {
            return;
        }

        this.prevStyle = style;

        if (this.pinStyle.textContent !== undefined) {
            this.pinStyle.textContent = style;
        } else {
            this.pinStyle.innerText = style;
        }
    },
    _onScroll: function () {
        this.setPinStyle();
        this.node.scrollLeft = GridStore.getRealScrollLeft(this.props.gridId);
    },


    _onCellUpdate: function () {
        var newRowHeight = GridStore.getRowHeight(this.props.gridId, this.rowId);

        if (this.state.rowHeight != newRowHeight) {
            this.setState({
                rowHeight: newRowHeight
            });
        }
    }
});

module.exports = Header;