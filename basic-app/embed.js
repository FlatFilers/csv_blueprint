import { initializeFlatfile } from "@flatfile/javascript";

const flatfileOptions = {
  publishableKey: "pk_owt69DYdp4wS1POx9ewQythIhZWJii0V",
  environmentId: "us_env_72sDdlxY",
  apiUrl: 'https://platform.flatfile.com/api/v1'
};

function launchImport() {
  initializeFlatfile(flatfileOptions);
}

window.addEventListener("click", (e) => {
  if (e.target.id === "flatfile_launch") {
    launchImport();
  }
});
