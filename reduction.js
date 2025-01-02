/*
Fōrmulæ raster graphic package. Module for reduction.
Copyright (C) 2015-2025 Laurence R. Ugalde

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

Graphics.createRasterGraphics = async (createRasterGraphics, session) => {
	let expr = createRasterGraphics.children[0];
	let width = CanonicalArithmetic.getNativeInteger(expr);
	if (width === undefined || width <= 0) {
		ReductionManager.setInError(expr, "Invalid value");
		throw new ReductionError();
	}
	
	expr = createRasterGraphics.children[1];
	let height = CanonicalArithmetic.getNativeInteger(expr);
	if (height === undefined || height <= 0) {
		ReductionManager.setInError(expr, "Invalid value");
		throw new ReductionError();
	}
	
	let color = null;
	if (createRasterGraphics.children.length >= 3) {
		expr = createRasterGraphics.children[2];
		
		if (expr.getTag() !== "Color.Color") {
			ReductionManager.setInError(expr, "invalid expression");
			throw new ReductionError();
		}
		else {
			color = expr;
		}
	}
	
	let canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	let context = canvas.getContext("2d");
	
	let result = Formulae.createExpression("Graphics.RasterGraphics");
	result.set("Value", context);
	
	if (color !== null) {
		let bkpFillStyle = context.fillStyle;

		context.fillStyle =
			"rgba(" +
			(color.get("Red")   * 100.0).toString() + "%," +
			(color.get("Green") * 100.0).toString() + "%," +
			(color.get("Blue")  * 100.0).toString() + "%," +
			color.get("Alpha").toString() + ")"
		;
		context.fillRect(0, 0, width, height);

		context.fillStyle = bkpFillStyle;
	}
	
	createRasterGraphics.replaceBy(result);
	return true;
};

Graphics.copyRasterGraphics = async (copyRasterGraphics, session) => {
	let source = copyRasterGraphics.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let oldCanvas = source.get("Value").canvas;
    let newCanvas = document.createElement("canvas");

    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    let newContext = newCanvas.getContext("2d");
    newContext.drawImage(oldCanvas, 0, 0);
	
	let result = Formulae.createExpression("Graphics.RasterGraphics");
	result.set("Value", newContext);
	copyRasterGraphics.replaceBy(result);
	return true;
};

Graphics.getSize = async (getSize, session) => {
	let source = getSize.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let canvas = source.get("Value").canvas;
	let result = Formulae.createExpression("List.List");
	result.addChild(
		CanonicalArithmetic.createInternalNumber(
			CanonicalArithmetic.createInteger(canvas.width, session)
		)
	);
	result.addChild(
		CanonicalArithmetic.createInternalNumber(
			CanonicalArithmetic.createInteger(canvas.height, session)
		)
	);
	
	getSize.replaceBy(result);
	return true;
};

Graphics.getPixel = async (getPixel, session) => {
	let source = getPixel.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let canvas = source.get("Value").canvas;
	
	// x
	
	let x = CanonicalArithmetic.getNativeInteger(getPixel.children[1]);
	if (x === undefined) {
		ReductionManager.setInError(getPixel.children[1], "Expression must be numeric");
		throw new ReductionError();
	}
	if (x < 0) {
		x = canvas.width + x + 1;
	}
	if (x <=  0 || x > canvas.width) {
		ReductionManager.setInError(getPixel.children[1], "Position out of bounds");
		throw new ReductionError();
	}
	
	// y
	
	let y = CanonicalArithmetic.getNativeInteger(getPixel.children[2]);
	if (y === undefined) {
		ReductionManager.setInError(getPixel.children[2], "Expression must be numeric");
		throw new ReductionError();
	}
	if (y < 0) {
		y = canvas.height + y + 1;
	}
	if (y <=  0 || y > canvas.height) {
		ReductionManager.setInError(getPixel.children[2], "Position out of bounds");
		throw new ReductionError();
	}
	
	let result = Formulae.createExpression("Color.Color");
	
	let data = canvas.getContext("2d").getImageData(x - 1, y - 1, 1, 1).data;
	result.set("Red",   data[0] / 255);
	result.set("Green", data[1] / 255);
	result.set("Blue",  data[2] / 255);
	result.set("Alpha", data[3] / 255);
	
	getPixel.replaceBy(result);
	return true;
};

Graphics.setPixel = async (setPixel, session) => {
	let source = setPixel.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let context = source.get("Value");
	let canvas = context.canvas;
	
	// x
	
	let x = CanonicalArithmetic.getNativeInteger(setPixel.children[1]);
	if (x === undefined) {
		ReductionManager.setInError(setPixel.children[1], "Expression must be numeric");
		throw new ReductionError();
	}
	if (x < 0) {
		x = canvas.width + x + 1;
	}
	if (x <=  0 || x > canvas.width) {
		ReductionManager.setInError(setPixel.children[1], "Position out of bounds");
		throw new ReductionError();
	}
	
	// y
	
	let y = CanonicalArithmetic.getNativeInteger(setPixel.children[2]);
	if (y === undefined) {
		ReductionManager.setInError(setPixel.children[2], "Expression must be numeric");
		throw new ReductionError();
	}
	if (y < 0) {
		y = canvas.height + y + 1;
	}
	if (y <=  0 || y > canvas.height) {
		ReductionManager.setInError(setPixel.children[2], "Position out of bounds");
		throw new ReductionError();
	}
	
	// color
	
	let color = setPixel.children[3];
	if (color.getTag() !== "Color.Color") {
		ReductionManager.setInError(color, "Expression muste be a color");
		throw new ReductionError();
	}
	
	// ok, do the job
	
	let imageData = context.createImageData(1, 1);
	let data = imageData.data;
	
	data[0] = Math.floor(color.get("Red"  ) * 255);
	data[1] = Math.floor(color.get("Green") * 255);
	data[2] = Math.floor(color.get("Blue" ) * 255);
	data[3] = Math.floor(color.get("Alpha") * 255);
	
	context.putImageData(imageData, x - 1, y - 1);
	
	return true;
};

Graphics.createPath = async (createPath, session) => {
	let result = Formulae.createExpression("Graphics.Path");
	createPath.replaceBy(result);
	return true;
};

Graphics.drawFillPath = async (drawFillPath, session) => {
	let source = drawFillPath.children[0];
	
	if (source.getTag() !== "Graphics.RasterGraphics") {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
	}
	
	let path = drawFillPath.children[1];
	
	if (path.getTag() !== "Graphics.Path") {
		ReductionManager.setInError(path, "Expression must be a path");
		throw new ReductionError();
	}
	
	let context = source.get("Value");
	
	if (drawFillPath.getTag() === "Graphics.DrawPath") {
		context.stroke(path.get("Value"));
	}
	else {
		context.fill(path.get("Value"));
	}
	
	return true;
};

Graphics.drawLine = async (drawLine, session) => {
	let source = drawLine.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let context = source.get("Value");
	let endx, endy;
	
	try {
		switch (drawLine.getTag()) {
			case "Graphics.DrawLinePosPos": {
					let startx = drawLine.children[1].evaluate();
					let starty = drawLine.children[2].evaluate();
					endx = drawLine.children[3].evaluate();
					endy = drawLine.children[4].evaluate();
					
					context.beginPath();
					context.moveTo(startx, starty);
					context.lineTo(endx, endy);
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.DrawLinePosOffset": {
					let startx = drawLine.children[1].evaluate();
					let starty = drawLine.children[2].evaluate();
					endx = startx + drawLine.children[3].evaluate();
					endy = starty + drawLine.children[4].evaluate();
					
					context.beginPath();
					context.moveTo(startx, starty);
					context.lineTo(endx, endy);
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.DrawLineToPos": {
					endx = drawLine.children[1].evaluate();
					endy = drawLine.children[2].evaluate();
					//console.log(endx + " " + endy);
					
					context.beginPath();
					context.moveTo(source.get("X"), source.get("Y"));
					context.lineTo(endx, endy);
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.DrawLineToOffset": {
					let startx = source.get("X");
					let starty = source.get("Y");
					endx = startx + drawLine.children[1].evaluate();
					endy = starty + drawLine.children[2].evaluate();
					
					context.beginPath();
					context.moveTo(startx, starty);
					context.lineTo(endx, endy);
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
		}
		
		source.set("X", endx);
		source.set("Y", endy);
		
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(drawLine, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.pathLine = async (pathLine, session) => {
	let source = pathLine.children[0];
	
	switch (source.getTag()) {
		case "Graphics.Path":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let path = source.get("Value");
	let endx, endy;
	
	try {
		switch (pathLine.getTag()) {
			case "Graphics.PathLinePosPos": {
					let startx = pathLine.children[1].evaluate();
					let starty = pathLine.children[2].evaluate();
					endx = pathLine.children[3].evaluate();
					endy = pathLine.children[4].evaluate();
					
					path.moveTo(startx, starty);
					path.lineTo(endx, endy);
				}
				break;
			
			case "Graphics.PathLinePosOffset": {
					let startx = pathLine.children[1].evaluate();
					let starty = pathLine.children[2].evaluate();
					endx = startx + pathLine.children[3].evaluate();
					endy = starty + pathLine.children[4].evaluate();
					
					path.moveTo(startx, starty);
					path.lineTo(endx, endy);
					
				}
				break;
			
			case "Graphics.PathLineToPos": {
					endx = pathLine.children[1].evaluate();
					endy = pathLine.children[2].evaluate();
					
					path.lineTo(endx, endy);
				}
				break;
			
			case "Graphics.PathLineToOffset": {
					endx = startx + pathLine.children[1].evaluate();
					endy = starty + pathLine.children[2].evaluate();
					
					path.lineTo(endx, endy);
				}
				break;
		}
		
		source.set("X", endx);
		source.set("Y", endy);
		
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(pathLine, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.drawFillRectangle = async (drawFillRectangle, session) => {
	let source = drawFillRectangle.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
		case "Graphics.Path":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics or a path");
			throw new ReductionError();
		}
	}
	
	let context = source.get("Value");
	
	try {
		switch (drawFillRectangle.getTag()) {
			case "Graphics.DrawRectanglePosPos": {
					let x1 = drawFillRectangle.children[1].evaluate();
					let y1 = drawFillRectangle.children[2].evaluate();
					let x2 = drawFillRectangle.children[3].evaluate();
					let y2 = drawFillRectangle.children[4].evaluate();
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					context.beginPath();
					context.rect(
						x1,
						y1,
						x2 - x1,
						y2 - y1
					);
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.DrawRectanglePosSize": {
					let x1 = drawFillRectangle.children[1].evaluate();
					let y1 = drawFillRectangle.children[2].evaluate();
					let x2 = x1 + drawFillRectangle.children[3].evaluate();
					let y2 = y1 + drawFillRectangle.children[4].evaluate();
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					context.beginPath();
					context.rect(
						x1,
						y1,
						x2 - x1,
						y2 - y1
					);
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.FillRectanglePosPos": {
					let x1 = drawFillRectangle.children[1].evaluate();
					let y1 = drawFillRectangle.children[2].evaluate();
					let x2 = drawFillRectangle.children[3].evaluate();
					let y2 = drawFillRectangle.children[4].evaluate();
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					context.fillRect(
						x1,
						y1,
						x2 - x1,
						y2 - y1
					);
				}
				break;
			
			case "Graphics.FillRectanglePosSize": {
					let x1 = drawFillRectangle.children[1].evaluate();
					let y1 = drawFillRectangle.children[2].evaluate();
					let x2 = x1 + drawFillRectangle.children[3].evaluate();
					let y2 = y1 + drawFillRectangle.children[4].evaluate();
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					context.fillRect(
						x1,
						y1,
						x2 - x1,
						y2 - y1
					);
				}
				break;
			
			case "Graphics.PathRectanglePosPos": {
					let x1 = drawFillRectangle.children[1].evaluate();
					let y1 = drawFillRectangle.children[2].evaluate();
					let x2 = drawFillRectangle.children[3].evaluate();
					let y2 = drawFillRectangle.children[4].evaluate();
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					context.rect(
						x1,
						y1,
						x2 - x1,
						y2 - y1
					);
				}
				break;
			
			case "Graphics.PathRectanglePosSize": {
					let x1 = drawFillRectangle.children[1].evaluate();
					let y1 = drawFillRectangle.children[2].evaluate();
					let x2 = x1 + drawFillRectangle.children[3].evaluate();
					let y2 = y1 + drawFillRectangle.children[4].evaluate();
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					context.rect(
						x1,
						y1,
						x2 - x1,
						y2 - y1
					);
				}
				break;
		}
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(drawFillRectangle, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.drawFillEllipseArc = async (drawFillEllipseArc, session) => {
	let source = drawFillEllipseArc.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
		case "Graphics.Path":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let context = source.get("Value");
	
	try {
		switch (drawFillEllipseArc.getTag()) {
			case "Graphics.DrawEllipsePosPos": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = drawFillEllipseArc.children[3].evaluate();
					let y2 = drawFillEllipseArc.children[4].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, 0, 2 * Math.PI); 
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
					
			case "Graphics.DrawEllipsePosSize": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = x1 + drawFillEllipseArc.children[3].evaluate();
					let y2 = y1 + drawFillEllipseArc.children[4].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, 0, 2 * Math.PI);
					 
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.DrawEllipseCenterRadius": {
					let cx = drawFillEllipseArc.children[1].evaluate();
					let cy = drawFillEllipseArc.children[2].evaluate();
					
					let rx, ry;
					let radius = drawFillEllipseArc.children[3];
					if (radius.getTag() === "List.List") {
						if (radius.children.length != 2) {
							ReductionManager.setInError(radius, "Expression must be a 2-element list");
							throw new ReductionError();
						}
						
						rx = radius.children[0].evaluate();
						ry = radius.children[1].evaluate();
					}
					else {
						rx = ry = radius.evaluate();
					}
					
					context.beginPath();
					context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.FillEllipsePosPos": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = drawFillEllipseArc.children[3].evaluate();
					let y2 = drawFillEllipseArc.children[4].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, 0, 2 * Math.PI); 
					context.fill();
				}
				break;
					
			case "Graphics.FillEllipsePosSize": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = x1 + drawFillEllipseArc.children[3].evaluate();
					let y2 = y1 + drawFillEllipseArc.children[4].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, 0, 2 * Math.PI); 
					context.fill();
				}
				break;
			
			case "Graphics.FillEllipseCenterRadius": {
					let cx = drawFillEllipseArc.children[1].evaluate();
					let cy = drawFillEllipseArc.children[2].evaluate();
					
					let rx, ry;
					let radius = drawFillEllipseArc.children[3];
					if (radius.getTag() === "List.List") {
						if (radius.children.length != 2) {
							ReductionManager.setInError(radius, "Expression must be a 2-element list");
							throw new ReductionError();
						}
						
						rx = radius.children[0].evaluate();
						ry = radius.children[1].evaluate();
					}
					else {
						rx = ry = radius.evaluate();
					}
					
					context.beginPath();
					context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
					context.fill();
				}
				break;
			
			case "Graphics.PathEllipsePosPos": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = drawFillEllipseArc.children[3].evaluate();
					let y2 = drawFillEllipseArc.children[4].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, 0, 2 * Math.PI); 
				}
				break;
					
			case "Graphics.PathEllipsePosSize": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = x1 + drawFillEllipseArc.children[3].evaluate();
					let y2 = y1 + drawFillEllipseArc.children[4].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, 0, 2 * Math.PI); 
				}
				break;
			
			case "Graphics.PathEllipseCenterRadius": {
					let cx = drawFillEllipseArc.children[1].evaluate();
					let cy = drawFillEllipseArc.children[2].evaluate();
					
					let rx, ry;
					let radius = drawFillEllipseArc.children[3];
					if (radius.getTag() === "List.List") {
						if (radius.children.length != 2) {
							ReductionManager.setInError(radius, "Expression must be a 2-element list");
							throw new ReductionError();
						}
						
						rx = radius.children[0].evaluate();
						ry = radius.children[1].evaluate();
					}
					else {
						rx = ry = radius.evaluate();
					}
					
					context.ellipse(cx, cy, rx, ry, 0, 0, 2 * Math.PI);
				}
				break;
			
			case "Graphics.DrawArcPosPos": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = drawFillEllipseArc.children[3].evaluate();
					let y2 = drawFillEllipseArc.children[4].evaluate();
					let as = drawFillEllipseArc.children[5].evaluate();
					let ae = drawFillEllipseArc.children[6].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, as * Math.PI / 180, ae * Math.PI / 180, 2 * Math.PI); 
					if (source.get("ArcAsPie")) {
						context.lineTo(cx, cy);
						context.closePath();
					}
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.DrawArcPosSize": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = x1 + drawFillEllipseArc.children[3].evaluate();
					let y2 = y1 + drawFillEllipseArc.children[4].evaluate();
					let as = drawFillEllipseArc.children[5].evaluate();
					let ae = drawFillEllipseArc.children[6].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, as * Math.PI / 180, ae * Math.PI / 180, 2 * Math.PI); 
					if (source.get("ArcAsPie")) {
						context.lineTo(cx, cy);
						context.closePath();
					}
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
			
			case "Graphics.DrawArcCenterRadius": {
					let cx = drawFillEllipseArc.children[1].evaluate();
					let cy = drawFillEllipseArc.children[2].evaluate();
					
					let rx, ry;
					let radius = drawFillEllipseArc.children[3];
					if (radius.getTag() === "List.List") {
						if (radius.children.length != 2) {
							ReductionManager.setInError(radius, "Expression must be a 2-element list");
							throw new ReductionError();
						}
						
						rx = radius.children[0].evaluate();
						ry = radius.children[1].evaluate();
					}
					else {
						rx = ry = radius.evaluate();
					}
					let as = drawFillEllipseArc.children[4].evaluate();
					let ae = drawFillEllipseArc.children[5].evaluate();
					
					context.beginPath();
					context.ellipse(cx, cy, rx, ry, 0, as * Math.PI / 180, ae * Math.PI / 180);
					if (source.get("ArcAsPie")) {
						context.lineTo(cx, cy);
						context.closePath();
					}
					
					if (source.get("ScaleSet") && !source.get("StrokeAffectedByScale")) {
						let matrix = context.getTransform();
						context.resetTransform();
						context.stroke();
						context.setTransform(matrix);
					}
					else {
						context.stroke();
					}
				}
				break;
				
			case "Graphics.FillArcPosPos": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = drawFillEllipseArc.children[3].evaluate();
					let y2 = drawFillEllipseArc.children[4].evaluate();
					let as = drawFillEllipseArc.children[5].evaluate();
					let ae = drawFillEllipseArc.children[6].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, as * Math.PI / 180, ae * Math.PI / 180, 2 * Math.PI); 
					context.lineTo(cx, cy);
					context.closePath();
					context.fill();
				}
				break;
			
			case "Graphics.FillArcPosSize": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = x1 + drawFillEllipseArc.children[3].evaluate();
					let y2 = y1 + drawFillEllipseArc.children[4].evaluate();
					let as = drawFillEllipseArc.children[5].evaluate();
					let ae = drawFillEllipseArc.children[6].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.beginPath();
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, as * Math.PI / 180, ae * Math.PI / 180, 2 * Math.PI); 
					context.lineTo(cx, cy);
					context.closePath();
					context.fill();
				}
				break;
			
			case "Graphics.FillArcCenterRadius": {
					let cx = drawFillEllipseArc.children[1].evaluate();
					let cy = drawFillEllipseArc.children[2].evaluate();
					
					let rx, ry;
					let radius = drawFillEllipseArc.children[3];
					if (radius.getTag() === "List.List") {
						if (radius.children.length != 2) {
							ReductionManager.setInError(radius, "Expression must be a 2-element list");
							throw new ReductionError();
						}
						
						rx = radius.children[0].evaluate();
						ry = radius.children[1].evaluate();
					}
					else {
						rx = ry = radius.evaluate();
					}
					let as = drawFillEllipseArc.children[4].evaluate();
					let ae = drawFillEllipseArc.children[5].evaluate();
					
					context.beginPath();
					context.ellipse(cx, cy, rx, ry, 0, as * Math.PI / 180, ae * Math.PI / 180);
					context.lineTo(cx, cy);
					context.closePath();
					context.fill();
				}
				break;
			
			case "Graphics.PathArcPosPos": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = drawFillEllipseArc.children[3].evaluate();
					let y2 = drawFillEllipseArc.children[4].evaluate();
					let as = drawFillEllipseArc.children[5].evaluate();
					let ae = drawFillEllipseArc.children[6].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, as * Math.PI / 180, ae * Math.PI / 180, 2 * Math.PI); 
				}
				break;
			
			case "Graphics.PathArcPosSize": {
					let x1 = drawFillEllipseArc.children[1].evaluate();
					let y1 = drawFillEllipseArc.children[2].evaluate();
					let x2 = x1 + drawFillEllipseArc.children[3].evaluate();
					let y2 = y1 + drawFillEllipseArc.children[4].evaluate();
					let as = drawFillEllipseArc.children[5].evaluate();
					let ae = drawFillEllipseArc.children[6].evaluate();
					
					if (x2 < x1) { let tmp = x2; x2 = x1; x1 = tmp; }
					if (y2 < y1) { let tmp = y2; y2 = y1; y1 = tmp; }
					
					let semix = (x2 - x1) / 2;
					let semiy = (y2 - y1) / 2;
					
					context.ellipse(x1 + semix, y1 + semiy, semix, semiy, 0, as * Math.PI / 180, ae * Math.PI / 180, 2 * Math.PI); 
				}
				break;
			
			case "Graphics.PathArcCenterRadius": {
					let cx = drawFillEllipseArc.children[1].evaluate();
					let cy = drawFillEllipseArc.children[2].evaluate();
					
					let rx, ry;
					let radius = drawFillEllipseArc.children[3];
					if (radius.getTag() === "List.List") {
						if (radius.children.length != 2) {
							ReductionManager.setInError(radius, "Expression must be a 2-element list");
							throw new ReductionError();
						}
						
						rx = radius.children[0].evaluate();
						ry = radius.children[1].evaluate();
					}
					else {
						rx = ry = radius.evaluate();
					}
					let as = drawFillEllipseArc.children[4].evaluate();
					let ae = drawFillEllipseArc.children[5].evaluate();
					
					context.ellipse(cx, cy, rx, ry, 0, as * Math.PI / 180, ae * Math.PI / 180, ae < as);
				}
				break;
		}
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(drawFillEllipseArc, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.setColor = async (setColor, session) => {
	let source = setColor.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let color = setColor.children[1];
	if (color.getTag() !== "Color.Color") {
		ReductionManager.setInError(color, "Expression is not a color");
		throw new ReductionError();
	}
	
	let context = source.get("Value");
	context.fillStyle = context.strokeStyle = "rgba(" +
		(color.get("Red")   * 100.0).toString() + "%," +
		(color.get("Green") * 100.0).toString() + "%," +
		(color.get("Blue")  * 100.0).toString() + "%," +
		color.get("Alpha").toString() + ")"
	;
	
	return true;
};
	
Graphics.setState = async (setState, session) => {
	let source = setState.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let context = source.get("Value");
	
	switch (setState.getTag()) {
		case "Graphics.SetStrokeWidth": {
				let width;
				try {
					width = setState.children[1].evaluate();
				}
				catch (error) {
					if (error instanceof EvaluationError) {
						ReductionManager.setInError(setState.children[1], "Argument is not numeric");
						throw new ReductionError();
					}
					
					throw error;
				}
				
				context.lineWidth = width;
				
				/*
				source.set(GraphicsExpression.ARGUMENT_STROKE_WIDTH, width);
				
				if (((Boolean) source.get(GraphicsExpression.ARGUMENT_STROKE_AFFECTED_BY_SCALE))) {
					g.setStroke(new TransformedStroke(new BasicStroke(width), g.getTransform()));
				}
				else {
					g.setStroke(new BasicStroke(
						width,
						BasicStroke.CAP_SQUARE,
						BasicStroke.JOIN_BEVEL
					));
				}
				*/
			}
			break;
		
		case "Graphics.SetStrokeAffectedByScale": {
				let set;
				let booleanExpression = setState.children[1];
				if (booleanExpression.getTag() == "Logic.True") {
					set = true;
				}
				else if (booleanExpression.getTag() == "Logic.False") {
					set = false;
				}
				else {
					ReductionManager.setInError(booleanExpression, "Expression must be boolean");
					throw new ReductionError();
				}
				
				source.set("StrokeAffectedByScale", set);				
			}
			break;
		
		case "Graphics.SetPaintMode":
			context.globalCompositeOperation = "source-over";
			break;
		
		case "Graphics.SetXORMode":
			context.globalCompositeOperation = "difference";
			break;
		
		case "Graphics.SetDrawingArcOpen":
			source.set("ArcAsPie", false);
			break;
		
		case "Graphics.SetDrawingArcAsPie":
			source.set("ArcAsPie", true);
			break;
			
		/*
		case GraphicsDescriptor.TAG_SET_ANTIALIAS: {
				boolean set;
				Expression booleanExpression = setState.getChild(1);
				if (booleanExpression.getTag().equals(GraphicsDescriptor.TAG_TRUE)) {
					set = true;
				}
				else if (booleanExpression.getTag().equals(GraphicsDescriptor.TAG_FALSE)) {
					set = false;
				}
				else {
					Util.setInError(session.getFactory(), booleanExpression, "Expression must be boolean");
					throw new ReductionException();
				}
				
				g.setRenderingHint(
					RenderingHints.KEY_ANTIALIASING,
					set ? RenderingHints.VALUE_ANTIALIAS_ON : RenderingHints.VALUE_ANTIALIAS_OFF
				);
			}
			break;
		*/
	}
	
	return true;
};

