# ReActiVis


The Research Activity Visualiser (ReActiVis) is the generalised version of [DUVis](https://github.com/DwrUisce/DUVis). ReActiVis allows users to interactivley visualize the interaction between activities, workpackages and external stakeholders in their research projects.


![Dŵr Uisce Work Package Visualiser teaser image](https://github.com/alexrigby/dwr-uisce-vis-react/blob/master/teaser2.png)

## Contents 

- [Basic Usage](#basic-usage)
  - [Getting started](#getting-started)
  - [Visualisation options](#visualisation-options)
- [Inputs](#inputs)
  - [Excel Dataset](#excel-dataset)
    - [Workpackage worksheet (required)](#workpackage-worksheet-required)
    - [Activities worksheet (required)](#activities-worksheet-required)
    - [Activity links worksheet (required)](#activity-links-worksheet-required)
    - [Stakeholders worksheet (optional)](#stakeholders-worksheet-optional)
    - [Stakeholder links worksheet (optional)](#stakeholder-links-worksheet-optional)
  - [Config](#config)
    - [worksheets](#worksheets)
    - [activities](#activities)
    - [workPackages](#workpackages)
    - [stakeholders](#stakeholders)
    - [stories](#stories)
    - [metaFields](#metafields)
  


## Basic Usage
### Getting started
* Open the link and follow the instructions on the landing page to upload your JSON config file and Excel dataset.
* If required, you can generate an excel template from your config.
* Your files are saved to local storage so will be rembered in your browser. To transfere the same files to another user you can download your files from the `manage data` tab. 
* To update the config or dataset simply re-upload your updated files in the `manage data` tab.

### Visualisation options
* Each excel worksheet has required fields. Additional meta fields can be included in the visualisation by defining them in the [Config](#config).
* External stakeholders can be included (or excluded) by specifying in the [Config](#config)
* Temporal features can be included (or excluded) by defining (or excluding) a start and end date from the [Config](#config).

### Interface instructions 
* For full instructions on interface feature usage please refere to the [documentation](https://github.com/alexrigby/ReActiVis/blob/master/ReActiPro%20interface%20instructions.pdf)

***Important**: ReActiVis is in development, although efforts have been made to handle dataset and config errors we cannot guarantee that all errors will be caught. Therefore please take care to format your files correctly to avoid unexpected results.*

## Inputs

### Excel Dataset
ReActiVis requires an excel (.xlsx) workbook containing project data to be visualised. 5 worksheets are used for visualisation. Although additional worksheets and data fields can be included for record keeping, to improve performance it is recommended to keep additional information to a minimum. 

#### Workpackage worksheet (required)
The workpackage worksheet should contain information regarding the project workpackages with each row representing a unique workpackage. 
The workpackage worksheet has 1 required field: `ID`

| Field       | Value        | Desctiption |
| ----------- | ----------- | ----------- |
|`ID`|integer|A numerical identifier, unique within the workpackages worksheet (e.g. "1", "9")|

***Important**: ReActiVis currently supports a maximum of 10 work packages*

#### Activities worksheet (required)
The activities worksheet should contain information regarding activities undertaken as part of the project. Each row represents a single activity. 
The activities worksheet has 2 required fields: `ID` and `parent work package`.

| Field       | Value        | Desctiption |
| ----------- | ----------- | ----------- |
|`ID`|integer|A numerical identifier, unique within the activities worksheet (e.g. "1", "55", "200")|
|`parent work package`|integer|A numerical identifier pointing to the activities parent workpackage (e.g."1", "12")|

If the `startDate` or `endDate` fields are included the format must be "yyyy-mm-dd"

To include [`UN sustainable development goals`](https://sdgs.un.org/goals), record the SGDs addressed by the activity as a comma separated  list of IDs ranging from 1-17 (e.g., 1,5,17) 

#### Activity links worksheet (required)
The activity links worksheet is a correlation matrix where links between activities are recored. All links are non-directional. Links should be marked with a "1" in the corresponding cell.
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


#### Stakeholders worksheet (optional)
The stakeholders worksheet should contain information regarding external stakeholders who have engaged with activities within the project. Each row represents a single external stakeholder. If you would like to include external stakeholders in the visualization then this worksheet is required. 
The stakeholders worksheet has one required field: `ID`

| Field       | Value        | Desctiption |
| ----------- | ----------- | ----------- |
|`ID`|integer|A numerical identifier, unique within the stakeholders worksheet (e.g. "1", "55", "200")|

#### Stakeholder links worksheet (optional)
The stakeholder links worksheet is a correlation matrix where links and their engagement level recorded between external stakeholders and activities. If you would like to include external stakeholders in the visualization, then this worksheet is required. Links should be marked with number ranging from 1(low)-4(high) indicating the degree to which the stakeholder engaged with the activity.

For example, in the following table stakeholder 1 engaged with activity 34 at an engagement level of 4, stakeholder 2 with activity 22 at level 1, stakeholder 3 with activity 1 at level 2, and stakeholder 4 with activity 17 at level 3.

|`S_ID/Act_ID`|1|24|32|34|17|22|6|
|-|-|-|-|-|-|-|-|
|1| | | |4| | | |
|2| | | | | |1| |
|3|2| | | | | | |
|4| | | | |3| | | 




### [Config](#config)
The config tells ReActiVis where in the excel dataset to find relivant information. Define custom `meta-fields` to included additional information in the visualisation. If you dont have software that allows you to edit JSON files installed then you can use an online editor (https://jsoneditoronline.org/#left=local.riyiqo). 

***Important**: As a minimum the config must include all the keys outlined in this section. If you wish to omit a value from the visualisation please specify as null (or an empty array for `stories` and `meta-fields`).*

| Key       |  Type        | Format      | Desctiption |
| ----------- | ----------- | ----------- |----------- |
| `projectName` | string OR null |          |      Name of the project      |
| `startDate`   | string OR null | 'yyyy-mm-dd' | Start date of the project |
| `startDate`   | string OR null | 'yyyy-mm-dd' OR 'today' | End date of the project, use 'today' to use the current date |
| `progressReportPeriod`   | integer OR null |  | Number of months per progress report period |
| [`worksheets`](#worksheets)   | object |  | Name of each excel worksheet as they appear in the excel workbook |
| [`activities`](#activities)   | object |  | Field names as they appear in the activities worksheet |
| [`workPackages`](#workPackages)   | object |  | Field names as they appear in the work packages worksheet |
| [`stakeholders`](#stakeholders)   | object OR null|  | Field names as they appear in the work stakeholders worksheet |
| [`stories`](#stories)   | array of objects OR empty array |  | Names and activity ids peresnt in data stories {name: 'story name', ids: [1 , 2, 3, 4,]} |

#### [`worksheets`](#worksheets)

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
| `activities` | string  |   Name of the activites worksheet as it appears in the excel workbook |
| `activityLinks` | string  |   Name of the activity links worksheet as it appears in the excel workbook |
| `workPackages` | string  |  Name of the workpackages worksheet as it appears in the excel workbook |
| `stakeholders` | string OR null  |   Name of the stakeholders worksheet as it apears in the excel workbook |
| `stakeholderLinks` | string OR null |   Name of the stakeholder links worksheet as it apears in the excel workbook |

#### [`activities`](#activities)

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`id`|string|The activity id field heading as it appears in the excel worksheet|
|`workPackage`|string|The activites parent work package field as it appears in the excel worksheet|
|`name`|string OR null|The activity name field as it appears in the excel worksheet|
|`startDate`|string OR null|The activity start date field as it appears in the excel worksheet|
|`endDate`|string OR null|The activity end date field as it appears in the excel worksheet|
|`sustainableDevelopmentGoals`|string OR null|The activity UN Sustainable Development Goals field as it appears in the excel worksheet|
|[`metaFields`](#metaFields)|array of objects OR empty array|Names and types of optional addional meta fields in format {name: 'meta field name', type: 'category OR text'}|

#### [`workPackages`](#workPackages)
| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`id`|string|The work package id field heading as it appears in the excel worksheet|
|`name`|string OR null|The work package name field as it appears in the excel worksheet|
|[`metaFields`](#metaFields)|array of objects OR empty array|Names and types of optional addional meta fields in format {name: 'meta field name', type: 'category OR text'}|

#### [`stakeholders`](#stakeholders)
| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`id`|string|The stakeholder id field heading as it appears in the excel worksheet|
|`name`|string OR null|The stakeholder name field as it appears in the excel worksheet|
|[`metaFields`](#metaFields)|array of objects OR empty array|Names and types of optional addional meta fields in format {name: 'meta field name', type: 'category OR text'}|

#### [`stories`](#stories)
Empty array or array of objects:

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`name`|string| Name of data story|
|`activityIds`|array of integers| Array of ids to include in the 'data story' e.g. [1, 2, 3, 4]|

e.g.,
```javascript
{
...,
  "stories": [
                { "name": "my first data story", "activityIds": [1, 3, 5, 34, 23] }, 
                { "name": "my second data story", "activityIds": [99, 1, 67, 4, 3 ,6 , 87] }
             ], 
...
}
```


#### [`metaFields`](#metaFields)
Empty array or array of objects:

| Key       | Type        | Desctiption |
| ----------- | ----------- | ----------- |
|`name`|string| Name of meta field as it appears in the excel worksheet|
|`type`|one of "category" OR "text"| Use "category" for fields that will contain categorical data ( discrete values), use "text" for fields that will contain open text (continuous values)|

e.g.,
```javascript
{
...,
  "metaFields": [
                  { "name": "field 1", "type": "text" }, 
                  { "name": "field 2", "type": "category" }
                ], 
...
}
````
