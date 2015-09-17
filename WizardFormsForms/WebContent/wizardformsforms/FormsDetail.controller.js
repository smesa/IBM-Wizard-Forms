sap.ui.controller("wizardformsforms.FormsDetail", {

	onInit: function() {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched,this);
		
		var view = sap.ui.getCore();
		var view = sap.ui.getCore();
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
		
		if(sel === 'customizing'){
			
			var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.formIndex + '/versions/' + this.versionIndex);
	  		var path         = evt.getSource().getBindingContext('forms').getPath();			
	  		var data         = model.getProperty(path);  
			
	  		jQuery.sap.byId('inpColorBase-inner').css('background-color',data.colorbase);
			jQuery.sap.byId('inpColorFondo-inner').css('background-color',data.colorfondo);
			jQuery.sap.byId('inpColorHead-inner').css('background-color',data.colorhead);
			jQuery.sap.byId('inpColorSection-inner').css('background-color',data.colorsection);		
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
		      		var sectionid = 90000;

		      		try{
		      			sectionid = data.sections[data.sections.length - 1].sectionid + 1;
		      		}catch(ex){}
		      			
		      		data.sections.push({
		      			sectionid: 		sectionid,
		      			sectiontitle: 	sap.ui.getCore().byId("oSectionTitle").getValue(),
		      			sectioncolumn:  sap.ui.getCore().byId("oSectionColumns").getSelectedItem().getKey()	,
		      			fields: [],
		      			subsections:[]
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



	addSectionCopy: function(evt){
		
		var that 	= this;
	    var oModel  = new myJSONModel;
	    var context = sap.ui.getCore().byId("app").getModel('forms').getContext('/' + this.formIndex + '/versions/' + this.versionIndex);
	    var formidDest = context.oModel.oData[this.formIndex].formid;
	    var veridDest  = context.oModel.oData[this.formIndex].versions[this.versionIndex].verformid;

		
		that.formOri = new sap.m.Input({
	       	 id:"oFormOrigen",
	    	 enabled:true,			        	 
	    	 showValueHelp:true,
	    	 placeholder:"Seleccione el formulario origen",
	    	 valueHelpRequest: function(evt){
	    		 that.getForms(evt)
	    	 }
		});
		
		that.versionOri = new sap.m.Input({
	       	 id:"oVersionOri",
	    	 enabled:true,			        	 
	    	 showValueHelp:true,
	    	 placeholder:"Seleccione la versión origen",
	    	 valueHelpRequest: function(evt){
	    		 that.getVersions(evt)
	    	 }
		});


		that.sectionOri = new sap.m.Input({
	       	 id:"oSectionOri",
	    	 enabled:true,			        	 
	    	 showValueHelp:true,
	    	 placeholder:"Seleccione la sección a copiar",
	    	 valueHelpRequest: function(evt){
	    		 that.getSections(evt)
	    	 }
		});
		
		
		// Formularios
		that.oInfoDuplicate = new sap.ui.layout.VerticalLayout({
			id: "oTypeVersion",
			width: "100%",
			placeholder: "Seleccione una opción",
			content:[
         	    	new sap.m.Label({text:"Formulario"}),
		         	that.formOri,
			        new sap.m.Label({text:"Versión"}),
			        that.versionOri,
			        new sap.m.Label({text:"Sección"}),
			        that.sectionOri
			]
		}).addStyleClass("layPadding10");
		
		
		var dialog = new sap.m.Dialog({
		      title: 'Duplicar formulario',
		      verticalScrolling: true,
			  contentWidth: "500px",
		      content:[that.oInfoDuplicate],
		      beginButton: new sap.m.Button({
		    	  id: "btnSaveNewDup",
		          text: 'Crear',
		          enabled: true,
		          press: function (evt) {	
		        	  

		        	// Extraigo el id del formdest y la versiondest


		        	  
		      		var oParameters = {
		      			   "option" 		: 'copy-section',
		 	 	           "formori" 		: sap.ui.getCore().byId("oFormOrigen").getValue(),
		 	 	           "formdest"  		: formidDest,
		 	 	           "verori"	   		: sap.ui.getCore().byId("oVersionOri").getValue().substring(0, 3),
		 	 	           "verdest"    	: veridDest,
		 	 	           "sectionori"		: sap.ui.getCore().byId("oSectionOri").getValue().substring(0, 5),
		      		};
		        	  
		        	// Llamo el metodo POST para crear los datos
			    		oModel.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
			    			
			    						    			
			    			// Consulto los datos actualizados			
			    			var oModel2 = new myJSONModel;
			    			
			    			oModel2.loadDataNew("http://hgmsapdev01.hgm.com:8000/sap/bc/ibmformwizard/forms_data/forms/", function(oData){
			    				
			    				sap.ui.getCore().byId("app").getModel('forms').setData(oData);
			    				
				    			var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/');	
				    			
				    			// Limpio los campos
				    	  		sap.ui.getCore().byId("oFormOrigen").setValue("");
				    	  		sap.ui.getCore().byId("oVersionOri").setValue("");
				    	  		sap.ui.getCore().byId("oSectionOri").setValue("");
				    	  		
				    	  		sap.m.MessageToast.show('Sección duplicada con exito');
			    				
			    			},function(){
			    				sap.m.MessageToast.show('Error creando el formulario');
			    			});		
			    			

			    			
			    		},function(){
			    			sap.ui.commons.MessageBox.alert(arguments[0].statusText);
			    		},oParameters, true,'POST');	
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
		    dialog.open();		
	},


	getForms: function(evt){
		
		var that = this;
		
		var itemTemplate = new sap.m.StandardListItem({
			title: "{formsOri>formtecname}",
			description: "{formsOri>formtitle}",
			active: true
		});
		
		var dialog = new sap.m.SelectDialog({
			title:"Formularios",
		    class:"sapUiPopupWithPadding",
		    liveChange: function(evt){
		    	
		    	var filters = [];
				var query = evt.getParameter("value");
				if (query && query.length > 0) {
					var filter = new sap.ui.model.Filter("formtecname", sap.ui.model.FilterOperator.Contains, query);
					filters.push(filter);
				}
				evt.getSource().getBinding("items").filter(filters);
				that.validateRequiredField(evt)
				
		    },
		    confirm: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");

		        if (oSelectedItem) {

			        var oBindingContext = evt.getParameter("selectedContexts");
					var path  	  		= oBindingContext[0].sPath;
					var start     		= path.lastIndexOf('/') + 1;
					that.formOriIndex 	= path.substring(start,path.length);		

		            var oFormOrigen 	=  sap.ui.getCore().byId("oFormOrigen");
		            oFormOrigen.setValue(oSelectedItem.getTitle());
		            oFormOrigen.setValueState("None");



		            var versiones = [];

		            for(i=0; i<oBindingContext[0].oModel.oData[that.formOriIndex].versions.length; i++){		        	
		        		
			        	versiones.push({
			        		verformid: oBindingContext[0].oModel.oData[that.formOriIndex].versions[i].verformid,
			        		descpver:  oBindingContext[0].oModel.oData[that.formOriIndex].versions[i].descpver,
			    		})

		            }

	    	  		sap.ui.getCore().byId("oVersionOri").setValue("");
	    	  		sap.ui.getCore().byId("oSectionOri").setValue("");

		            sap.ui.getCore().byId("app").getModel('versions').setData(versiones); 

		          
		        }
		        evt.getSource().getBinding("items").filter([]);
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var oFormOrigen =  sap.ui.getCore().byId("oFormOrigen");
		          oFormOrigen.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});
		
		dialog.bindAggregation("items", "formsOri>/", itemTemplate);
	
	    this.getView().addDependent(dialog);
	    dialog.open();

	},

	getVersions: function(evt){
		
		var that = this;
		
		var itemTemplate = new sap.m.StandardListItem({
			title: "{versions>verformid} - {versions>descpver}",
			active: true
		});
		
		var dialog = new sap.m.SelectDialog({
			title:"Versiones",
		    class:"sapUiPopupWithPadding",
		    liveChange: function(evt){
		    	
		    	var filters = [];
				var query = evt.getParameter("value");
				if (query && query.length > 0) {
					var filter = new sap.ui.model.Filter("verformid", sap.ui.model.FilterOperator.Contains, query);
					filters.push(filter);
				}
				evt.getSource().getBinding("items").filter(filters);
				that.validateRequiredField(evt)
				
		    },
		    confirm: function(evt){

		    	var oSelectedItem = evt.getParameter("selectedItem");

		        if (oSelectedItem) {

			        var oBindingContext 	= evt.getParameter("selectedContexts");
					var path  	  			= oBindingContext[0].sPath;
					var start     			= path.lastIndexOf('/') + 1;
					that.versionOriIndex	= path.substring(start,path.length);		

		            var oVersionOri 		=  sap.ui.getCore().byId("oVersionOri");
		            oVersionOri.setValue(oSelectedItem.getTitle());
		            oVersionOri.setValueState("None");


		            var context = sap.ui.getCore().byId("app").getModel('formsOri').getContext('/' + this.formOriIndex + '/versions/' + that.versionOriIndex);	

		            var secciones = [];

		            for(i=0; i<context.oModel.oData[that.formOriIndex].versions[that.versionOriIndex].sections.length; i++){
		        	
		        		
			        	secciones.push({
			        		sectionid: 	   context.oModel.oData[that.formOriIndex].versions[that.versionOriIndex].sections[i].sectionid,
			        		sectiontitle:  context.oModel.oData[that.formOriIndex].versions[that.versionOriIndex].sections[i].sectiontitle,
			    		})
		            }

	    	  		sap.ui.getCore().byId("oSectionOri").setValue("");

		            sap.ui.getCore().byId("app").getModel('secciones').setData(secciones); 
		          
		        }
		        evt.getSource().getBinding("items").filter([]);
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var oVersionOri =  sap.ui.getCore().byId("oVersionOri");
		          oVersionOri.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});
		
		dialog.bindAggregation("items", "versions>/", itemTemplate);
	
	    this.getView().addDependent(dialog);
	    dialog.open();

	},

	getSections: function(evt){
		
		var that = this;
		
		var itemTemplate = new sap.m.StandardListItem({
			title: "{secciones>sectionid} - {secciones>sectiontitle}",
			active: true
		});
		
		var dialog = new sap.m.SelectDialog({
			title:"Versiones",
		    class:"sapUiPopupWithPadding",
		    liveChange: function(evt){
		    	
		    	var filters = [];
				var query = evt.getParameter("value");
				if (query && query.length > 0) {
					var filter = new sap.ui.model.Filter("verformid", sap.ui.model.FilterOperator.Contains, query);
					filters.push(filter);
				}
				evt.getSource().getBinding("items").filter(filters);
				that.validateRequiredField(evt)
				
		    },
		    confirm: function(evt){

		    	var oSelectedItem = evt.getParameter("selectedItem");

		        if (oSelectedItem) {

			        var oBindingContext 	= evt.getParameter("selectedContexts");
					var path  	  			= oBindingContext[0].sPath;
					var start     			= path.lastIndexOf('/') + 1;
					that.versionOriIndex	= path.substring(start,path.length);		

		            var oSectionOri 		=  sap.ui.getCore().byId("oSectionOri");
		            oSectionOri.setValue(oSelectedItem.getTitle());
		            oSectionOri.setValueState("None");
		          
		        }
		        evt.getSource().getBinding("items").filter([]);
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		          var oSectionOri =  sap.ui.getCore().byId("oSectionOri");
		          oSectionOri.setValue(oSelectedItem.getTitle());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});
		
		dialog.bindAggregation("items", "secciones>/", itemTemplate);
	
	    this.getView().addDependent(dialog);
	    dialog.open();

	},
	
	saveData: function(evt){
		
		var model        = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.formIndex + '/versions/' + this.versionIndex);
  		//var path         = evt.getSource().getBindingContext('forms').getPath();			
  		//var data         = model.getProperty(path);
  		var data         = model.oModel.oData[evt.oController.formIndex].versions[evt.oController.versionIndex];  	
  		var jsonsection  = [];
  		var jsonenha     = [];
  		
  		
  		
  		// Conversion a json
  		for(i = 0; i < data.sections.length; i++){ 	
  			
  			// Campos de sección
  			var fields       = "";  			
  			
  			// Recorro los campos
  			for(j = 0; j < data.sections[i].fields.length; j++ ){	

				var disables	 = "";


  				for(s = 0; s < data.sections[i].fields[j].values.length; s++){
  					if(data.sections[i].fields[j].values[s].status == false || data.sections[i].fields[j].values[s].status == "" ){
  						disables = data.sections[i].fields[j].values[s].valueext + '#,#' + disables;
  					}
  				}
  				
  				// Concateno reglas
  				var field =  data.sections[i].fields[j].fieldid + "#RQ" + data.sections[i].fields[j].isrequired +  "#RQ" + disables + "#RQ" + data.sections[i].fields[j].vineta + "#RQ" + data.sections[i].fields[j].type + "#RLS";
  				
  				// Recorro las reglas de los campos de las secciones
				for(z = 0; z < data.sections[i].fields[j].rules.length; z++){ 		
					
					field = field + data.sections[i].fields[j].rules[z].fldrulid + '#-|-#' + data.sections[i].fields[j].rules[z].fldruldesc + '#-|-#' + data.sections[i].fields[j].rules[z].fldasignacion + '#-|-#';
						
						for ( p = 0; p < data.sections[i].fields[j].rules[z].conditions.length; p++){
							
							field = field + data.sections[i].fields[j].rules[z].conditions[p].field + ' ' +
											data.sections[i].fields[j].rules[z].conditions[p].option + ' ' +
											data.sections[i].fields[j].rules[z].conditions[p].value + ' ' +
											data.sections[i].fields[j].rules[z].conditions[p].connector + '#-?-#';	
							
						}		
						
						field = field + '#-$-#';							
  				}
  				
  				// Concateno los campos
  				fields = field + '#-/-#' + fields  ;
 				
  			}
  			
  			// Agrego las secciones
  			jsonsection.push({sectionid:data.sections[i].sectionid,sectiontitle:data.sections[i].sectiontitle, sectioncolumn: data.sections[i].sectioncolumn,sectionfields:fields, sectionvi: data.sections[i].sectionvi})
 			
  			
  			// Recorro las seubsecciones de la sección

  			var sectionscopy = data.sections[i].subsections;	

  			for(w = 0; w < sectionscopy.length; w++){

  				// Campos de subsección
	  			var fields       = "";
	  			
	  			// Recorro los campos
	  			for(j = 0; j < sectionscopy[w].fields.length; j++ ){	

	  				var disables	 = "";


	  				for(s = 0; s < sectionscopy[w].fields[j].values.length; s++){
	  					if(sectionscopy[w].fields[j].values[s].status == false){
	  						disables = sectionscopy[w].fields[j].values[s].valueext + '#,#' + disables;
	  					}
	  				}
	  				
	  				// Concateno reglas
	  				var field =  sectionscopy[w].fields[j].fieldid + "#RQ" + sectionscopy[w].fields[j].isrequired +  "#RQ" + disables + "#RQ" + sectionscopy[w].fields[j].vineta + "#RQ" + sectionscopy[w].fields[j].type +  "#RLS";
	  				
	  				// Recorro las reglas de los campos de las secciones
					for(z = 0; z < sectionscopy[w].fields[j].rules.length; z++){ 		
						
						field = field + sectionscopy[w].fields[j].rules[z].fldrulid + '#-|-#' + sectionscopy[w].fields[j].rules[z].fldruldesc + '#-|-#' + sectionscopy[w].fields[j].rules[z].fldasignacion + '#-|-#';
							
							for ( p = 0; p < sectionscopy[w].fields[j].rules[z].conditions.length; p++){
								
								field = field + sectionscopy[w].fields[j].rules[z].conditions[p].field + ' ' +
												sectionscopy[w].fields[j].rules[z].conditions[p].option + ' ' +
												sectionscopy[w].fields[j].rules[z].conditions[p].value + ' ' +
												sectionscopy[w].fields[j].rules[z].conditions[p].connector + '#-?-#';	
								
							}		
							
							field = field + '#-$-#';							
	  				}
	  				
	  				// Concateno los campos
	  				fields = field + '#-/-#' + fields  ;
	 				
	  			}

  				// Agrego la subseccion como una seccion normal pero con sectionroot
  				jsonsection.push({ sectionid:sectionscopy[w].sectionid, sectiontitle:sectionscopy[w].sectiontitle, sectioncolumn: sectionscopy[w].sectioncolumn, sectionroot:data.sections[i].sectionid, sectionfields:fields, sectionvi: sectionscopy[w].sectionvi});
  				
  			}  



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
           "formtecname"		: data.formtecname,
           "verformid"          : data.verformid,
           "descpver"			: data.descpver,
           "colorbase" 			: data.colorbase,
           "colorfondo" 		: data.colorfondo,
           "colorhead" 			: data.colorhead,
           "colorsections" 		: data.colorsections,
           "showtitle" 			: data.showtitle,
           "sizetitlehead" 		: data.sizetitlehead,
           "showtexthead" 		: data.showtexthead,
           "showtextheadobj" 	: data.showtextheadobj,
           "showtitlesection" 	: data.showtitlesection,
           "sizetitlesections" 	: data.sizetitlesections,
           "showfooter" 		: data.showfooter,
           "logo" 				: data.logo,
           "logoimg" 			: data.logoimg,  
           "formintroduction"	: data.formintroduction,
           "formfooter"			: data.formfooter,
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
		
		var that = evt;
		var model = sap.ui.getCore().byId("app").getModel("forms").getContext('/' + this.fieldIndex + '/');		
		//var path  = evt.getSource().getBindingContext('forms').getPath();			
		//var dataVal  = model.getProperty(path);		

		var dataVal     = model.oModel.oData[evt.oController.formIndex].versions[evt.oController.versionIndex]; 
		
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
		    			that.oController.router.navTo("Blank");
		    			
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
	
	getLogo: function(evt){		
		
		var view = sap.ui.getCore();		
		
		var itemTemplate = new sap.m.StandardListItem({
			title: "{images>namefld}",
			description: "{images>descpfld}",
			icon:"{images>imagen}", 
			iconDensityAware:false,
		    iconInset:false,
			active: true
		});
		
		var dialog = new sap.m.SelectDialog({
			title:"Selección de imagenes",
		    class:"sapUiPopupWithPadding",
		    liveChange: function(evt){	    	

		    	var filters = [];
				var query = evt.getParameter("value");
				if (query && query.length > 0) {
					var filter = new sap.ui.model.Filter("namefld", sap.ui.model.FilterOperator.Contains, query);
					filters.push(filter);
				}
				evt.getSource().getBinding("items").filter(filters);
		    },
		    confirm: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		        	view.byId("inpImageLogo").setValue(oSelectedItem.getTitle());
		        	view.byId("imgLogo").setSrc(oSelectedItem.getIcon());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    },
		    cancel: function(evt){
		    	var oSelectedItem = evt.getParameter("selectedItem");
		        if (oSelectedItem) {
		        	view.byId("inpImageLogo").setValue(oSelectedItem.getTitle());
		        	view.byId("imgLogo").setSrc(oSelectedItem.getIcon());
		        }
		        evt.getSource().getBinding("items").filter([]);
		    }
		});
		
		dialog.bindAggregation("items", "images>/", itemTemplate);
	
	    this.getView().addDependent(dialog);
	    dialog.open();

	},
	


});