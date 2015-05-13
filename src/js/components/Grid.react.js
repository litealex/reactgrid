var React = require('react'),
    Header = require('./Header.react'),
    Body = require('./Body.react'),
    DataActions = require('../actions/DataActions'),
    StylesActions = require('../actions/StylesActions'),
    GridStore = require('../stores/GridStore'),
    //HScroller = require('./HScroller.react'),
    $ = require('jquery')//,
    //StylesActions = require('../actions/StylesActions'),
    //GridActions = require('../actions/GridActions'),
    //VScroller = require('./VScroller.react')
    ;


var Grid =
    React.createClass({
        statics: {
            id: 0,
            getNextId: function () {
                return ++this.id;
            }
        },
        componentDidMount: function () {
            $(window).on('resize', this._resize.bind(this));
            this._resize();
        },
        componentWillReceiveProps: function (nextProps) {
            DataActions.loadData(this.gridId, nextProps.header, nextProps.rows);
        },
        gridId: null,
        componentWillMount: function () {
            this.gridId = Grid.getNextId();
        },
        render: function () {
            var gridClass = 'qtable ' + GridStore.getGridClassName(this.gridId);
            return (
                <div className="qtable__wrapper">
                    <div className={gridClass}>
                        <Header gridId={this.gridId} />
                    </div>
                </div>)
        },
        _resize: function () {
            var $grid = $(this.getDOMNode());
            var $parent = $grid.parent();
            StylesActions.resize(this.gridId, $parent.width());
        },
    });


module.exports = Grid;