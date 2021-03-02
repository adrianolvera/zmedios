sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/m/ColumnListItem',
	'sap/m/Label',
	'sap/m/Token' //	"sap/m/MessageToast"
], function(Controller, JSONMOdel, ColumnListItem, Label, Token) {
	"use strict";

	return Controller.extend("MEDIOS_EKT.controller.Descuentos", {

		onInit: function() {
			var sUrl = "/sap/opu/odata/sap/ZMEDIOS_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);

			this.getView().setModel(oModel);
			this.getView().byId("Cod").setVisible(false);
			this.getView().byId("Tiendas").setVisible(false);

			var JSONModel = sap.ui.require("sap/ui/model/json/JSONModel");

			this.oColModel = new JSONModel(jQuery.sap.getResourcePath("MEDIOS_EKT") + "/columnsModel.json");
			//	this.oProductsModel = new JSONModel(sap.ui.require.toUrl("sap/ui/demo/mock") + "/products.json");

		},

		onNavBack: function(oEvent) {
			// var oRouter = this.getOwnerComponent().getRouter();
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Plantillas", {});
		},

		onSelect: function(oEvent) {
			var radioBtn1 = this.getView().byId("RB1-1");
			var radioBtn2 = this.getView().byId("RB1-2");

			var cod = this.getView().byId("Cod");
			var jer = this.getView().byId("Jer");

			if (radioBtn1.getSelected() === true) {
				jer.setVisible(true);
				cod.setVisible(false);
			}
			if (radioBtn2.getSelected() === true) {
				cod.setVisible(true);
				jer.setVisible(false);
			}

		},

		handleSelectionChange: function(oEvent) {
			var changedItem = oEvent.getParameter("changedItem");
			/*		var isSelected = oEvent.getParameter("selected");

					var state = "Selected";*/
			if (!changedItem) {
				var value = this.getView().byId("co_alcance").getSelectedKey();
				if (value === "04") {
					this.getView().byId("Tiendas").setVisible(true);
				}
				//this.getView().byId("Tiendas").setVisible(true);
			}

			/*			MessageToast.show("Event 'selectionChange': " + state + " '" + changedItem.getText() + "'", {
							width: "auto"
						});*/
		},

		onValueHelpTiendas: function() {

			var aCols = this.oColModel.getData().cols;
			this._oValueHelpDialog = sap.ui.xmlfragment("MEDIOS_EKT.view.ValueHelpDialog", this);
			this.getView().addDependent(this._oValueHelpDialog); /**/

		//	this._oValueHelpDialog.getTableAsync().then(function(oTable)
			
			//{
					var oTable=	this._oValueHelpDialog.getTable();
					oTable.setModel(this.oModel);
					oTable.setModel(this.oColModel, "columns");

					if (oTable.bindRows) {
						oTable.bindAggregation("rows", "/T001WSet");
					}

					if (oTable.bindItems) {
						oTable.bindAggregation("items", "/T001WSet", function() {
							return new ColumnListItem({
								cells: aCols.map(function(column) {
									return new Label({
										text: "{" + column.template + "}"
									});
								})
							});
						});
					}
					this._oValueHelpDialog.update();
	/*			}

				.bind(this));*/

		//	this._oValueHelpDialog.setTokens(this._oMultiInput.getTokens());
			this._oValueHelpDialog.open();
		},

		onValueHelpOkPress: function(evt) {
/*			var aTokens = oEvent.getParameter("tokens");
		//	this._oEvent.setTokens(aTokens);
			this._oValueHelpDialog.close();*/
			var aSelectedItems = evt.getParameter("tokens"),
				oMultiInput = this.byId("Tiendas");

		//	if (aSelectedItems && aSelectedItems.length > 0) {
				aSelectedItems.forEach(function (oItem) {
					oMultiInput.addToken(new Token({
					text: this.getTitle()
					}));
				});
		//	}
			this._oValueHelpDialog.close();
		},

		onValueHelpCancelPress: function() {
			this._oValueHelpDialog.close();
		},

		onValueHelpAfterClose: function() {
			this._oValueHelpDialog.destroy();
		}

	});
});