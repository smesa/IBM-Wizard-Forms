sap.ui.jsview("wizardformsfields.FieldsInfo", {

	getControllerName : function() {
		return "wizardformsfields.FieldsInfo";
	},

	createContent : function(oController) {
		
		// Nombre de elemento
		var oLblblnk  = new sap.m.Label({ text : " " });  
		var oLblTitle = new sap.m.Label({ text : "Nombre del elemento" });  
		var oTxtTitle = new sap.m.Input({ id   : "fieldtitle", value:"{fields>fieldtitle}" });  
		
		// Placeholder
		var oLblPlace = new sap.m.Label({ text : "Marcador" });  
		var oTxtPlace = new sap.m.Input({ id   : "fieldplaceholder",value:"{fields>fieldplaceholder}" }); 
		
		// Tipo
		var oLblType  = new sap.m.Label({ text : "Tipo de elemento" }); 		
		var oCmbType = new sap.m.ComboBox({
			  id: "fieldtype",
			  selectedKey:"{fields>fieldtype}",
			  width: "100%",
			  items: [
                          new sap.ui.core.ListItem({text: "Text Input",key:"TEXT"}).bindProperty("text","StatusText").bindProperty("key","Status"),
                          new sap.ui.core.ListItem({text: "Combo Box",key:"COMBO"}),
                          new sap.ui.core.ListItem({text: "Radio Button",key:"RADIO"}),
                          new sap.ui.core.ListItem({text: "Check Box",key:"CHECK"}),
                          new sap.ui.core.ListItem({text: "Calendario",key:"CALE"}),
                          new sap.ui.core.ListItem({text: "Hora",key:"TIME"}),
                          new sap.ui.core.ListItem({text: "Etiqueta",key:"LABEL"})
                     ]
        }).bindProperty("value","StatusText");
		
		
		// Formulario
		var oInfoForm = new sap.ui.layout.VerticalLayout({
			width: "100%",
			content:[oLblblnk, oLblTitle,oTxtTitle,oLblPlace,oTxtPlace,oLblType,oCmbType]
		});		
		
		oInfoForm.addStyleClass("layPadding10");
		
		
		// Tabla de valores		
		var oTable = new sap.m.Table({
			id: "oValueTable",
			inset: false,
			columns: [
			          //Value
			          new sap.m.Column({
			        	  halign: "left",
			        	  width: "100px",
			        	  demandPopin: true,
			        	  popinDisplay: "Block",
			        	  minScreenWidth: sap.m.ScreenSize.Medium
			          })
	        ]
		});
		
		var oTemplate = new sap.m.ColumnListItem({
			cells: [
			        new sap.m.Text({
			        	text: "{fields>valueext} - {fields>value}",
			        })
	        ]
		});
		

		// Toolbar de la tabla
		var oHeader = new sap.m.Toolbar({
			content : [ 
	            new sap.m.Label({
	            	text : "Lista de valores del elemento"
	            }), 
	            new sap.m.ToolbarSpacer({}), 
	            new sap.m.Button({
	            	icon : "sap-icon://add",
	            	press: function(evt){
	            		oController.addValuesDialog(evt)
	            	}
	            }) 
            ]
		});
		
		oTable.setHeaderToolbar(oHeader);			
		oTable.setMode(sap.m.ListMode.Delete); // delete mode  	

		oTable.bindAggregation("items","fields>values",oTemplate);
		
		oTable.attachDelete(function(evt){
			oController.deleteValueDialog(evt)
		});		
		
		
		// Adiciono tabla al form
		oInfoForm.addContent(oTable);		
		
		//Icon Tab
		var oIconTab = new sap.m.IconTabBar({
			title: "IconTab",
			showHeader: false
		})
		
		// Agrego a la pestaña el formulario
		var oItemBarInfo = new sap.m.IconTabFilter({
		        text: "Información",
		        icon:"sap-icon://hint",
		        content:[ oInfoForm ]
	     });		
		oIconTab.addItem(oItemBarInfo);	
		
		return new sap.m.Page({
			title: "Detalle de elemento",
			
			footer: new sap.m.Bar({
				contentRight: [
								new sap.m.Button({
									text: "Eliminar",
								    icon: "sap-icon://delete",
								    type: "Reject",
								    press: function(evt){
									  oController.deleteData(evt)
								  }
								}),
								new sap.m.Button({
									text: "Guardar",
									icon: "sap-icon://save",
									press: function(evt){
										oController.saveData(evt)
									}
								}),
				              
	            ]
			}),
			content: [oIconTab]
		});
	}
});