Graphics.transformation = async (transformation, session) => {
	let source = transformation.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let context = source.get("Value");
	
	try {
		switch (transformation.getTag()) {
			case "Graphics.ResetCoordinates":
				context.resetTransform();
				source.set("ScaleSet", false);				
				break;
			
			case "Graphics.AddTranslation":
				context.translate(
					transformation.children[1].evaluate(),
					transformation.children[2].evaluate()
				);
				break;
			
			case "Graphics.AddScaling":
				context.scale(
					transformation.children[1].evaluate(),
					transformation.children[2].evaluate()
				);
				source.set("ScaleSet", true);				
				/*
				if (!((Boolean) source.get(GraphicsExpression.ARGUMENT_STROKE_AFFECTED_BY_SCALE))) {
					//g.setStroke(new TransformedStroke(new BasicStroke(1.0f), g.getTransform()));
					g.setStroke(new TransformedStroke(new BasicStroke((float) source.get(GraphicsExpression.ARGUMENT_STROKE_WIDTH)), g.getTransform()));
				}
				*/
				break;
			
			case "Graphics.AddRotation":
				context.rotate(
					transformation.children[1].evaluate(),
				);
				break;
			
			/*
			case GraphicsDescriptor.TAG_SET_COORDINATES_PIXELS_0:
				g.getTransform().setToIdentity();
				g.translate(0.5, 0.5);
				break;
				
			case GraphicsDescriptor.TAG_SET_COORDINATES_PIXELS_1:
				g.getTransform().setToIdentity();
				g.translate(-0.5, -0.5);
				break;
			*/
			
			case "Graphics.SetCoordinatesMath": {
					let lbx = transformation.children[1].evaluate();
					let lby = transformation.children[2].evaluate();
					let rtx = transformation.children[3].evaluate();
					let rty = transformation.children[4].evaluate();
					if (lbx == rtx || lby == rty) throw new EvaluationError();
					let w = context.canvas.width;
					let h = context.canvas.height;
					
					context.resetTransform();
					context.translate(0, h);
					context.scale(w / (rtx - lbx), h / (lby - rty));
					context.translate(-lbx, -lby);
					source.set("ScaleSet", true);				
					
					/*
					if (!((Boolean) source.get(GraphicsExpression.ARGUMENT_STROKE_AFFECTED_BY_SCALE))) {
						//g.setStroke(new TransformedStroke(new BasicStroke(1.0f), g.getTransform()));
						g.setStroke(new TransformedStroke(new BasicStroke((float) source.get(GraphicsExpression.ARGUMENT_STROKE_WIDTH)), g.getTransform()));
					}
					*/
				}
				break;
		}
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(transformation, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.getPosAngle = async (getPosAngle, session) => {
	let source = getPosAngle.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
		case "Graphics.Path":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let result;
	
	switch (getPosAngle.getTag()) {
		case "Graphics.GetPos":
			result = Formulae.createExpression("List.List");
			result.addChild(
				CanonicalArithmetic.createInternalNumber(
					CanonicalArithmetic.createDecimal(source.get("X"), session)
				)
			);
			result.addChild(
				CanonicalArithmetic.createInternalNumber(
					CanonicalArithmetic.createDecimal(source.get("Y"), session)
				)
			);
			break;
			
		case "Graphics.Turtle.GetAngle":
			result = CanonicalArithmetic.createInternalNumber(
				CanonicalArithmetic.createDecimal(source.get("Angle"), session)
			);
			break;
	}
	
	getPosAngle.replaceBy(result);
	return true;
};

Graphics.setOffsetPosAngle = async (setOffsetPosAngle, session) => {
	let source = setOffsetPosAngle.children[0];
	let isPath;
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			isPath = false;
			break;
		
		case "Graphics.Path":
			isPath = true;
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics or a path");
			throw new ReductionError();
		}
	}
	
	try {
		switch (setOffsetPosAngle.getTag()) {
			case "Graphics.SetPos": {
					let x, y;
					
					if (setOffsetPosAngle.children.length == 2) {
						if (setOffsetPosAngle.children[1].getTag() !== "List.List") {
							ReductionManager.setInError(setOffsetPosAngle.children[1], "Expression must be a list");
							throw new ReductionError();
						}
						
						x = setOffsetPosAngle.children[1].children[0].evaluate();
						y = setOffsetPosAngle.children[1].children[1].evaluate();
					}
					else { // 3
						x = setOffsetPosAngle.children[1].evaluate();
						y = setOffsetPosAngle.children[2].evaluate();
					}
					
					source.set("X", x);
					source.set("Y", y);
					
					if (isPath) {
						source.get("Value").moveTo(x, y);
					}
					
					break;
				}
			
			case "Graphics.OffsetPos": {
					let x = source.get("X") + setOffsetPosAngle.children[1].evaluate();
					let y = source.get("Y") + setOffsetPosAngle.children[2].evaluate();
					
					source.set("X", x);
					source.set("Y", y);
					
					if (isPath) {
						source.get("Value").moveTo(x, y);
					}
					
					break;
				}
			
			case "Graphics.Turtle.SetAngle":
				source.set("Angle", setOffsetPosAngle.children[1].evaluate());
				break;
			
			case "Graphics.Turtle.Turn":
				source.set("Angle", source.get("Angle") + setOffsetPosAngle.children[1].evaluate());
				break;
		}
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(setOffsetPosAngle, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.forward = async (forward, session) => {
	let source = forward.children[0];
	
	let isPath;
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			isPath = false;
			break;
		
		case "Graphics.Path":
			isPath = true;
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	try {
		let units = forward.children[1].evaluate();
		let x0 = source.get("X");
		let y0 = source.get("Y");
		let angle = source.get("Angle") * Math.PI / 180;
		
		let x1 = x0 + (units * Math.cos(angle));
		let y1 = y0 - (units * Math.sin(angle));
		
		if (forward.getTag() === "Graphics.Turtle.ForwardDrawing") {
			if (isPath) {
				source.get("Value").lineTo(x1, y1);
			}
			else {
				let context = source.get("Value");
				context.beginPath();
				context.moveTo(x0, y0);
				context.lineTo(x1, y1);
				context.stroke();
			}
		}
		else { // forward without drawing
			source.get("Value").moveTo(x1, y1);
		}
		
		source.set("X", x1);
		source.set("Y", y1);
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(forward, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.drawImage = async (drawImage, session) => {
	let source = drawImage.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let rasterGraphicsExpression = drawImage.children[1];
	if (rasterGraphicsExpression.getTag() !== "Graphics.RasterGraphics") {
		ReductionManager.setInError(rasterGraphicsExpression, "Expression is not a raster graphics");
		throw new ReductionError();
	}
	
	try {
		source.get("Value").drawImage(
			rasterGraphicsExpression.get("Value").canvas,
			drawImage.children[2].evaluate(),
			drawImage.children[3].evaluate()
		);
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(drawImage, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.getTextWidth = async (getTextWidth, session) => {
	let source = getTextWidth.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let stringExpression = getTextWidth.children[1];
	if (stringExpression.getTag() !== "String.String") {
		ReductionManager.setInError(stringExpression, "Expression must be a string");
		throw new ReductionError();
	}
	
	getTextWidth.replaceBy(
		CanonicalArithmetic.createInternalNumber(
			CanonicalArithmetic.createInteger(
				source.get("Value").measureText(stringExpression.get("Value")).width,
				session
			)
		)
	);
	return true;
};
	
Graphics.drawText = async (drawText, session) => {
	let source = drawText.children[0];
	
	switch (source.getTag()) {
		case "Graphics.RasterGraphics":
			break;
		
		default: {
			ReductionManager.setInError(source, "Expression must be a raster graphics");
			throw new ReductionError();
		}
	}
	
	let stringExpression = drawText.children[1];
	if (stringExpression.getTag() !== "String.String") {
		ReductionManager.setInError(stringExpression, "Expression must be a string");
		throw new ReductionError();
	}
	
	try {
		source.get("Value").fillText(
			stringExpression.get("Value"),
			drawText.children[2].evaluate(),
			drawText.children[3].evaluate()
		);
	}
	catch (error) {
		if (error instanceof EvaluationError) {
			ReductionManager.setInError(drawText, "Argument is not numeric");
			throw new ReductionError();
		}
		
		throw error;
	}
	
	return true;
};

Graphics.setReducers = () => {
	ReductionManager.addReducer("Graphics.CreateRasterGraphics", Graphics.createRasterGraphics, "Graphics.createRasterGraphics");
	ReductionManager.addReducer("Graphics.CopyRasterGraphics",   Graphics.copyRasterGraphics,   "Graphics.copyRasterGraphics");
	ReductionManager.addReducer("Graphics.GetSize",              Graphics.getSize,              "Graphics.getSize");
	
	ReductionManager.addReducer("Graphics.GetPixel", Graphics.getPixel, "Graphics.getPixel");
	ReductionManager.addReducer("Graphics.SetPixel", Graphics.setPixel, "Graphics.setPixel");
	
	ReductionManager.addReducer("Graphics.CreatePath", Graphics.createPath, "Graphics.createPath");
	ReductionManager.addReducer("Graphics.DrawPath", Graphics.drawFillPath, "Graphics.drawFillPath");
	ReductionManager.addReducer("Graphics.FillPath", Graphics.drawFillPath, "Graphics.drawFillPath");
	
	ReductionManager.addReducer("Graphics.DrawLinePosPos",    Graphics.drawLine, "Graphics.drawLine");
	ReductionManager.addReducer("Graphics.DrawLinePosOffset", Graphics.drawLine, "Graphics.drawLine");
	ReductionManager.addReducer("Graphics.DrawLineToPos",     Graphics.drawLine, "Graphics.drawLine");
	ReductionManager.addReducer("Graphics.DrawLineToOffset",  Graphics.drawLine, "Graphics.drawLine");
	ReductionManager.addReducer("Graphics.PathLinePosPos",    Graphics.pathLine, "Graphics.pathLine");
	ReductionManager.addReducer("Graphics.PathLinePosOffset", Graphics.pathLine, "Graphics.pathLine");
	ReductionManager.addReducer("Graphics.PathLineToPos",     Graphics.pathLine, "Graphics.pathLine");
	ReductionManager.addReducer("Graphics.PathLineToOffset",  Graphics.pathLine, "Graphics.pathLine");
	
	ReductionManager.addReducer("Graphics.DrawRectanglePosPos",  Graphics.drawFillRectangle, "Graphics.drawFillRectangle");
	ReductionManager.addReducer("Graphics.DrawRectanglePosSize", Graphics.drawFillRectangle, "Graphics.drawFillRectangle");
	
	ReductionManager.addReducer("Graphics.FillRectanglePosPos",  Graphics.drawFillRectangle, "Graphics.drawFillRectangle");
	ReductionManager.addReducer("Graphics.FillRectanglePosSize", Graphics.drawFillRectangle, "Graphics.drawFillRectangle");
	
	ReductionManager.addReducer("Graphics.PathRectanglePosPos",  Graphics.drawFillRectangle, "Graphics.drawFillRectangle");
	ReductionManager.addReducer("Graphics.PathRectanglePosSize", Graphics.drawFillRectangle, "Graphics.drawFillRectangle");
	
	ReductionManager.addReducer("Graphics.DrawEllipsePosPos",       Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.DrawEllipsePosSize",      Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.DrawEllipseCenterRadius", Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	
	ReductionManager.addReducer("Graphics.FillEllipsePosPos",       Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.FillEllipsePosSize",      Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.FillEllipseCenterRadius", Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	
	ReductionManager.addReducer("Graphics.PathEllipsePosPos",       Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.PathEllipsePosSize",      Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.PathEllipseCenterRadius", Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	
	ReductionManager.addReducer("Graphics.DrawArcPosPos",           Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.DrawArcPosSize",          Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.DrawArcCenterRadius",     Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	
	ReductionManager.addReducer("Graphics.FillArcPosPos",           Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.FillArcPosSize",          Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.FillArcCenterRadius",     Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	
	ReductionManager.addReducer("Graphics.PathArcPosPos",           Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.PathArcPosSize",          Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	ReductionManager.addReducer("Graphics.PathArcCenterRadius",     Graphics.drawFillEllipseArc, "Graphics.drawFillEllipseArc");
	
	ReductionManager.addReducer("Graphics.SetColor", Graphics.setColor, "Graphics.setColor");
	
	ReductionManager.addReducer("Graphics.SetStrokeWidth",           Graphics.setState, "Graphics.setState");
	ReductionManager.addReducer("Graphics.SetDrawingArcOpen",        Graphics.setState, "Graphics.setState");
	ReductionManager.addReducer("Graphics.SetDrawingArcAsPie",       Graphics.setState, "Graphics.setState");
	ReductionManager.addReducer("Graphics.SetPaintMode",             Graphics.setState, "Graphics.setState");
	ReductionManager.addReducer("Graphics.SetXORMode",               Graphics.setState, "Graphics.setState");
	ReductionManager.addReducer("Graphics.SetStrokeAffectedByScale", Graphics.setState, "Graphics.setState");
	
	ReductionManager.addReducer("Graphics.ResetCoordinates",   Graphics.transformation, "Graphics.transformation");
	ReductionManager.addReducer("Graphics.AddTranslation",     Graphics.transformation, "Graphics.transformation");
	ReductionManager.addReducer("Graphics.AddScaling",         Graphics.transformation, "Graphics.transformation");
	ReductionManager.addReducer("Graphics.AddRotation",        Graphics.transformation, "Graphics.transformation");
	ReductionManager.addReducer("Graphics.SetCoordinatesMath", Graphics.transformation, "Graphics.transformation");
	
	ReductionManager.addReducer("Graphics.GetPos",                Graphics.getPosAngle,       "Graphics.getPosAngle");
	ReductionManager.addReducer("Graphics.SetPos",                Graphics.setOffsetPosAngle, "Graphics.setOffsetPosAngle");
	ReductionManager.addReducer("Graphics.OffsetPos",             Graphics.setOffsetPosAngle, "Graphics.setOffsetPosAngle");
	ReductionManager.addReducer("Graphics.Turtle.GetAngle",       Graphics.getPosAngle,       "Graphics.getPosAngle");
	ReductionManager.addReducer("Graphics.Turtle.SetAngle",       Graphics.setOffsetPosAngle, "Graphics.setOffsetPosAngle");
	ReductionManager.addReducer("Graphics.Turtle.Turn",           Graphics.setOffsetPosAngle, "Graphics.setOffsetPosAngle");
	ReductionManager.addReducer("Graphics.Turtle.Forward",        Graphics.forward,           "Graphics.forward");
	ReductionManager.addReducer("Graphics.Turtle.ForwardDrawing", Graphics.forward,           "Graphics.forward");
	
	ReductionManager.addReducer("Graphics.DrawImage", Graphics.drawImage, "Graphics.drawImage");
	
	ReductionManager.addReducer("Graphics.GetTextWidth", Graphics.getTextWidth, "Graphics.getTextWidth");
	ReductionManager.addReducer("Graphics.DrawText",     Graphics.drawText,     "Graphics.drawText");
};
