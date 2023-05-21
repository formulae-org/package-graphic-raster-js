/*
Fōrmulæ raster graphic package. Module for edition.
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

Graphics.editionFromFile = function() {
	let input = document.createElement("input");
	input.type = "file";
	input.accept = "image/*";
	
	input.onchange = event => { 
		let file = event.target.files[0]; 
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = readerEvent => {
			let raster = Formulae.createExpression("Graphics.RasterGraphics");
			let content = readerEvent.target.result;
			Graphics.loadImage(raster, content).then(
				() => {
					Formulae.sExpression.replaceBy(raster);
					Formulae.sHandler.prepareDisplay();
					Formulae.sHandler.display();
					Formulae.setSelected(Formulae.sHandler, raster, false);
				}
			);
		};
	};
	
	input.click();
}

Graphics.setEditions = function() {
	Formulae.addEdition(this.messages.pathGraphics, null, this.messages.leafFromFile, Graphics.editionFromFile);
	Formulae.addEdition(this.messages.pathGraphics, null, this.messages.leafCreateRasterGraphics, () => Expression.multipleEdition("Graphics.CreateRasterGraphics", 2, 0));
	Formulae.addEdition(this.messages.pathGraphics, null, this.messages.leafGetSize, () => Expression.wrapperEdition ("Graphics.GetSize"));
	Formulae.addEdition(this.messages.pathGraphics, null, this.messages.leafCopyRasterGraphics, () => Expression.wrapperEdition ("Graphics.CopyRasterGraphics"));
	
	Formulae.addEdition(this.messages.pathGraphics, null, this.messages.leafGetPainter, () => Expression.wrapperEdition ("Graphics.GetPainter"));
	
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetColor, () => Expression.multipleEdition("Graphics.SetColor", 2, 0));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafGetColor, () => Expression.wrapperEdition("Graphics.GetColor"));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetStrokeWidth, () => Expression.multipleEdition("Graphics.SetStrokeWidth", 2, 0));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetStrokeAffectedByScale, () => Expression.multipleEdition("Graphics.SetStrokeAffectedByScale", 2, 0));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetPaintMode, () => Expression.wrapperEdition("Graphics.SetPaintMode"));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetXORMode, () => Expression.wrapperEdition("Graphics.SetXORMode"));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetDrawingArcOpen, () => Expression.wrapperEdition("Graphics.SetDrawingArcOpen"));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetDrawingArcAsPie, () => Expression.wrapperEdition("Graphics.SetDrawingArcAsPie"));
	Formulae.addEdition(this.messages.pathState, null, this.messages.leafSetAntialias, () => Expression.multipleEdition("Graphics.SetAntialias", 2, 0));
	
	Formulae.addEdition(this.messages.pathPixels, null, this.messages.leafSetPixel, () => Expression.multipleEdition("Graphics.SetPixel", 3, 0));
	Formulae.addEdition(this.messages.pathPixels, null, this.messages.leafGetPixel, () => Expression.multipleEdition("Graphics.GetPixel", 3, 0));
	
	Formulae.addEdition(this.messages.pathLines, null, this.messages.leafDrawLinePosPos, () => Expression.multipleEdition("Graphics.DrawLinePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathLines, null, this.messages.leafDrawLinePosOffset, () => Expression.multipleEdition("Graphics.DrawLinePosOffset", 5, 0));
	Formulae.addEdition(this.messages.pathLines, null, this.messages.leafDrawLineToPos, () => Expression.multipleEdition("Graphics.DrawLineToPos", 3, 0));
	Formulae.addEdition(this.messages.pathLines, null, this.messages.leafDrawLineToOffset, () => Expression.multipleEdition("Graphics.DrawLineToOffset", 3, 0));
	
	Formulae.addEdition(this.messages.pathRectangle, null, this.messages.leafDrawRectanglePosPos,  () => Expression.multipleEdition("Graphics.DrawRectanglePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathRectangle, null, this.messages.leafDrawRectanglePosSize, () => Expression.multipleEdition("Graphics.DrawRectanglePosSize", 5, 0));
	Formulae.addEdition(this.messages.pathRectangle, null, this.messages.leafFillRectanglePosPos,  () => Expression.multipleEdition("Graphics.FillRectanglePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathRectangle, null, this.messages.leafFillRectanglePosSize, () => Expression.multipleEdition("Graphics.FillRectanglePosSize", 5, 0));
	
	Formulae.addEdition(this.messages.pathEllipse, null, this.messages.leafDrawEllipsePosPos, () => Expression.multipleEdition("Graphics.DrawEllipsePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, null, this.messages.leafDrawEllipsePosSize, () => Expression.multipleEdition("Graphics.DrawEllipsePosSize", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, null, this.messages.leafDrawEllipseCenterRadius, () => Expression.multipleEdition("Graphics.DrawEllipseCenterRadius", 4, 0));
	Formulae.addEdition(this.messages.pathEllipse, null, this.messages.leafFillEllipsePosPos, () => Expression.multipleEdition("Graphics.FillEllipsePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, null, this.messages.leafFillEllipsePosSize, () => Expression.multipleEdition("Graphics.FillEllipsePosSize", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, null, this.messages.leafFillEllipseCenterRadius, () => Expression.multipleEdition("Graphics.FillEllipseCenterRadius", 4, 0));
	
	Formulae.addEdition(this.messages.pathArc, null, this.messages.leafDrawArcPosPos, () => Expression.multipleEdition("Graphics.DrawArcPosPos", 7, 0));
	Formulae.addEdition(this.messages.pathArc, null, this.messages.leafDrawArcPosSize, () => Expression.multipleEdition("Graphics.DrawArcPosSize", 7, 0));
	Formulae.addEdition(this.messages.pathArc, null, this.messages.leafDrawArcCenterRadius, () => Expression.multipleEdition("Graphics.DrawArcCenterRadius", 6, 0));
	Formulae.addEdition(this.messages.pathArc, null, this.messages.leafFillArcPosPos, () => Expression.multipleEdition("Graphics.FillArcPosPos", 7, 0));
	Formulae.addEdition(this.messages.pathArc, null, this.messages.leafFillArcPosSize, () => Expression.multipleEdition("Graphics.FillArcPosSize", 7, 0));
	Formulae.addEdition(this.messages.pathArc, null, this.messages.leafFillArcCenterRadius, () => Expression.multipleEdition("Graphics.FillArcCenterRadius", 6, 0));
	
	Formulae.addEdition(this.messages.pathImage, null, this.messages.leafDrawImage, () => Expression.multipleEdition("Graphics.DrawImage", 4, 0));
	
	Formulae.addEdition(this.messages.pathText, null, this.messages.leafGetTextWidth, () => Expression.multipleEdition("Graphics.GetTextWidth", 2, 0));
	Formulae.addEdition(this.messages.pathText, null, this.messages.leafDrawText,     () => Expression.multipleEdition("Graphics.DrawText", 4, 0));
	
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafGetPos, () => Expression.wrapperEdition ("Graphics.GetPos"));
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafSetPos, () => Expression.multipleEdition("Graphics.SetPos", 3, 0));
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafOffsetPos, () => Expression.multipleEdition("Graphics.OffsetPos", 3, 0));
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafGetAngle, () => Expression.wrapperEdition ("Graphics.Turtle.GetAngle"));
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafSetAngle, () => Expression.multipleEdition("Graphics.Turtle.SetAngle", 2, 0));
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafForwardDrawing, () => Expression.multipleEdition("Graphics.Turtle.ForwardDrawing", 2, 0));
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafForward, () => Expression.multipleEdition("Graphics.Turtle.Forward", 2, 0));
	Formulae.addEdition(this.messages.pathTurtle, null, this.messages.leafTurn, () => Expression.multipleEdition("Graphics.Turtle.Turn", 2, 0));
	
	Formulae.addEdition(this.messages.pathCoordinates, null, this.messages.leafResetCoordinates, () => Expression.wrapperEdition ("Graphics.ResetCoordinates"));
	Formulae.addEdition(this.messages.pathCoordinates, null, this.messages.leafAddTranslation, () => Expression.multipleEdition("Graphics.AddTranslation", 3, 0));
	Formulae.addEdition(this.messages.pathCoordinates, null, this.messages.leafAddScaling, () => Expression.multipleEdition("Graphics.AddScaling", 3, 0));
	Formulae.addEdition(this.messages.pathCoordinates, null, this.messages.leafAddRotation, () => Expression.multipleEdition("Graphics.AddRotation", 2, 0));
	Formulae.addEdition(this.messages.pathCoordinates, null, this.messages.leafSetCoordinatesPixels0Based, () => Expression.wrapperEdition ("Graphics.SetCoordinatesPixels0Based"));
	Formulae.addEdition(this.messages.pathCoordinates, null, this.messages.leafSetCoordinatesPixels1Based, () => Expression.wrapperEdition ("Graphics.SetCoordinatesPixels1Based"));
	Formulae.addEdition(this.messages.pathCoordinates, null, this.messages.leafSetCoordinatesMath, () => Expression.multipleEdition("Graphics.SetCoordinatesMath", 5, 0));
};
