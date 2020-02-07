//osu Map Merging Script

const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

var mapLength = [0];
var mapContent = [];
var metadataInput = [];
var splitLine = [];
var count = 0;
var mapLimit = 0;
var offset = 0;
var imported = 0;
var prevRedTime = 0;
var mergedTimeStamp = [];
var mergedObject = [];
var sliderMultiplier = [];
var metadataString = '';
var mergedMap = '';
var colorString = '[Colours]\r\nCombo1 : 255,0,0\r\nCombo2 : 0,255,0\r\nCombo3 : 0,0,255\r\n\r\n';
var temp = '';
var temppos = 0;
var queued = false;
//insert default combo color

console.log("Map count: "); 

rl.on('line', (input) => {
	if (!count) {console.log("Map length " + (count + 1) + ": "); count++; mapLimit = input;}
	else if ((count) < mapLimit) {console.log("Map length " + (count + 1) + ": "); mapLength.push(input); count++}
	else {mapLength.push(input); console.log(mapLength); rl.close();}
});

rl.on('close', () => {
	var rl2count = 0;
	const rl2 = readline.createInterface({
		input: process.stdin,
		output: process.stdout
	});
	console.log('Title:');
	rl2.on('line', (input) => {
		metadataInput.push(input)
		rl2count++;
		switch(rl2count) {
			case 1: console.log('Artist:'); break;
			case 2: console.log('Creator:'); break;
			case 3: console.log('Version:'); break;
			case 4: console.log('HPDrainRate:'); break;
			case 5: console.log('CircleSize:'); break;
			case 6: console.log('OverallDifficulty:'); break;
			case 7: console.log('ApproachRate:'); break;
			default: rl2.close();
		}
	});
	rl2.on('close', () => {
		console.log('input done, processing...');
		console.log(metadataInput);
		fs.readFile('input/' + (imported+1) + '.osu', 'utf8', cb);		
		function cb (err, data) {
			if (err) throw err;
			mapContent[imported] = data; 
			imported++;
			if (imported == mapLimit) breakdownMap(mapContent);
			else fs.readFile('input/' + (imported+1) + '.osu', 'utf8', cb);
		}
	});
});


function breakdownMap(mapContent) {
	//console.log(colorString);
	console.log('Breaking down map...');
	for (var j = 0; j < mapLimit; j++) {
		leadoffset = 0;
		offset += parseInt(mapLength[j]);
		console.log('Map ' + (j+1) + '...');
		var TimingArea = false;
		var ObjectArea = false;
		var line = mapContent[j].split('\n');
		for (x in line) {
			if (line[x] == '\r' || line[x].includes('[Colours]')) {TimingArea = false; ObjectArea = false; continue;}
			else if (line[x].includes('[TimingPoints]')) {TimingArea = true; ObjectArea = false; continue;}
			else if (line[x].includes('[HitObjects]')) {ObjectArea = true; TimingArea = false; continue;}
			else if (line[x].includes('SliderMultiplier:')) sliderMultiplier.push(2.0 / parseFloat(line[x].split(':')[1]));
			else if (line[x].includes('AudioLeadIn:')) leadoffset = parseFloat(line[x].split(':')[1]);
			if (TimingArea && sliderMultiplier[j]) adjustTiming(line[x], offset, sliderMultiplier[j]);
			if (ObjectArea) adjustObject(line[x], offset)
		}
		console.log('Map ' + (j+1) + ' Merged');
	}
	mapCreate();
}

function adjustTiming(line, offset, sliderMultiplier) {
	if (Number.isNaN(parseInt(line))) return;
	var x = line.split(',');
	var mspb = parseFloat(x[1]);
	var pos = parseInt(x[0]);
	if (queued) {
		if (temppos != pos) mergedTimeStamp.push(temp);
		queued = false;
	}
	x[0] = (pos + offset).toString();
	//console.log(pos + ' ' + npos);
	if (parseFloat(mspb) < 0) {
		x[1] = (mspb * sliderMultiplier).toString();
		line = x.join();
		mergedTimeStamp.push(line);
	}
	else {
		var line_alt = line;
		x_alt = line_alt.split(',');
		temppos = pos;
		x_alt[0] = (pos + offset).toString();
		x_alt[1] = (-100 * sliderMultiplier).toString();
		x_alt[6] = 0;
		temp = x_alt.join();
		queued = true;
		line = x.join();
		mergedTimeStamp.push(line);
	}
	//console.log(line)
}

function adjustObject(line, offset) {
	if (Number.isNaN(parseInt(line))) return;
	var x = line.split(',');
	var tpos = parseInt(x[2]);
	var type = parseInt(x[3]);
	if (type == 12) {var epos = parseInt(x[5]); x[5] = (epos + offset).toString();}
	x[2] = (tpos + offset).toString();
	line = x.join();
	//console.log(line)
	mergedObject.push(line);
}

function mapCreate() {
	initMetadata();
	var mergedMap = metadataString + '[TimingPoints]\r\n' + mergedTimeStamp.join('\n') + '\r\n\r\n' + colorString + '[HitObjects]\r\n' + mergedObject.join('\n');
	//console.log(mergedMap);
	fs.writeFile( 'output/' + metadataInput[1] + ' - ' + metadataInput[0] + ' (' + metadataInput[2] + ') [' + metadataInput[3] + '].osu', mergedMap, 'utf8', (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});
}

function initMetadata() {
	metadataString += 'osu file format v14\r\n\r\n[General]\r\nAudioFilename: audio.mp3\r\nAudioLeadIn: 0\r\nPreviewTime: 0\r\nCountdown: 0\r\nSampleSet: Normal\r\nStackLeniency: 0.2\r\nMode: 0\r\nLetterboxInBreaks: 0\r\nWidescreenStoryboard: 1\r\n\r\n';
	metadataString += '[Editor]\r\nBookmarks:0\r\nDistanceSpacing: 1.0\r\nBeatDivisor: 8\r\nGridSize: 16\r\nTimelineZoom: 2\r\n\r\n';
	metadataString += '[Metadata]\r\n'
	metadataString += 'Title:' + metadataInput[0] + '\r\nTitleUnicode:' + metadataInput[0] + '\r\n';
	metadataString += 'Artist:' + metadataInput[1] + '\r\nArtistUnicode:' + metadataInput[1] + '\r\n';
	metadataString += 'Creator:' + metadataInput[2] + '\r\n';
	metadataString += 'Version:' + metadataInput[3] + '\r\n';
	metadataString += 'Source:\r\nTags:\r\nBeatmapID:0\r\nBeatmapSetID:-1\r\n\r\n[Difficulty]\r\n';
	metadataString += 'HPDrainRate:' + metadataInput[4] + '\r\n';
	metadataString += 'CircleSize:' + metadataInput[5] + '\r\n';
	metadataString += 'OverallDifficulty:' + metadataInput[6] + '\r\n';
	metadataString += 'ApproachRate:' + metadataInput[7] + '\r\n';
	metadataString += 'SliderMultiplier:2\r\nSliderTickRate:1\r\n\r\n'
	metadataString += '[Events]\r\n//Background and Video events\r\n//Break Periods\r\n//Storyboard Layer 0 (Background)\r\n'
	metadataString += '//Storyboard Layer 1 (Fail)\r\n//Storyboard Layer 2 (Pass)\r\n//Storyboard Layer 3 (Foreground)\r\n//Storyboard Sound Samples\r\n\r\n'
}