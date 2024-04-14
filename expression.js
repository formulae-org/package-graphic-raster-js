/*
Fōrmulæ raster graphic package. Module for expression definition & visualization.
Copyright (C) 2015-2023 Laurence R. Ugalde

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

'use strict';

export class Graphics extends Formulae.Package {}

Graphics.loadImage = function(object, src) {
	return new Promise(
		function(resolve, reject) {
			let image = new Image();
			
			image.onload = function() {
				let canvas = document.createElement("canvas");
				canvas.width = image.width;
				canvas.height = image.height;
				let context = canvas.getContext("2d");
				context.drawImage(image, 0, 0);
				object.set("Value", context);
				
				resolve(true);
			};
			
			image.onerror = function() {
				reject();
			};
			
			image.src = src;
		}
	);
}

Graphics.RasterGraphics = class extends Expression.NullaryExpression {
	getTag() { return "Graphics.RasterGraphics"; }
	getName() { return Graphics.messages.nameRasterGraphics; }
	
	set(name, value) {
		switch (name) {
			case "Value":
				this.context = value;
				this.settings = [0, 0, 0, false, false, false];
				return;
				
			case "X":
				this.settings[0] = value; return;
				
			case "Y":
				this.settings[1] = value; return;
			
			case "Angle":
				this.settings[2] = value; return;
				
			case "ArcAsPie":
				this.settings[3] = value; return;
			
			case "StrokeAffectedByScale":
				this.settings[4] = value; return;
			
			case "ScaleSet":
				this.settings[5] = value; return;
		}
		
		super.set(name, value);
	}
	
	get(name) {
		switch (name) {
			case "Value":
				return this.context;
				
			case "X":
				return this.settings[0];
				
			case "Y":
				return this.settings[1];
			
			case "Angle":
				return this.settings[2];
				
			case "ArcAsPie":
				return this.settings[3];
				
			case "StrokeAffectedByScale":
				return this.settings[4];
			
			case "ScaleSet":
				return this.settings[5];
		}
		
		return super.get(name);
	}
	
	getSerializationNames() {
		return [ "Value" ];
	}
	
	setSerializationStrings(strings, promises) {
		promises.push(Graphics.loadImage(this, "data:image/png;base64," + strings[0]));
	}
	
	getSerializationStrings() {
		return [ this.context.canvas.toDataURL("image/png").replace(/^data:image\/(png|jpeg);base64,/, "") ];
	}
	
	prepareDisplay(context) {
		this.width = this.context.canvas.width;
		this.height = this.context.canvas.height;
		this.vertBaseline = Math.round(this.width / 2);
		this.horzBaseline = Math.round(this.height / 2);
	}
	
	display(context, x, y) {
		if (Formulae.ltr) {
			context.drawImage(this.context.canvas, x, y);
		}
		else {
			context.scale(-1, 1);
			//context.drawImage(this.image, x - 0.5 - this.image.width, y - 0.5);
			context.drawImage(this.context.canvas, x - this.context.canvas.width, y);
			context.scale(-1, 1);
		}
	}
}

Graphics.setExpressions = function(module) {
	Formulae.setExpression(module, "Graphics.RasterGraphics", Graphics.RasterGraphics);
	
	// graphic painter
	Formulae.setExpression(module, "Graphics.Painter", {
		clazz:      Expression.Literal,
		getTag:     () => "Graphics.Painter",
		getLiteral: () => Graphics.messages.literalPainter,
		getName:    () => Graphics.messages.namePainter
	});
	
	[ // 1-parameter functions
		[ "Graphics",        "GetSize"                    ],
		[ "Graphics",        "GetPainter"                 ],
		[ "Graphics",        "CopyRasterGraphics"         ],
		[ "Graphics",        "GetColor"                   ],
		[ "Graphics",        "GetPos"                     ],
		[ "Graphics.Turtle", "GetAngle"                   ],
		[ "Graphics",        "ResetCoordinates"           ],
		[ "Graphics",        "SetCoordinatesPixels0Based" ],
		[ "Graphics",        "SetCoordinatesPixels1Based" ],
		[ "Graphics",        "SetPaintMode"               ],
		[ "Graphics",        "SetXORMode"                 ],
		[ "Graphics",        "SetDrawingArcOpen"          ],
		[ "Graphics",        "SetDrawingArcAsPie"         ],
	].forEach(row => Formulae.setExpression(module, row[0] + "." + row[1], {
		clazz:        Expression.Function,
		getTag:       () => row[0] + "." + row[1],
		getMnemonic:  () => Graphics.messages["mnemonic" + row[1]],
		getName:      () => Graphics.messages["name" + row[1]],
		getChildName: index => Graphics.messages["child" + row[1]]
	}));
	
	[ // functions
		[ "CreateRasterGraphics",     2, 3 ],
		[ "GetPixel",                 3, 3 ],
		[ "SetPixel",                 3, 4 ],
		[ "DrawLinePosPos",           5, 5 ],
		[ "DrawLinePosOffset",        5, 5 ],
		[ "DrawLineToPos",            3, 3 ],
		[ "DrawLineToOffset",         3, 3 ],
		[ "SetPos",                   2, 3 ],
		[ "OffsetPos",                3, 3 ],
		[ "SetAntialias",             2, 2 ],
		[ "SetStrokeAffectedByScale", 2, 2 ],
		[ "SetStrokeWidth",           2, 2 ],
		[ "SetColor",                 2, 2 ],
		[ "DrawImage",                4, 4 ],
		[ "GetTextWidth",             2, 2 ],
		[ "DrawText",                 4, 4 ]
	].forEach(row => Formulae.setExpression(module, "Graphics." + row[0], {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + row[0],
		getMnemonic:  () => Graphics.messages["mnemonic" + row[0]],
		getName:      () => Graphics.messages["name" + row[0]],
		getChildName: index => Graphics.messages["children" + row[0]][index],
		min:          row[1],
		max:          row[2]
	}));
	
	// draw/fill rectangle pos-pos
	[ "DrawRectanglePosPos", "FillRectanglePosPos" ].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenRectanglePosPos[index],
		min: 5, max: 5
	}));
	
	// draw/fill rectangle pos-size
	[ "DrawRectanglePosSize", "FillRectanglePosSize" ].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenRectanglePosSize[index],
		min: 5, max: 5
	}));
	
	// draw/fill ellipse pos-pos
	[ "DrawEllipsePosPos", "FillEllipsePosPos"].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenEllipsePosPos[index],
		min: 5, max: 5
	}));
	
	// draw/fill ellipse pos-size
	[ "DrawEllipsePosSize", "FillEllipsePosSize"].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenEllipsePosSize[index],
		min: 5, max: 5
	}));
	
	// draw/fill ellipse center-radius
	[ "DrawEllipseCenterRadius", "FillEllipseCenterRadius"].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenEllipseCenterRadius[index],
		min: 4, max: 4
	}));
	
	// draw/fill arc pos-pos
	[ "DrawArcPosPos", "FillArcPosPos"].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenArcPosPos[index],
		min: 7, max: 7
	}));
	
	// draw/fill arc pos-size
	[ "DrawArcPosSize", "FillArcPosSize"].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenArcPosSize[index],
		min: 7, max: 7
	}));
	
	// draw/fill arc center-radius
	[ "DrawArcCenterRadius", "FillArcCenterRadius"].forEach(tag => Formulae.setExpression(module, "Graphics." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages.childrenArcCenterRadius[index],
		min: 6, max: 6
	}));
	
	// turtle graphics
	[ "SetAngle", "ForwardDrawing", "Forward", "Turn" ].forEach(tag => Formulae.setExpression(module, "Graphics.Turtle." + tag, {
		clazz:        Expression.Function,
		getTag:       () => "Graphics.Turtle." + tag,
		getMnemonic:  () => Graphics.messages["mnemonic" + tag],
		getName:      () => Graphics.messages["name" + tag],
		getChildName: index => Graphics.messages["children" + tag][index],
		min: 2, max: 2
	}));
	
	// coordinates
	[ [ "AddTranslation",     3, 3 ],
	  [ "AddScaling",         3, 3 ],
	  [ "AddRotation",        2, 2 ],
	  [ "SetCoordinatesMath", 5, 5 ]
	].forEach(row => Formulae.setExpression(module, "Graphics." + row[0], {
		clazz:        Expression.Function,
		getTag:       () => "Graphics." + row[0],
		getMnemonic:  () => Graphics.messages["mnemonic" + row[0]],
		getName:      () => Graphics.messages["name" + row[0]],
		getChildName: index => Graphics.messages["children" + row[0]][index],
		min:          row[1],
		max:          row[2]
	}));
};
