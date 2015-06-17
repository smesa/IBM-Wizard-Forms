sap.ui.jsview("wizardformsforms.FormsVersions", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf wizardformsforms.FormsVersions
	*/ 
	getControllerName : function() {
		return "wizardformsforms.FormsVersions";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf wizardformsforms.FormsVersions
	*/ 
	createContent : function(oController) {
		
		this.oTableVersion = new sap.m.Table({
			inset: false,
			columns: [
			          //Value
			          new sap.m.Column({
			        	  halign: "left",
			        	  width: "50%",
			        	  demandPopin: true,
			        	  popinDisplay: "Block",
			        	  minScreenWidth: sap.m.ScreenSize.Medium
			          }),
			          new sap.m.Column({
			        	  halign: "right",
			        	  width: "20%",
			        	  demandPopin: true,
			        	  popinDisplay: "Block",
			        	  minScreenWidth: sap.m.ScreenSize.Medium
			          })
	        ]
		});		
		
		var oTemplate = new sap.m.ColumnListItem({
			type: sap.m.ListType.Active,
			vAlign: "Middle",
			cells: [
			        new sap.m.ObjectIdentifier({
			        	title: "Versión {forms>verformid}",
			        	text:"Creada el {forms>createdate}",
			        }),
			        new sap.m.Switch({
			        	state:"{forms>indiacti}",
			        	customTextOn:" ", 
			        	customTextOff:" ",
			        	change: function(evt){
			        		oController.activeVersion(evt)
			        	}
			        })
			        
			        
			]
		});	
		
		this.oTableVersion.bindAggregation("items","forms>versions",oTemplate);
		oTemplate.attachPress(function(evt){
			oController.versionPress(evt)
		})
		
 		return new sap.m.Page({
			title: "Versiones formulario",
			showNavButton: true,
			navButtonPress: function(){
				oController.goBack();
			},
			subHeader: new sap.m.Bar({
				contentMiddle: [
					new sap.m.SearchField({
						liveChange:function(evt){
							oController.onChangeSearch(evt);
						},
					    width:"100%",
					    placeholder:"Buscar versión",
					}),						
				],
				contentRight:[
						new sap.m.Button({
							icon : "sap-icon://add",
							tooltip: "Crear versión",
							press: function(evt){
								oController.newVersion(evt)
							}
						})
						
				]
			}),
			content: [this.oTableVersion]
		});
	}

});