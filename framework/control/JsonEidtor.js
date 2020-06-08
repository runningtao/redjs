Rsd.define('Rsd.control.JsonEidtor', {
    extend: 'Rsd.container.Dialog',
    requires: [
        'Rsd.control.Grid',
        'Rsd.control.Label',
        'Rsd.control.Button'
    ],
    xtype: 'json-editor',
    width:300,
    height:550,
    layout:'fit',
    items:[
        {
            xtype: 'grid',
            height:'100%',
            overflow:'auto',
            style:{backgroundColor:'rgba(255, 255, 255, 0.25)'},
            border:false,
            columns:[{text:'名称',width:80,dataIndex:'name'},{text:'值',width:100,dataIndex:'value',editable:true},{dataIndex:'op',width:20}],
            rowdblclick:'pr_rowdblclick',
            margin:'0 0 10 0',
            flex:200
        }
    ],
    onChanged:null,
    constructor: function JsonEidtor(config) {
        config = config || {};
        this.apply(config);
    },
    /*
    * */
    loadData:function loadData(json) {
        var _json = json||{};
        this.json = _json;
        var _grid = this.items[0];
        var _list = [];
        for (var i in _json) {
            _list.push({name: i, value: _json[i], op: Rsd.isObject(_json[i]) ? '...' : ''});
        }

        _grid.loadData(_list);
    },
    pr_rowdblclick:function pr_rowdblclick(row,data) {
        var me = this;
        var grid = this.items[0];
        var rowIndex = data.rowIndex;
        if(row['value'] instanceof  Element)
        {
            return;
        }
        if(Rsd.isObject(row['value']))
        {
            Rsd.create('Rsd.control.JsonEidtor',{}).showDialog().loadData(row['value']);
        }
        else
        {
            grid.editRow(rowIndex, true,1,Rsd.widget(row['xtype']||'text',{
                margin:'3 5 3 5',
                width:'100%',
                height:'90%',
                name:row['name'],
                textChanged:function (sender,event) {
                    me.json[sender.name] = sender.getValue();
                    me.funApplyByIOC(me.onChanged,[me.json])
                },
            }));
        }
    }
});
