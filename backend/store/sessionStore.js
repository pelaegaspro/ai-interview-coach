const state = {
  resumeText: "",
  resumeMetadata: null
};

function setResumeText(text, metadata = null) {
  state.resumeText = text;
  state.resumeMetadata = metadata;
}

function getResumeText() {
  return state.resumeText;
}

function getResumeMetadata() {
  return state.resumeMetadata;
}

function clearResumeText() {
  state.resumeText = "";
  state.resumeMetadata = null;
}

module.exports = {
  setResumeText,
  getResumeText,
  getResumeMetadata,
  clearResumeText
};
