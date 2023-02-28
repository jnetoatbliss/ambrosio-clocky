// IMPORTS
const lineReader = require('line-reader');
const fs = require('fs');
const path = require('path');

const Clockify = require('clockify-npm');
const moment = require('moment');

// CONSTS
const endOfDocument = '=EOD=';
const documentName = 'daily-time-entry.txt';
const timeFormat = 'yyyy-MM-DDTHH:mm:ss';
const apiKey = 'YOUR_KEY';
const userId = 'YOUR_USER_ID';
const workspaceId = ''; // Bliss 2023
const projectId = ''; // App moey!
const taskId = ''; // iOS Development

// PROGRAM
Clockify.SetKey(apiKey);

function optionsForLine(line) {
    let params = line.split('|');
    let timeParams = params[1].split('-');
    let startTime = timeParams[0].split(':');
    let endTime = timeParams[1].split(':');

    let days = 0
    //let type = 'days'
    let type = 'hours'
    let description = params[0]; // Nome da entrada
    let startDate = moment().hours(startTime[0]).minutes(startTime[1]).seconds(0).subtract(days, type).utcOffset(0); // Hora de início
    let endDate = moment().hours(endTime[0]).minutes(endTime[1]).seconds(0).subtract(days, type).utcOffset(0); // Hora de fim
    
    return {
        taskId: taskId,
        projectId: projectId,
        billable: true,
        description: description,
        start: startDate.format(timeFormat) + 'Z',
        end: endDate.format(timeFormat) + 'Z'
    };
}

function addTimeEntries(entries) {
    Promise.all(entries).then(() => {
        console.log('All done! 👍');
    }).catch(error => {
        console.error(`Whoops! Something went wrong: ${error}`);
    });
}

let entries = [];
lineReader.eachLine(`${path.dirname(require.main.filename)}/${documentName}`, function(line) {
    if (line.includes(endOfDocument)) {
        addTimeEntries(entries);
        return false;
    }

    entries.push(Clockify.Workspaces.addTimeEntry(workspaceId, optionsForLine(line)));
    // console.log(optionsForLine(line))
});