# ReActiVis

The Research Activity Visualiser (ReActiVis) is the generalised version of [DUVis](https://github.com/DwrUisce/DUVis). ReActiVis allows users to interactivley visualize the interaction between activities, workpackages and external stakeholders.  


![Dŵr Uisce Work Package Visualiser teaser image](https://github.com/alexrigby/dwr-uisce-vis-react/blob/master/teaser2.png)


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
|`type`|one of "category" OR "text"| use "category" for fields that will contain categorical data ( discrete values), use "text" for fields that will contain open text (continuous values)|

## Excel Dataset


