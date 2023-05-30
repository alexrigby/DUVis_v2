# ReActiVis

The Research Activity Visualiser (ReActiVis) is the generalised version of [DUVis](https://github.com/DwrUisce/DUVis). ReActiVis allows users to interactivley visualize the interaction between activities, workpackages and external stakeholders.  


![Dŵr Uisce Work Package Visualiser teaser image](https://github.com/alexrigby/dwr-uisce-vis-react/blob/master/teaser2.png)

## Contents 

[TOC]

## Config

| Key       |  Type        | Format      | Desctiption |
| ----------- | ----------- | ----------- |----------- |
| `projectName` | string OR null |          |      Name of the project      |
| `startDate`   | string OR null | 'yyyy-mm-dd' | Start date of the project |
| `startDate`   | string OR null | 'yyyy-mm-dd' OR 'today' | End date of the project, use 'today' to use the current date |
| `progressReportPeriod`   | integer OR null |  | Number of months per progress report period |
| [`worksheets`](#worksheets)   | object |  | Name of each excel worksheet as they appear in the excel workbook |
| [`activities`](#activities)   | object |  | Field names as they appear in the activities worksheet |
| [`workPackages`](#workPackages)   | object |  | Field names as they appear in the work packages worksheet |
| [`stakeholders`](#stakeholders)   | object |  | Field names as they appear in the work stakeholders worksheet |
| [`stories`](#stories)   | array of objects OR empty array |  | Names and activity ids peresnt in data stories {name: 'story name', ids: [1 , 2, 3, 4,]} |

### [`worksheets`](#worksheets)

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
| `activities` | string  |   Name of the activites worksheet as it appears in the excel workbook |
| `activityLinks` | string  |   Name of the activity links worksheet as it appears in the excel workbook |
| `workPackages` | string  |  Name of the workpackages worksheet as it appears in the excel workbook |
| `stakeholders` | string  |   Name of the stakeholders worksheet as it apears in the excel workbook |
| `stakeholderLinks` | string  |   Name of the stakeholder links worksheet as it apears in the excel workbook |

### [`activities`](#activities)

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`id`|string|The activity id field heading as it appears in the excel worksheet|
|`workPackage`|string|The activites parent work package field as it appears in the excel worksheet|
|`name`|string OR null|The activity name field as it appears in the excel worksheet|
|`startDate`|string OR null|The activity start date field as it appears in the excel worksheet|
|`endDate`|string OR null|The activity end date field as it appears in the excel worksheet|
|`sustainableDevelopmentGoals`|string OR null|The activity UN Sustainable Development Goals field as it appears in the excel worksheet|
|[`metaFields`](#metaFields)|array of objects OR empty array|Names and types of optional addional meta fields in format {name: 'meta field name', type: 'category OR text'}|

### [`workPackages`](#workPackages)
| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`id`|string|The work package id field heading as it appears in the excel worksheet|
|`name`|string OR null|The work package name field as it appears in the excel worksheet|
|[`metaFields`](#metaFields)|array of objects OR empty array|Names and types of optional addional meta fields in format {name: 'meta field name', type: 'category OR text'}|

### [`stakeholders`](#stakeholders)
| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`id`|string|The stakeholder id field heading as it appears in the excel worksheet|
|`name`|string OR null|The stakeholder name field as it appears in the excel worksheet|
|[`metaFields`](#metaFields)|array of objects OR empty array|Names and types of optional addional meta fields in format {name: 'meta field name', type: 'category OR text'}|

### [`stories`](#stories)
Empty array or array of objects:

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`name`|string| Name of data story|
|`activityIds`|array of integers| Array of ids to include in the 'data story' e.g. [1, 2, 3, 4]|


#### [`metaFields`](#metaFields)
Empty array or array of objects:

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`name`|string| Name of meta field as it appears in the excel worksheet|
|`type`|one of "category" OR "text"| Use "category" for fields that will contain categorical data ( discrete values), use "text" for fields that will contain open text (continuous values)|

## Excel Dataset
ReActiVis requires an excel (.xlsx) workbook containing project data to be visualised. The excel workbook can contain 5 worksheets: 

### Workpackage worksheet (required)
The workpackage worksheet should contain information regarding the project workpackage with each row representing a unique workpackage. 
The workpackage worksheet has 1 required field: `ID`

| Field       | Value        | Desctiption |
| ----------- | ----------- | ----------- |
|`ID`|integer|A numerical identifier, unique within the workpackages worksheet|

### Activities worksheet (required)
The activities worksheet should contain information regarding activities undertaken as part of the project. Each row represents a single activity. 
The activities worksheet has 2 required fields: `ID` and `parent work package`.

| Field       | Value        | Desctiption |
| ----------- | ----------- | ----------- |
|`ID`|integer|A numerical identifier, unique within the activities worksheet|
|`parent work package`|integer|A numerical identifier pointing to the activities parent workpackage|

### Activity link worksheet (required)
The activity link worksheet is a correlation matrix where links between activities are recored. All links are non-directional. Links should be marked with a "1" in the corresponding cell.
For example, in the following table the linked activities are: 1 & 4, 2 & 6, 3 & 1, 5 & 7 

|`ID`|1|2|3|4|5|6|7|
|-|-|-|-|-|-|-|-|
|1| | | |1| | | |
|2| | | | | |1 | |
|3|1 | | | | | | |
|4|1| | | | | | | 
|5| | | | | | |1 |
|6| |1 | | | | | |
|7| | | | | 1| | | 


### Stakeholders worksheet (optional)
The stakeholders worksheet should contain information regarding external stakeholders who have engaged with activities within the project. Each row represents a single external stakeholder. If you would like to include external stakeholders in the visualization then this worksheet is required. 
The stakeholders worksheet has one required field: `ID`

| Field       | Value        | Desctiption |
| ----------- | ----------- | ----------- |
|`ID`|integer|A numerical identifier, unique within the stakeholders worksheet|

### Stakeholder link worksheet (optional)
The stakeholder link worksheet is a correlation matrix where links and their engagement level recorded between external stakeholders and activities. If you would like to include external stakeholders in the visualization, then this worksheet is required. Links should be marked with number ranging from 1(low)-4(high) indicating the degree to which the stakeholder engaged with the activity.
For example, in the following table stakeholder 1 engaged with activity 34 at an engagement level of 4, stakeholder 2 with activity 22 at level 1, stakeholder 3 with activity 1 at level 2, and stakeholder 4 with activity 17 at level 3.

|`S_ID/Act_ID`|1|24|32|34|17|22|6|
|-|-|-|-|-|-|-|-|
|1| | | |4| | | |
|2| | | | | |1| |
|3|2| | | | | | |
|4| | | | |3| | | 





