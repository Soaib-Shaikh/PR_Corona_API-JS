
const API_URL = 'https://api.rootnet.in/covid19-in/stats/latest';

let totalCount = document.getElementById('total');
let activeCount = document.getElementById('active');
let recoveredCount = document.getElementById('recovered');
let deathCount = document.getElementById('deaths');
let stateTable = document.querySelector('#myTable tbody');
let stateSelect = document.getElementById('stateSelect');
let selectedStateBox = document.getElementById('selectedStateData');

let stateName = document.getElementById('stateName');
let sTotal = document.getElementById('sTotal');
let sActive = document.getElementById('sActive');
let sRecovered = document.getElementById('sRecovered');
let sDeaths = document.getElementById('sDeaths');

let covidData = {};

const coronaData = async () => {
  try {
    let res = await fetch(API_URL);
    let data = await res.json();
    covidData = data.data;

    viewData();
    displayStateData();
    populateStateOptions();
  } catch (error) {
    console.log(error.message);
  }
};

const viewData = () => {
  try {
    let total = covidData.summary.total;
    let recovered = covidData.summary.discharged;
    let deaths = covidData.summary.deaths;
    let active = total - recovered - deaths;

    totalCount.textContent = total.toLocaleString();
    activeCount.textContent = active.toLocaleString();
    recoveredCount.textContent = recovered.toLocaleString();
    deathCount.textContent = deaths.toLocaleString();
  } catch (error) {
    console.log(error.message);
  }
};

const displayStateData = () => {
  try {
    let stateList = covidData.regional;
    stateTable.innerHTML = ""; 

    stateList.forEach((state) => {
      let active = state.totalConfirmed - state.discharged - state.deaths;

      let row = document.createElement('tr');
      row.innerHTML = `
        <td>${state.loc}</td>
        <td>${state.totalConfirmed.toLocaleString()}</td>
        <td>${active.toLocaleString()}</td>
        <td>${state.discharged.toLocaleString()}</td>
        <td>${state.deaths.toLocaleString()}</td>
      `;
      stateTable.appendChild(row);
    });
  } catch (error) {
    console.log(error.message);
  }
};

const populateStateOptions = () => {
  covidData.regional.forEach((state) => {
    const option = document.createElement('option');
    option.value = state.loc;
    option.textContent = state.loc;
    stateSelect.appendChild(option);
  });
};

stateSelect.addEventListener('change', () => {
  const selected = stateSelect.value;
  if (!selected) {
    selectedStateBox.classList.add('d-none');
    return;
  }

  const stateData = covidData.regional.find(state => state.loc === selected);

  if (stateData) {
    const total = stateData.totalConfirmed;
    const recovered = stateData.discharged;
    const deaths = stateData.deaths;
    const active = total - recovered - deaths;

    stateName.textContent = stateData.loc;
    sTotal.textContent = total.toLocaleString();
    sActive.textContent = active.toLocaleString();
    sRecovered.textContent = recovered.toLocaleString();
    sDeaths.textContent = deaths.toLocaleString();

    selectedStateBox.classList.remove('d-none');
  }
});

coronaData();

