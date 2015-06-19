sap.ui.controller("wizardformsforms.FormsDetail", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "FormsDetail"){
			return;
		}
		
		this.formIndex = evt.getParameter("arguments").formIndex;
		this.versionIndex = evt.getParameter("arguments").versionIndex;	
		var app = sap.ui.getCore().byId("app");		
		
		try {  		
			var context = app.getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex);		
			this.getView().setBindingContext(context,'forms');
		
		} catch(ex){  
			window.history.go(-1);
		}  
	},	
	
	selectedTab: function(evt){
		
		var oTab  		= sap.ui.getCore().byId('TabForm');
		var oPreview	= sap.ui.getCore().byId('oItemBarPreviewForm');
		var sel         = oTab.getSelectedKey();
		
		if(sel === 'preview'){
			
			var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.formIndex + '/versions/' + this.versionIndex);
	  		var path         = evt.getSource().getBindingContext('forms').getPath();			
	  		var data         = model.getProperty(path);  
			
			var iFrame 		= new sap.ui.core.HTML({
	     		preferDOM:true,
	     		content:"<iframe id='iframeid' src='./preview/index.html#/get/" + data.formid + "/" + data.verformid + "' width='100%' height='" + document.body.clientHeight + "' zoom='0.5' position='fixed' frameborder='0' border='none'></iframe>"
			})		
					
			oPreview.removeAllContent();
			oPreview.addContent(iFrame);
			
		}
		
	},

	sectionPress: function(oEvent){		
		
		var oTable       = sap.ui.getCore().byId('oTableSections');
		var oListItem    = oEvent.getParameters().listItem;
		var oPath        = oListItem.getBindingContextPath();
		var start        = oPath.lastIndexOf('/') + 1;
		var sectionIndex = oPath.substring(start,oPath.length);		
		this.router.navTo("SectionsDetail",{formIndex:this.formIndex, versionIndex: this.versionIndex, sectionIndex: sectionIndex});
	},
	
	deleteSection: function(evt){
		
		
		var that = this;
		
		var oTable    = sap.ui.getCore().byId('oTableSections');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));		
		var app       = sap.ui.getCore().byId("app");
		
		try {  		
			var context = app.getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + oId + '/');
		
		} catch(ex){  
			window.history.go(-1);
		}  
		
		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar esta sección?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {
	        	
	          context[that.formIndex].versions[that.versionIndex].sections.splice(oId,1);		
	    	  sap.ui.getCore().byId("app").getModel('forms').setData(context);  
    		  sap.m.MessageToast.show('Sección eliminada');    		  
	          dialog.close();
	        }
	      }),
	      endButton: new sap.m.Button({
	        text: 'Cancelar',
	        press: function () {
	          dialog.close();
	        }
	      }),
	      afterClose: function() {
	        dialog.destroy();
	      }
	    });

	    dialog.open();
		
	},
	
	addSection: function(evt){
		
		var that = this; 
		// Formularios
		var oInfoSection = new sap.ui.layout.VerticalLayout({
			width: "100%",			
			content:[
		         	 new sap.m.Label({}),
			         new sap.m.Label({text:"Titulo de la sección"}),
			         new sap.m.Input({id:"oSectionTitle",required: true}),
			         new sap.m.Label({text:"Nro de columnas de la sección"}),
			         new sap.m.ComboBox({
			        	  id:"oSectionColumns",
			        	  selectedKey:"1",
						  width: "100%",
						  items: [
			                          new sap.ui.core.ListItem({text: "1 Columna",key:"1"}).bindProperty("text","StatusText").bindProperty("key","Status"),
			                          new sap.ui.core.ListItem({text: "2 Columnas",key:"2"}),
			                          new sap.ui.core.ListItem({text: "3 Columnas",key:"3"}),
			                          new sap.ui.core.ListItem({text: "4 Columnas",key:"4"})
			                     ]
			        }).bindProperty("value","StatusText")
			         
			]
		}).addStyleClass("layPadding10");
	
		var dialog = new sap.m.Dialog({
		      title: 'Creación de nueva sección',
		      content:[oInfoSection],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {
		        	
		        	  
		        	var oTitle    = sap.ui.getCore().byId("oSectionTitle");	
		        	var oColumns  = sap.ui.getCore().byId("oSectionColumns").getSelectedItem().getKey();
		        	
		      		var model = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.formIndex);
		      		var path  = evt.getSource().getBindingContext('forms').getPath();			
		      		var data  = model.getProperty(path);
		      			
		      		data.sections.push({
		      			sectiontitle: 	sap.ui.getCore().byId("oSectionTitle").getValue(),
		      			sectioncolumn:  sap.ui.getCore().byId("oSectionColumns").getSelectedItem().getKey()	,
		      			fields: []
		      		})
		      		
		      		var forms = sap.ui.getCore().byId("app").getModel("forms").getData();		
		      		sap.ui.getCore().byId("app").getModel('forms').setData(forms);    	
		          	sap.m.MessageToast.show('Seccion creada');  
		        	  
		            dialog.close();
		          }
		        }),
		        endButton: new sap.m.Button({
		          text: 'Cerrar',
				  type: "Reject",
		          press: function () {
		            dialog.close();
		          }
		        }),
		        afterClose: function() {
		          dialog.destroy();
		        }
		    });
		    this.getView().addDependent(dialog);
		    dialog.open();
		
	},
	
	saveData: function(evt){
		
		var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.formIndex + '/versions/' + this.versionIndex);
  		var path         = evt.getSource().getBindingContext('forms').getPath();			
  		var data         = model.getProperty(path);  	
  		var jsonsection  = [];
  		var jsonenha     = [];
  		
  		
  		// Conversion a json
  		for(i = 0; i < data.sections.length; i++){ 			
  			
  			var fields       = "";
  			
  			for(j = 0; j < data.sections[i].fields.length; j++ ){	
  				fields = data.sections[i].fields[j].fieldid + '/' + fields  ;
  			}
  			
  			jsonsection.push({sectionid:data.sections[i].sectionid,sectiontitle:data.sections[i].sectiontitle, sectioncolumn: data.sections[i].sectioncolumn,sectionfields:fields})
 			
  		}
  		
  		jsonsection = (JSON.stringify(jsonsection)).replace(/{"/g, '{').replace(/,"/g, ',').replace(/":/g, ':');
  		
  		// Conversion a json
  		for(i = 0; i < data.enhancement.length; i++){ 			
  			
	
  			jsonenha.push({method:data.enhancement[i].method,name:data.enhancement[i].name,active:data.enhancement[i].active})
 			
  		}
  		
  		jsonenha = (JSON.stringify(jsonenha)).replace(/{"/g, '{').replace(/,"/g, ',').replace(/":/g, ':').replace(/true/g, '"true"').replace(/false/g, '"false"');
  		
  		
  		
  		var oModel       = new myJSONModel;
  		
  		var oParameters = {
           "formid" 			: data.formid,
           "formtitle" 		    : data.formtitle,
           "verformid"          : data.verformid,
           "descpver"			: data.descpver,
           "sections" 			: jsonsection,
           "enhancement"		: jsonenha
 		};
  		
  		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro de guardar estos cambios?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	

		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    			
		    			sap.m.MessageToast.show('Los datos fueron guardados con exito');
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);
		    			},function(){
		    				sap.m.MessageToast.show('Error creando el elemento');
		    			});		
		    			
		    		},function(){
		    			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		    		},oParameters, true,'PUT');	
	    		  
		          dialog.close();
		        }
		      }),
		      endButton: new sap.m.Button({
		        text: 'Cancelar',
		        press: function () {
		          dialog.close();
		        }
		      }),
		      afterClose: function() {
		        dialog.destroy();
	      }
	    });

	    dialog.open();	
		
	},
	
	deleteData: function(evt){	
		
		var that = this;
		var model = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.fieldIndex + '/');		
		var path  = evt.getSource().getBindingContext('forms').getPath();			
		var dataVal  = model.getProperty(path);		
		
		// Creo objeto del modelo
		var oModel = new myJSONModel;		
		
		// Parametros del registro
		var oParameters = {
	           "formid"    : dataVal.formid,
	           "verformid" : dataVal.verformid
		};
		
		
		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro de eliminar esta version del formulario?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	

		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/" + dataVal.fieldid, function(oData){
		    			
		    			sap.m.MessageToast.show('El formulario fue eliminado con exito');	
		    			that.router.navTo("Blank");
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);		
		    				
		    			},function(){
		    				sap.m.MessageToast.show('Error eliminando el formulario');
		    			});			    			
		    			
		    			
		    		},function(){
		    			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
		    		},oParameters, false,'DELETE');	
	    		  
		          dialog.close();
		        }
		      }),
		      endButton: new sap.m.Button({
		        text: 'Cancelar',
		        press: function () {
		          dialog.close();
		        }
		      }),
		      afterClose: function() {
		        dialog.destroy();
	      }
	    });

	    dialog.open();
	},

});