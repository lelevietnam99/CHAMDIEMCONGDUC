/* global PQQ */
window.PQQ = window.PQQ || {};

PQQ.state = {
  mode: '',
  clbParam: '',
  allStudents: [],
  clubStudents: [],
  clubStats: {},
  scoringPeriod: null,
  dashCharts: [],
  cdDirty: new Set(),
  cdBaseline: {},
  isSubmitting: false,
  isRefreshing: false,
  scoringSearchBound: false,
  dashSearchBound: false
};
