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

module.exports = {
  setResumeText,
  getResumeText,
  getResumeMetadata
};
