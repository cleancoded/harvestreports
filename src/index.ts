const { version } = require("../package.json");
import { version as platformVersion } from "zapier-platform-core";
import FormattedEntry from "./creates/formatted-entry";

process.version;

const App = {
  version,
  platformVersion,

  authentication: {},

  beforeRequest: [],

  afterResponse: [],

  resources: {},

  triggers: {},

  searches: {},

  creates: {
    [FormattedEntry.key]: FormattedEntry
  }
};

export default App;
