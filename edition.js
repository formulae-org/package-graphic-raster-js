/*
Fōrmulæ raster graphic package. Module for edition.
Copyright (C) 2015-2026 Laurence R. Ugalde

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

"use strict";

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
	Formulae.addEdition(this.messages.pathGraphics, this.messages.leafFromFile, this.messages.leafFromFile, Graphics.editionFromFile);
	Formulae.addEdition(this.messages.pathGraphics, Formulae.icon("Graphics.CreateRasterGraphics", 2), this.messages.leafCreateRasterGraphics, () => Expression.multipleEdition("Graphics.CreateRasterGraphics", 2, 0));
	Formulae.addEdition(this.messages.pathGraphics, Formulae.icon("Graphics.GetSize", 1), this.messages.leafGetSize, () => Expression.wrapperEdition ("Graphics.GetSize"));
	Formulae.addEdition(this.messages.pathGraphics, Formulae.icon("Graphics.CopyRasterGraphics", 1), this.messages.leafCopyRasterGraphics, () => Expression.wrapperEdition ("Graphics.CopyRasterGraphics"));
	
	// Graphics.GetPainter is a pre-existing dead edition: the expression is registered nowhere
	// (no setExpression in expression.js) and has no leafGetPainter / nameGetPainter message. With
	// the old null image it failed silently; as an icon it would deserialize an unknown tag and
	// abort the panel build, so it stays disabled until the expression is actually implemented.
	//Formulae.addEdition(this.messages.pathGraphics, Formulae.icon("Graphics.GetPainter", 1), this.messages.leafGetPainter, () => Expression.wrapperEdition("Graphics.GetPainter"));
	
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetColor", 2), this.messages.leafSetColor, () => Expression.multipleEdition("Graphics.SetColor", 2, 0));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.GetColor", 1), this.messages.leafGetColor, () => Expression.wrapperEdition("Graphics.GetColor"));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetStrokeWidth", 2), this.messages.leafSetStrokeWidth, () => Expression.multipleEdition("Graphics.SetStrokeWidth", 2, 0));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetStrokeAffectedByScale", 2), this.messages.leafSetStrokeAffectedByScale, () => Expression.multipleEdition("Graphics.SetStrokeAffectedByScale", 2, 0));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetPaintMode", 1), this.messages.leafSetPaintMode, () => Expression.wrapperEdition("Graphics.SetPaintMode"));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetXORMode", 1), this.messages.leafSetXORMode, () => Expression.wrapperEdition("Graphics.SetXORMode"));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetDrawingArcOpen", 1), this.messages.leafSetDrawingArcOpen, () => Expression.wrapperEdition("Graphics.SetDrawingArcOpen"));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetDrawingArcAsPie", 1), this.messages.leafSetDrawingArcAsPie, () => Expression.wrapperEdition("Graphics.SetDrawingArcAsPie"));
	Formulae.addEdition(this.messages.pathState, Formulae.icon("Graphics.SetAntialias", 2), this.messages.leafSetAntialias, () => Expression.multipleEdition("Graphics.SetAntialias", 2, 0));
	
	Formulae.addEdition(this.messages.pathPixels, Formulae.icon("Graphics.SetPixel", 3), this.messages.leafSetPixel, () => Expression.multipleEdition("Graphics.SetPixel", 3, 0));
	Formulae.addEdition(this.messages.pathPixels, Formulae.icon("Graphics.GetPixel", 3), this.messages.leafGetPixel, () => Expression.multipleEdition("Graphics.GetPixel", 3, 0));
	
	Formulae.addEdition(this.messages.pathPath, '<expression tag="Graphics.CreatePath"/>', this.messages.leafCreatePath, () => Expression.replacingEdition("Graphics.CreatePath"));
	Formulae.addEdition(this.messages.pathPath, Formulae.icon("Graphics.DrawPath", 2), this.messages.leafDrawPath,   () => Expression.multipleEdition("Graphics.DrawPath", 2, 0));
	Formulae.addEdition(this.messages.pathPath, Formulae.icon("Graphics.FillPath", 2), this.messages.leafFillPath,   () => Expression.multipleEdition("Graphics.FillPath", 2, 0));
	
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.DrawLinePosPos", 5), this.messages.leafDrawLinePosPos,    () => Expression.multipleEdition("Graphics.DrawLinePosPos",    5, 0));
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.DrawLinePosOffset", 5), this.messages.leafDrawLinePosOffset, () => Expression.multipleEdition("Graphics.DrawLinePosOffset", 5, 0));
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.DrawLineToPos", 3), this.messages.leafDrawLineToPos,     () => Expression.multipleEdition("Graphics.DrawLineToPos",     3, 0));
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.DrawLineToOffset", 3), this.messages.leafDrawLineToOffset,  () => Expression.multipleEdition("Graphics.DrawLineToOffset",  3, 0));
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.PathLinePosPos", 5), this.messages.leafPathLinePosPos,    () => Expression.multipleEdition("Graphics.PathLinePosPos",    5, 0));
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.PathLinePosOffset", 5), this.messages.leafPathLinePosOffset, () => Expression.multipleEdition("Graphics.PathLinePosOffset", 5, 0));
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.PathLineToPos", 3), this.messages.leafPathLineToPos,     () => Expression.multipleEdition("Graphics.PathLineToPos",     3, 0));
	Formulae.addEdition(this.messages.pathLines, Formulae.icon("Graphics.PathLineToOffset", 3), this.messages.leafPathLineToOffset,  () => Expression.multipleEdition("Graphics.PathLineToOffset",  3, 0));
	
	Formulae.addEdition(this.messages.pathRectangle, Formulae.icon("Graphics.DrawRectanglePosPos", 5), this.messages.leafDrawRectanglePosPos,  () => Expression.multipleEdition("Graphics.DrawRectanglePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathRectangle, Formulae.icon("Graphics.DrawRectanglePosSize", 5), this.messages.leafDrawRectanglePosSize, () => Expression.multipleEdition("Graphics.DrawRectanglePosSize", 5, 0));
	
	Formulae.addEdition(this.messages.pathRectangle, Formulae.icon("Graphics.FillRectanglePosPos", 5), this.messages.leafFillRectanglePosPos,  () => Expression.multipleEdition("Graphics.FillRectanglePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathRectangle, Formulae.icon("Graphics.FillRectanglePosSize", 5), this.messages.leafFillRectanglePosSize, () => Expression.multipleEdition("Graphics.FillRectanglePosSize", 5, 0));
	
	Formulae.addEdition(this.messages.pathRectangle, Formulae.icon("Graphics.PathRectanglePosPos", 5), this.messages.leafPathRectanglePosPos,  () => Expression.multipleEdition("Graphics.PathRectanglePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathRectangle, Formulae.icon("Graphics.PathRectanglePosSize", 5), this.messages.leafPathRectanglePosSize, () => Expression.multipleEdition("Graphics.PathRectanglePosSize", 5, 0));
	
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.DrawEllipsePosPos", 5), this.messages.leafDrawEllipsePosPos, () => Expression.multipleEdition("Graphics.DrawEllipsePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.DrawEllipsePosSize", 5), this.messages.leafDrawEllipsePosSize, () => Expression.multipleEdition("Graphics.DrawEllipsePosSize", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.DrawEllipseCenterRadius", 4), this.messages.leafDrawEllipseCenterRadius, () => Expression.multipleEdition("Graphics.DrawEllipseCenterRadius", 4, 0));
	
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.FillEllipsePosPos", 5), this.messages.leafFillEllipsePosPos, () => Expression.multipleEdition("Graphics.FillEllipsePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.FillEllipsePosSize", 5), this.messages.leafFillEllipsePosSize, () => Expression.multipleEdition("Graphics.FillEllipsePosSize", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.FillEllipseCenterRadius", 4), this.messages.leafFillEllipseCenterRadius, () => Expression.multipleEdition("Graphics.FillEllipseCenterRadius", 4, 0));
	
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.PathEllipsePosPos", 5), this.messages.leafPathEllipsePosPos, () => Expression.multipleEdition("Graphics.PathEllipsePosPos", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.PathEllipsePosSize", 5), this.messages.leafPathEllipsePosSize, () => Expression.multipleEdition("Graphics.PathEllipsePosSize", 5, 0));
	Formulae.addEdition(this.messages.pathEllipse, Formulae.icon("Graphics.PathEllipseCenterRadius", 4), this.messages.leafPathEllipseCenterRadius, () => Expression.multipleEdition("Graphics.PathEllipseCenterRadius", 4, 0));
	
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.DrawArcPosPos", 7), this.messages.leafDrawArcPosPos, () => Expression.multipleEdition("Graphics.DrawArcPosPos", 7, 0));
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.DrawArcPosSize", 7), this.messages.leafDrawArcPosSize, () => Expression.multipleEdition("Graphics.DrawArcPosSize", 7, 0));
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.DrawArcCenterRadius", 6), this.messages.leafDrawArcCenterRadius, () => Expression.multipleEdition("Graphics.DrawArcCenterRadius", 6, 0));
	
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.FillArcPosPos", 7), this.messages.leafFillArcPosPos, () => Expression.multipleEdition("Graphics.FillArcPosPos", 7, 0));
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.FillArcPosSize", 7), this.messages.leafFillArcPosSize, () => Expression.multipleEdition("Graphics.FillArcPosSize", 7, 0));
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.FillArcCenterRadius", 6), this.messages.leafFillArcCenterRadius, () => Expression.multipleEdition("Graphics.FillArcCenterRadius", 6, 0));
	
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.PathArcPosPos", 7), this.messages.leafPathArcPosPos, () => Expression.multipleEdition("Graphics.PathArcPosPos", 7, 0));
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.PathArcPosSize", 7), this.messages.leafPathArcPosSize, () => Expression.multipleEdition("Graphics.PathArcPosSize", 7, 0));
	Formulae.addEdition(this.messages.pathArc, Formulae.icon("Graphics.PathArcCenterRadius", 6), this.messages.leafPathArcCenterRadius, () => Expression.multipleEdition("Graphics.PathArcCenterRadius", 6, 0));
	
	Formulae.addEdition(this.messages.pathImage, Formulae.icon("Graphics.DrawImage", 4), this.messages.leafDrawImage, () => Expression.multipleEdition("Graphics.DrawImage", 4, 0));
	
	Formulae.addEdition(this.messages.pathText, Formulae.icon("Graphics.GetTextWidth", 2), this.messages.leafGetTextWidth, () => Expression.multipleEdition("Graphics.GetTextWidth", 2, 0));
	Formulae.addEdition(this.messages.pathText, Formulae.icon("Graphics.DrawText", 4), this.messages.leafDrawText,     () => Expression.multipleEdition("Graphics.DrawText", 4, 0));
	
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.GetPos", 1), this.messages.leafGetPos, () => Expression.wrapperEdition ("Graphics.GetPos"));
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.SetPos", 3), this.messages.leafSetPos, () => Expression.multipleEdition("Graphics.SetPos", 3, 0));
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.OffsetPos", 3), this.messages.leafOffsetPos, () => Expression.multipleEdition("Graphics.OffsetPos", 3, 0));
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.Turtle.GetAngle", 1), this.messages.leafGetAngle, () => Expression.wrapperEdition ("Graphics.Turtle.GetAngle"));
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.Turtle.SetAngle", 2), this.messages.leafSetAngle, () => Expression.multipleEdition("Graphics.Turtle.SetAngle", 2, 0));
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.Turtle.ForwardDrawing", 2), this.messages.leafForwardDrawing, () => Expression.multipleEdition("Graphics.Turtle.ForwardDrawing", 2, 0));
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.Turtle.Forward", 2), this.messages.leafForward, () => Expression.multipleEdition("Graphics.Turtle.Forward", 2, 0));
	Formulae.addEdition(this.messages.pathTurtle, Formulae.icon("Graphics.Turtle.Turn", 2), this.messages.leafTurn, () => Expression.multipleEdition("Graphics.Turtle.Turn", 2, 0));
	
	Formulae.addEdition(this.messages.pathCoordinates, Formulae.icon("Graphics.ResetCoordinates", 1), this.messages.leafResetCoordinates, () => Expression.wrapperEdition ("Graphics.ResetCoordinates"));
	Formulae.addEdition(this.messages.pathCoordinates, Formulae.icon("Graphics.AddTranslation", 3), this.messages.leafAddTranslation, () => Expression.multipleEdition("Graphics.AddTranslation", 3, 0));
	Formulae.addEdition(this.messages.pathCoordinates, Formulae.icon("Graphics.AddScaling", 3), this.messages.leafAddScaling, () => Expression.multipleEdition("Graphics.AddScaling", 3, 0));
	Formulae.addEdition(this.messages.pathCoordinates, Formulae.icon("Graphics.AddRotation", 2), this.messages.leafAddRotation, () => Expression.multipleEdition("Graphics.AddRotation", 2, 0));
	Formulae.addEdition(this.messages.pathCoordinates, Formulae.icon("Graphics.SetCoordinatesPixels0Based", 1), this.messages.leafSetCoordinatesPixels0Based, () => Expression.wrapperEdition ("Graphics.SetCoordinatesPixels0Based"));
	Formulae.addEdition(this.messages.pathCoordinates, Formulae.icon("Graphics.SetCoordinatesPixels1Based", 1), this.messages.leafSetCoordinatesPixels1Based, () => Expression.wrapperEdition ("Graphics.SetCoordinatesPixels1Based"));
	Formulae.addEdition(this.messages.pathCoordinates, Formulae.icon("Graphics.SetCoordinatesMath", 5), this.messages.leafSetCoordinatesMath, () => Expression.multipleEdition("Graphics.SetCoordinatesMath", 5, 0));
};
