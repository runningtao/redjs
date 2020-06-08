/**
 * Created by seeker910 on 2014/8/22.
 */
Rsd.define('Rsd.control.ListView', {
    extend: 'Rsd.control.Component',
    requires: ['Rsd.control.ListViewItem'],
    xtype: 'list-view',
    ctrlTagName: 'ol',
    cls: 'x-list-view',
    readOnly: false,
    dataSource: [],
    /**
    * @description 键值字段名
     * */
    itemKeyMember:'id',
    itemXtype: null,
    itemClick: null,
    itemDblClick: null,
    /*
    * */
    itemSelectedCls:'',
    /**
    * @description  item  默认样式 ,即dom li 样式
    * */
    //itemStyle: {height: '30px', lineHeight: '30px',float:'left'},
    //
    itemCls: null,
    /*
    * 启用hover样式
    * */
    itemHover: false,
    /**
     *
     * @description items 布局方式
     * */
    //layout:'hbox',
    items:[],
    /*
     none:不使用项目符号
     disc:实心圆，默认值
     circle:空心圆
     square:实心方块
     decimal:阿拉伯数字
     lower-roman:小写罗马数字
     upper-roman:大写罗马数字
     lower-alpha:小写英文字母
     upper-alpha:大写英文字母
     */
    listType: 'none',
    /*
    * */
    label: {position: 'top', align: 'center', height: 40},

    /*
    *
    * */
    constructor: function ListView(config) {
        config = config || {};

        this.apply(config);
    },
    initComponentEx: function initComponentEx() {
        this.callParent();
        this.ctrl.style.listStyleType = this.listType;
        this.ctrl.style.margin = '0px';
        this.setElAttribute('dom','layout',this.layout);

    },
    /**
     *@description control控件加载数据 无回调
     * */
    loadData: function loadData(data) {

        this.dataSource = data || this.dataSource;

        if (Rsd.isArray(this.dataSource)) {
            this.removeAll();
            this.addItems(this.dataSource);
        }
        return this;
    },
    /**
    * @param key {int|string} int type is index value,string type is key value.
    * */
    select: function select(key,scroll)
    {
        if(Rsd.isString(key))
        {
            var list = Rsd.select(this.ctrl,'[id='+key+']');
           if(list.length > 0)
            {
                list[0].click();
            }
            return this;
        }
        if(Rsd.isNumber(key) && key < 0)
        {
            var list = this.ctrl.querySelectorAll('.' + this.itemSelectedCls);
            for(var i in list)
            {
                this.removeCls(list[i],this.itemSelectedCls);
            }
            return this;
        }
        if(Rsd.isNumber(key) &&  key < this.items.length)
        {
            var _index = key % this.items.length ;
            this.items[_index].ctrl.click();
            return this;
        }
        return this;
    },
    /**
     * @description 选中节点滚动到可视区
     * */
    scrollCurrentIntoView:function(key,top)
    {
        var dom = document.getElementById(key);
        if(dom)
        {
            dom.scrollIntoView(top);
        }
    },
    /*
    * */
    removeAll:function () {
        if(this.ctrl)
        {
            $(this.ctrl).empty();
        }
        this.items = [];
    },
    /**
    * @public
    * */
    addItems:function addItems(items) {

        if(Rsd.isArray(items))
        {
            for(var i in items)
            {
                var _item = this.newItem(items[i]);
                this.ctrl.appendChild(_item.ctrl);
                this.items.push(_item);
            }
            return this;
        }

        var _item = this.newItem(items);
        this.ctrl.appendChild(_item.ctrl);
        this.items.push(_item);
        return this;
    },
    /**
    * @private
    * */
    newItem:function newItem(item)
    {
        var _item = item||{};
        var me = this;


        if(!(_item instanceof Rsd.control.ListViewItem) )
        {
             _item = Rsd.create('Rsd.control.ListViewItem',{key:item[me.itemKeyMember],content:item,style:me.itemStyle,hover:me.itemHover,parent:me});
        }

        var el = _item.ctrl;

        $(el).click(function(){
            if(!Rsd.isEmpty(me.itemSelectedCls)) {

                var list = me.ctrl.querySelectorAll('.' + me.itemSelectedCls);
                for (var i in list) {
                    me.removeCls(list[i], me.itemSelectedCls);
                }

                me.addCls(this, me.itemSelectedCls);
            }
            var _click =  item.click || me.itemClick;
            me.funApplyByIOC(_click,[_item]);

        });

        $(el).dblclick(function(){

            if(!Rsd.isEmpty(me.itemSelectedCls))
            {
                var list = me.ctrl.querySelectorAll('.' + me.itemSelectedCls);
                for(var i in list)
                {
                    me.removeCls(list[i],me.itemSelectedCls);
                }

                me.addCls(this,me.itemSelectedCls);
            }


            var _dblClick = item.dblClick || me.itemDblClick;
            me.funApplyByIOC(_dblClick,[_item]);
        });

       return _item;
    }

},function(type){

    var _layoutGetter = function () {
        return this.__layout||'hbox';
    };

    var _layoutSetter = function (value) {
        this.__layout = value;
    };
    this.defineProperty(type,"layout", _layoutGetter, _layoutSetter,false);


    var _itemStyleGetter = function () {

        if(!this.hasOwnProperty('__itemStyle'))
        {
            switch (this.layout) {
                case 'hbox':
                    this.__itemStyle = {"height": '30px',"lineHeight": '30px',"float":'left'};
                    break;
                case 'vhox':
                    this.__itemStyle = {"height": '30px',"lineHeight": '30px'};
                    break;
            }

        }
        return this.__itemStyle;
    };

    var _itemStyleSetter = function (value) {

        this.__itemStyle = Rsd.apply(this.itemStyle,value||{});
    };
    this.defineProperty(type,"itemStyle", _itemStyleGetter, _itemStyleSetter,true);

});