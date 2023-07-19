import { initializeFlatfile } from "@flatfile/javascript";

const flatfileOptions = {
  publishableKey: "pk_faQWZQN689wX8J0jvuk4ryqNus2jYOnj",
  environmentId: "dev_env_2gu2ANxb",
  apiUrl: 'http://localhost:3000/v1',
  baseUrl: 'http://localhost:6789',
  displayAsModal: true,
};

function launchImport() {
  initializeFlatfile(flatfileOptions).then(() => {
    //   do nothing
  });
}

window.addEventListener("click", (e) => {
  if (e.target.id === "flatfile_launch") {
    launchImport();
  }
});
