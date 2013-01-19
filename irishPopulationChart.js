
(function(){

    /**
     * generates the irishPopulationChart example and renders it to the dom
     * @param  {DOMElement} el    The DOM element to render the chart example to
     * @return {Void}
     */
    var irishPopulationChart = function( el ){
        var renderTo = el || Ext.getBody();

        // the data
        var cendata = [
            { year: 1901, male: 1610085, female: 1611738, both: 3221823 },
            { year: 1911, male: 1589509, female: 1550179, both: 3139688 },
            { year: 1926, male: 1506889, female: 1465103, both: 2971992 },
            { year: 1936, male: 1520454, female: 1447966, both: 2968420 },
            { year: 1946, male: 1494877, female: 1460230, both: 2955107 },
            { year: 1951, male: 1506597, female: 1453996, both: 2960593 },
            { year: 1956, male: 1462928, female: 1435336, both: 2898264 },
            { year: 1961, male: 1416549, female: 1401792, both: 2818341 },
            { year: 1966, male: 1449032, female: 1434970, both: 2884002 },
            { year: 1971, male: 1495760, female: 1482488, both: 2978248 },
            { year: 1979, male: 1693272, female: 1674945, both: 3368217 },
            { year: 1981, male: 1729354, female: 1714051, both: 3443405 },
            { year: 1986, male: 1769690, female: 1770953, both: 3540643 },
            { year: 1991, male: 1753418, female: 1772301, both: 3525719 },
            { year: 1996, male: 1800232, female: 1825855, both: 3626087 },
            { year: 2002, male: 1946164, female: 1971039, both: 3917203 },
            { year: 2006, male: 2121171, female: 2118677, both: 4239848 }
        ];

        // the store
        var store = Ext.create( 'Ext.data.Store', {
            fields: [
                { name: 'year', type: 'int'},
                { name: 'male', type: 'int'},
                { name: 'female', type: 'int'},
                { name: 'both', type: 'int'}
            ],
            data: cendata
        });

        var pieChartStore = Ext.create( 'Ext.data.Store', {
            fields: [
                { name: 'name', type: 'string'},
                { name: 'value', type: 'int'},
                { name: 'year', type: 'int'}
            ]
        });

        var updatePieChartStore = function( female, male, year ){
            pieChartStore.removeAll();
            pieChartStore.add({
                name: 'Female',
                value: female,
                year: year
            },{
                name: 'Male',
                value: male,
                year: year
            });
        };

        // the top chart
        var topChart = Ext.create('Ext.chart.Chart', {
            region: 'north',
            margin: '0 0 10 0',
            height: 250,
            cls: 'x-panel-body-default',
            shadow: true,
            animate: true,
            store: store,
            axes: [{
                title: 'Population',
                type: 'Numeric',
                position: 'left',
                fields: ['both'],
                minimum: 2000000
            },{
                type: 'Numeric',
                position: 'bottom',
                fields: ['year'],
                label: {
                    renderer: function( v ){
                        return '';
                    }
                }
            }],
            series: [{
                type: 'column',
                highlightCfg: '#000',
                axis: 'left',
                xField: 'year',
                yField: 'both',
                label: {
                    contrast: true,
                    display: 'insideEnd',
                    field: 'year',
                    color: '#000',
                    orientation: 'vertical',
                    'text-anchor': 'middle'
                },
                tips: {
                    trackMouse: true,
                    width: 150,
                    renderer: function( storeItem, item ){
                        this.setTitle(
                            'Year: ' + storeItem.get('year') + '<br />' +
                            'Population: ' + storeItem.get('both')
                        );
                    }
                },
                listeners: {
                    itemmouseup: function( item ){
                        var series = topChart.series.get(0);
                        // select the grid item
                        grid.getSelectionModel().select(Ext.Array.indexOf(series.items, item));
                        
                        var female = item.storeItem.data.female,
                            male = item.storeItem.data.male,
                            year = item.storeItem.data.year;

                        updatePieChartStore( female, male, year );
                    }
                }
            }]
        });

        // the pie chart
        var pieChart = Ext.create( 'Ext.chart.Chart', {
            store: pieChartStore,
            animate: true,
            title: 'Male : Female',
            width: 300,
            height: 200,
            series: [{
                type: 'pie',
                angleField: 'value',
                showInLegend: true,
                tips: {
                    trackMouse: true,
                    width: 70,
                    renderer: function( storeItem, item ){
                        this.setTitle(
                            storeItem.get('name') + '<br />' +
                            storeItem.get('value')
                        );
                    }
                },
                label: {
                    field: 'name',
                    display: 'rotate',
                    contrast: true,
                    font: '11px Arial',
                    renderer: function( v ){
                        // get the record
                        var record = pieChartStore.findRecord( 'name', v );
                        
                        // update the title
                        // this line is calling an "Maximum call stack size exceeded" error.  Commenting out for now.
                        // pieChart.up().setTitle( 'Male v Female for ' );
                        
                        // return the label
                        return v + '\n' + record.get('value') ;
                    }
                }
            }]
        });

        // the grid
        var grid = Ext.create( 'Ext.grid.Panel', {
            region: 'west',
            title: 'Population Data',
            width: 450,
            margin: '0 10 0 0',
            store: store,
            columns: [{
                text: 'Year',
                dataIndex: 'year',
                flex: 1
            },{
                text: 'Male',
                dataIndex: 'male',
                flex: 1
            },{
                text: 'Female',
                dataIndex: 'female',
                flex: 1
            },{
                text: 'Both',
                dataIndex: 'both',
                flex: 1
            }],
            listeners: {
                selectionchange: function( model, records ){
                    if( !records[0] ) return false;

                    var selected = records[0];
                    var male = selected.data.male,
                        female = selected.data.female,
                        year = selected.data.year;
                    // update the pieChartStore
                    updatePieChartStore( female, male, year );
                    
                }
            }
        });

        // create the main view
        Ext.create('Ext.panel.Panel', {
            title: 'Irish Population 1901 - 2006',
            frame: true,
            width: 800,
            height: 550,
            renderTo: renderTo,
            layout: 'border',
            padding: 10,
            items: [ topChart, grid, {
                xtype: 'panel',
                title: 'Male : Female',
                region: 'center',
                items: [pieChart]
            }]
        });
    }; // irishPopulationChart


    // get a reference to window
    var root = this;

    // check if the window.howlin.apps object exists
    if( !root.howlin ) root.howlin = {};
    if( !root.howlin.apps )root.howlin.apps = {};

    // store the app in root.howlin.apps
    root.howlin.apps.irishPopulationChart = irishPopulationChart;

})();