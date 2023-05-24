export function prepConfigDownload(config) {
  const localStories = JSON.parse(window.localStorage.getItem("customStory"));
  console.log(localStories);
  const configDownload = {
    name: config.NAME,
    startDate: config.START_DATE,
    endDate: config.END_DATE === new Date().toISOString().split("T")[0] ? "today" : config.END_DATE,
    progressReportPeriod: config.PR_PERIOD,
    worksheets: {
      activities: config.WORKSHEETS.ACTIVITIES,
      activityLinks: config.WORKSHEETS.ACTIVITY_LINKS,
      workPackages: config.WORKSHEETS.WORKPACKAGES,
      stakeholders: config.WORKSHEETS.STAKEHOLDERS,
      stakeholderLinks: config.WORKSHEETS.STAKEHOLDER_LINKS,
    },
    activities: {
      id: config.actFields.ID,
      name: config.actFields.NAME,
      workPackage: config.actFields.WP,
      startDate: config.actFields.START_DATE,
      endDate: config.actFields.END_DATE,
      sustainableDevelopmentGoals: config.actFields.SDGs,
      metaFields: config.actFields.META_FIELDS,
    },
    workPackages: {
      id: config.wpFields.ID,
      name: config.wpFields.NAME,
      metaFields: config.wpFields.META_FIELDS,
    },
    stakeholders: config.stFields
      ? { id: config.stFields.ID, name: config.stFields.NAME, metaFields: config.stFields.META_FIELDS }
      : null,
    stories: localStories ? [...config.STORIES, ...localStories] : config.STORIES,
  };
  console.log(configDownload);
  return configDownload;
}

export default prepConfigDownload;
