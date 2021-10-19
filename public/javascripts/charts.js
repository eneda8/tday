const ChartsEmbedSDK = window.ChartsEmbedSDK;

const sdk = new ChartsEmbedSDK({
  baseUrl: 'https://charts.mongodb.com/charts-todai-fevei',
});
const chart = sdk.createChart({
  chartId: 'cfcfe579-3318-4f7b-8d37-1de846292726',
  height: "700px"
});

async function renderChart() {
    await chart.render(document.getElementById('chart'));
    document.getElementById('refreshButton').addEventListener('click', () => chart.refresh());

    document
    .getElementById("refresh-interval")
    .addEventListener("change", async (e) => {
      var refreshInterval = e.target.value;
      refreshInterval
        ? chart.setRefreshInterval(Number(refreshInterval))
        : chart.setRefreshInterval(0);

      var currentRefreshInterval = await chart.getRefreshInterval();
      document.getElementById(
        "currentRefreshInterval"
      ).innerText = currentRefreshInterval;
    });

    document
    .getElementById("country-filter")
    .addEventListener("change", async (e) => {
      const country = e.target.value;
      const currentFilterDOM = document.getElementById("currentFilter");
      if (country) {
        await chart.setFilter({ "authorCountry": country }); // Optional: ~REPLACE~ with the your own whitelisted field
        const filter = await chart.getFilter();
        currentFilterDOM.innerText = JSON.stringify(filter);
      } else {
        await chart.setFilter({});
        const filter = await chart.getFilter();
        currentFilterDOM.innerText = JSON.stringify(filter);
      }
    });

}

renderChart().catch((e) => console.log(e));
