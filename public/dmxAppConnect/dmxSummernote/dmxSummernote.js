/*!
 DMXzone Summernote
 Version: 1.0.4
 (c) 2021 DMXzone.com
 @build 2021-01-14 11:50:37
 */
dmx.Component("summernote",{constructor:function(t,e){this.onBlur=this.onBlur.bind(this),this.onChange=this.onChange.bind(this),this.onEnter=this.onEnter.bind(this),this.onFocus=this.onFocus.bind(this),this.onInit=this.onInit.bind(this),this.onMediaDelete=this.onMediaDelete.bind(this),this.setValue=this.setValue.bind(this),this.config={popover:$.summernote.options.popover},this.callbacks={callbacks:{onBlur:this.onBlur,onChange:this.onChange,onEnter:this.onEnter,onFocus:this.onFocus,onInit:this.onInit,onMediaDelete:this.onMediaDelete}},this.plugins={},this.buttons={buttons:{}},dmx.BaseComponent.call(this,t,e)},initialData:{disabled:!1,value:""},attributes:{value:{type:String,default:""},disabled:{type:Boolean,default:!1},config:{type:Object,default:{}},height:{type:Number,default:null},"min-height":{type:Number,default:null},"max-height":{type:Number,default:null},autofocus:{type:Boolean,default:!1},lang:{type:String,default:"en-US"},"air-mode":{type:Boolean,default:!1},toolbar:{type:Array,default:null},"toolbar-image":{type:Array,default:null},"toolbar-link":{type:Array,default:null},"toolbar-table":{type:Array,default:null},"toolbar-air":{type:Array,default:null},"blockquote-breaking-level":{type:Number,default:2},"style-tags":{type:Array,default:null},"font-names":{type:Array,default:null},"font-names-ignore-check":{type:Array,default:null},"font-size-units":{type:Array,default:null},"line-heights":{type:Array,default:null},placeholder:{type:String,default:null},"dialogs-in-body":{type:Boolean,default:!1},"dialogs-fade":{type:Boolean,default:!1},"disable-drop":{type:Boolean,default:!1},"disable-shortcuts":{type:Boolean,default:!1},"disable-tab":{type:Boolean,default:!1},"disable-spellcheck":{type:Boolean,default:!1},"disable-grammar":{type:Boolean,default:!1}},methods:{disable:function(){this.editor.invoke("disable"),this.set("disabled",!0)},empty:function(){this.editor.invoke("empty")},enable:function(){this.editor.invoke("enable"),this.set("disabled",!1)},insertText:function(t){this.editor.invoke("insertText",t)},pasteHTML:function(t){this.editor.invoke("pasteHTML",t)},redo:function(){this.editor.invoke("redo")},reset:function(){this.editor.invoke("reset")},setValue:function(t){this.setValue(t)},undo:function(){this.editor.invoke("undo")},status:function(t){this.editor.layoutInfo.editor.find(".note-status-output").html(t)},info:function(t){this.editor.layoutInfo.editor.find(".note-status-output").html('<div class="alert alert-info">'+t+"</div>")},success:function(t){this.editor.layoutInfo.editor.find(".note-status-output").html('<div class="alert alert-success">'+t+"</div>")},warning:function(t){this.editor.layoutInfo.editor.find(".note-status-output").html('<div class="alert alert-warning">'+t+"</div>")},danger:function(t){this.editor.layoutInfo.editor.find(".note-status-output").html('<div class="alert alert-danger">'+t+"</div>")},invoke:function(t,e){this.editor.invoke(t,e)}},events:{blur:Event,change:Event,changed:Event,enter:Event,focus:Event,init:Event,input:Event,updated:Event,buttonclick:Event,mediadelete:Event},onBlur:function(){if(this.orgValue!=this.editor.code()){this.dispatchEvent("change");var t=this;dmx.nextTick(function(){t.dispatchEvent("changed")})}this.dispatchEvent("blur")},onChange:function(){this.updated(),this.dispatchEvent("input")},onEnter:function(){this.dispatchEvent("enter")},onFocus:function(){this.orgValue=this.editor.code(),this.dispatchEvent("focus")},onInit:function(){this.dispatchEvent("init")},onMediaDelete:function(t){var e=$(t[0]).attr("src");this.dispatchEvent("mediadelete",null,{src:e})},toCamelCase:function(t){return t.replace(/-(\w)/g,function(t,e){return e.toUpperCase()})},$parseAttributes:function(t){var n=this;dmx.BaseComponent.prototype.$parseAttributes.call(this,t),dmx.dom.getAttributes(t).forEach(function(o){"plugin"==o.name&&n.$addBinding(o.value,function(t){t?n.plugins[this.toCamelCase(o.argument)]=$.extend({},$.summernote.options[o.argument],t):delete n.plugins[o.argument],n.plugins.updated=!0}),"button"==o.name&&n.$addBinding(o.value,function(e){if(e&&e.icon){var i=this.toCamelCase(o.argument);n.buttons.buttons[i]=function(t){return $.summernote.ui.button({contents:'<i class="'+e.icon+'"/>',tooltip:e.tooltip||"",click:function(){"string"==typeof e.click&&dmx.parse(e.click,n),n.dispatchEvent("buttonclick",null,{editor:n.name,button:i})}}).render()},n.buttons.updated=!0}})})},render:function(t){this.$node=t},mounted:function(){var t="TEXTAREA"==this.$node.tagName?this.$node.value.trim():this.$node.innerHTML.trim();-1!==t.indexOf("{{")&&this.$addBinding(t,this.setValue),this.update({})},update:function(t){(this.plugins.updated||this.buttons.updated||!dmx.equal(t,this.props))&&(delete this.plugins.updated,delete this.buttons.updated,t.value!=this.props.value&&this.setValue(this.props.value),this.editor&&this.editor.destroy(),this.initEditor())},updated:function(){var t=this.data.value;if(this.editor)$(this.$node).summernote("isEmpty")?this.set("value",""):this.set("value",this.editor.code());else{var e="TEXTAREA"==this.$node.tagName?this.$node.value.trim():this.$node.innerHTML.trim();this.set("value",e)}this.updating||t==this.data.value||(this.isUpdated=!0,dmx.nextTick(function(){this.isUpdated=!1,this.dispatchEvent("updated")},this))},beforeDestroy:function(){this.editor.destroy()},setValue:function(t){this.editor?t?this.editor.code(t):this.editor.empty():"TEXTAREA"==this.$node.tagName?this.$node.value=t:this.$node.innerHTML=t,this.updated()},initEditor:function(){var t=dmx.clone(this.config);t.height=this.props.height,t.minHeight=this.props["min-height"],t.maxHeight=this.props["max-height"],t.focus=this.props.autofocus,t.lang=this.props.lang,t.airMode=this.props["air-mode"],t.placeholder=this.props.placeholder,t.dialogsInBody=this.props["dialogs-in-body"],t.dialogsFade=this.props["dialogs-fade"],t.disableDragAndDrop=this.props["disable-drop"],t.shortcuts=!this.props["disable-shortcuts"],t.tabDisable=this.props["disable-tab"],t.spellCheck=!this.props["disable-spellcheck"],t.disableGrammar=this.props["disable-grammar"],t.blockquoteBreakingLevel=this.props["blockquote-breaking-level"],Array.isArray(this.props.toolbar)&&(t.toolbar=this.props.toolbar.filter(function(t){return t.length})),Array.isArray(this.props["toolbar-image"])&&(t.popover=t.popover||{},t.popover.image=this.props["toolbar-image"].filter(function(t){return t.length})),Array.isArray(this.props["toolbar-link"])&&(t.popover=t.popover||{},t.popover.link=this.props["toolbar-link"].filter(function(t){return t.length})),Array.isArray(this.props["toolbar-table"])&&(t.popover=t.popover||{},t.popover.table=this.props["toolbar-table"].filter(function(t){return t.length})),Array.isArray(this.props["toolbar-air"])&&(t.popover=t.popover||{},t.popover.air=this.props["toolbar-air"].filter(function(t){return t.length})),Array.isArray(this.props["style-tags"])&&(t.styleTags=this.props["style-tags"]),Array.isArray(this.props["font-names"])&&(t.fontNames=this.props["font-names"]),Array.isArray(this.props["font-names-ignore-check"])&&(t.fontNamesIgnoreCheck=this.props["font-names-ignore-check"]),Array.isArray(this.props["font-size-units"])&&(t.fontSizeUnits=this.props["font-size-units"]),Array.isArray(this.props["line-heights"])&&(t.lineHeights=this.props["line-heights"]),$.summernote.lang[t.lang]||console.error('Summernote "'+t.lang+'" lang file must be included.'),$.extend(!0,t,this.props.config,this.plugins,this.buttons,this.callbacks),$(this.$node).summernote(t),this.editor=$(this.$node).data("summernote"),this.editor.layoutInfo.statusbar.find(".note-status-output").remove(),this.props.disabled&&(this.editor.disable(),this.set("disabled",!0)),this.$node.hasAttribute("dmxDomId")&&this.editor.layoutInfo.editor.attr("dmxDomId",this.$node.getAttribute("dmxDomId"))}});
//# sourceMappingURL=../maps/dmxSummernote.js.map
