# ReActiVis

The Research Activity Visualiser (ReActiVis) is the generalised version of [DUVis](https://github.com/DwrUisce/DUVis). ReActiVis allows users to interactivley visualize the interaction between activities, workpackages and external stakeholders.  


![Dŵr Uisce Work Package Visualiser teaser image](https://github.com/alexrigby/dwr-uisce-vis-react/blob/master/teaser2.png)


## Contents

[TOC]


## Config

| Key       |  Type        | Format      | Desctiption |
| ----------- | ----------- | ----------- |----------- |
| `projectName` | string OR null |          |      Name of the project      |
| `startDate`   | string OR null | yyyy-mm-dd | Start date of the project |
| `startDate`   | string OR null | yyyy-mm-dd OR 'today' | End date of the project |
| `progressReportPeriod`   | integer OR null |  | Number of months per progress report period |
| [`worksheets`](#worksheets)   | object |  | Name of each excel worksheet as they appear in the excel workbook |
| [`activities`](#activities)   | object |  | Field names as they appear in the activities worksheet |
| `workPackages`   | object |  | Field names as they appear in the work packages worksheet |
| `stakeholders`   | object |  | Field names as they appear in the work stakeholders worksheet |
| `stories`   | object |  | Names and activity ids peresnt in data stories {name: 'story name', ids: [1 , 2, 3, 4,]} |

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
|`metaFields`|array of objects|Names and types of optional addional meta fields in format {name: 'meta field name', type: 'category OR text'}|

## Excel Dataset


