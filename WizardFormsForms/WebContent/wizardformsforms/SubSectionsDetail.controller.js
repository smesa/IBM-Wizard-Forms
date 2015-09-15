sap.ui.controller("wizardformsforms.SubSectionsDetail", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
	},

	_handleRouteMatched: function(evt){
		if(evt.getParameter("name") !== "SubSectionsDetail"){
			return;
		}
		this.formIndex = evt.getParameter("arguments").formIndex;
		this.versionIndex = evt.getParameter("arguments").versionIndex;
		this.sectionIndex = evt.getParameter("arguments").sectionIndex;
		this.subSectionIndex = evt.getParameter("arguments").subSectionIndex;

		
		var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/subsections/' + this.subSectionIndex + '/');
		this.getView().setBindingContext(context,'forms');
		
	},

	goBack: function(){
		window.history.go(-1);
	},	
	
	deleteField: function(evt){
		
		
		var that = this;
		
		var oTable    = sap.ui.getCore().byId('oTableFields');
		var oListItem = evt.getParameters().listItem;
		var oPath     = oListItem.getBindingContextPath();
		var oId       = parseInt(oPath.substring(oPath.lastIndexOf('/') +1));		
		var app       = sap.ui.getCore().byId("app");
		
		try {  		
			var context = app.getModel('forms').getData('/' + this.formIndex + '/versions/' + this.versionIndex + '/sections/' + this.sectionIndex + '/subsections/' + this.subSectionIndex + '/fields/' + oId + '/');
		
		} catch(ex){  
			window.history.go(-1);
		}  
		
		var dialog = new sap.m.Dialog({
	      title: 'Confirmación',
	      type: 'Message',
	      content: new sap.m.Text({ text: '¿Esta seguro de eliminar este elemento?' }),
	      beginButton: new sap.m.Button({
	        text: 'Eliminar',
	        press: function () {
	        	
	          context[that.formIndex].versions[that.versionIndex].sections[that.sectionIndex].subsections[that.subSectionIndex].fields.splice(oId,1);		
	    	  sap.ui.getCore().byId("app").getModel('forms').setData(context);  
    		  sap.m.MessageToast.show('Elemento eliminado');
    		  
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
	
	addField: function(evt){
		
		var contextfield = JSON.parse(JSON.stringify(sap.ui.getCore().byId("app").getModel('fields').getData('/')));
		var oModel = new sap.ui.model.json.JSONModel(contextfield);
		
		this.getView().setModel(oModel,'fields');	 
		
		
		var fields   	=  this.getView().getModel('fields').getData('/');
		var sections 	=  sap.ui.getCore().byId("app").getModel('forms').getData('/')[0].versions[this.versionIndex].sections;
		var fieldsUsed 	=  [];
	
		
		// Saco los campos que se han usado en otras secciones y subsecciones
		for(i = 0; i < sections.length; i++){	

			for(j = 0; j < sections[i].fields.length; j++){				
				fieldsUsed.push(sections[i].fields[j]);				
			}	

			for(j = 0; j < sections[i].subsections.length; j++){	

				for(x = 0; x < sections[i].subsections[j].fields.length; x++){				
					fieldsUsed.push(sections[i].subsections[j].fields[x]);				
				}				
			}			
		}
		
		
		// Recorro los campos para eliminar los que estan usados en las secciones

		var field_aux = [];

		for(i = 0; i < fields.length; i++){

			var found = false;
			
			for(j = 0; j < fieldsUsed.length; j++){
				
				// Existe lo elimino del array
				if(fields[i].fieldid == fieldsUsed[j].fieldid){	
					found = true
				}				
			}	

			if(found == false){
				field_aux.push(fields[i])
			}		
		}

		
		var oModel2 = new sap.ui.model.json.JSONModel(field_aux);
		this.getView().setModel(oModel2,'fields');		

		
		var that = this; 
		
		
		// Formularios
		var oInfoField = new sap.ui.layout.VerticalLayout({
			width: "100%",			
			content:[
					new sap.m.Bar({
						contentMiddle: [
							new sap.m.SearchField({
								liveChange:function(evt,obj){
									var filters = [];
									var query = evt.getParameter("newValue");
									if (query && query.length > 0) {
										var filter = new sap.ui.model.Filter("fieldtecname", sap.ui.model.FilterOperator.Contains, query);
										filters.push(filter);
									}
									var binding = sap.ui.getCore().byId('listFieldSection').getBinding("items");
									binding.filter(filters);
								},
							    width:"100%",
							    placeholder:"Filtro de elementos",
							}),							
						]
					}),
					new sap.m.List({
						id: "listFieldSection",	
						mode: sap.m.ListMode.MultiSelect,
					}).bindItems({
						path: "fields>/",
						template: new sap.m.StandardListItem({
							icon:"{fields>fieldicon}",
							title:"{fields>fieldtecname}",
							description: "{fields>fieldtitle}"
						})					
					})
					
			]
		}).addStyleClass("layPadding10");
	
		var dialog = new sap.m.Dialog({
		      title: 'Seleccione los elementos para la sección',
		      verticalScrolling: true,
			  contentHeight: "400px",
			  contentWidth: "500px",
		      content:[oInfoField],
		      beginButton: new sap.m.Button({
		          text: 'Agregar',
		          press: function (evt) {	 
		        	  
		        	  var model =  sap.ui.getCore().byId("app").getModel('forms').getContext('/' + that.formIndex + '/sections/' + that.sectionIndex);
		        	  
		      		  var path  =  evt.getSource().getBindingContext('forms').getPath();	
		      		  
		      		  var data  =  model.getProperty(path);		        	
		      		  
		        	  var items =  sap.ui.getCore().byId('listFieldSection').getSelectedItems();	 
		        	  
		        	  for	(index = 0; index < items.length; index++) {		        		  
	        			
		        			var fieldIndx = items[index].getBindingContextPath().substring(items[index].getBindingContextPath().lastIndexOf('/') + 1,items[index].getBindingContextPath().length)
		        		  	var field 	  = that.getView().getModel('fields').getData('/')[fieldIndx];

		        		  	for( i = 0; i < field.values.length; i++){
		        		  		field.values[i].status = true;
		        		  	}

		        		  	field.isrequired = false;
		        		  	
		        			data.fields.push(field)
		        	  }	
		        	  
		      		  sap.ui.getCore().byId("app").getModel('forms').setData(sap.ui.getCore().byId("app").getModel("forms").getData());    	
		          	  sap.m.MessageToast.show('Los elementos fueron agregados');  
		        	  
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
  		var data         = model.getProperty(model.sPath);  	
  		var jsonsection  = [];
  		
  		
  		// Conversion a json
  		for(i = 0; i < data.sections.length; i++){ 			
  			
  			var fields       = "";
  			
  			for(j = 0; j < data.sections[i].fields.length; j++ ){	
  				fields = data.sections[i].fields[j].fieldid + '/' + fields  ;
  			}
  			
  			jsonsection.push({sectionid:data.sections[i].sectionid,sectiontitle:data.sections[i].sectiontitle, sectioncolumn: data.sections[i].sectioncolumn,sectionfields:fields})
 			
  		}
  		jsonsection = (JSON.stringify(jsonsection)).replace(/{"/g, '{').replace(/,"/g, ',').replace(/":/g, ':');
  		
  		var oModel       = new myJSONModel;
  		
  		var oParameters = {
  		   "formid" 			: data.formid,
           "formtitle" 		    : data.formtitle,
           "verformid"          : data.verformid,
           "descpver"			: data.descpver,
           "sections" 			: jsonsection
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
		var model = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.formIndex);	
		var dataVal  = model.getProperty(model.sPath);  	
		
		// Creo objeto del modelo
		var oModel = new myJSONModel;		
		
		// Parametros del registro
		var oParameters = {
	           "formid" : dataVal.formid
		};
		
		
		var dialog = new sap.m.Dialog({
		      title: 'Confirmación',
		      type: 'Message',
		      content: new sap.m.Text({ text: '¿Esta seguro de eliminar este formulario?' }),
		      beginButton: new sap.m.Button({
		        text: 'Aceptar',
		        press: function () {	        	

		    		// Llamo el metodo POST para crear los datos
		    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/" + dataVal.fieldid, function(oData){
		    			
		    			sap.m.MessageToast.show('El formulario fue eliminado con exito');		    			
		    			
		    			// Consulto los datos actualizados			
		    			var oModel2 = new myJSONModel;
		    			
		    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
		    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);		
		    				that.router.navTo("Blank");
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
	
	fieldPress: function(oEvent){		
		
		var oTable       = sap.ui.getCore().byId('oTableFields');
		var oListItem    = oEvent.getParameters().listItem;
		var oPath        = oListItem.getBindingContextPath();
		var start        = oPath.lastIndexOf('/') + 1;
		var fieldIndex 	 = oPath.substring(start,oPath.length);		
		this.router.navTo("SubFieldDetail",{formIndex:this.formIndex, versionIndex: this.versionIndex, sectionIndex: this.sectionIndex,subSectionIndex: this.subSectionIndex, fieldIndex: fieldIndex});
	},
	

});