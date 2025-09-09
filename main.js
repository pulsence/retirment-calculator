
comparativeTotalCostsTable = null
perMonthCostsTable = null
perMonthInvestmentUseTable = null
comparativeAssetValuesTable = null
netPositionsTable = null
form = null

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

  // These options can be used to round to whole numbers.
  trailingZeroDisplay: 'stripIfInteger'   // This is probably what most people
                                          // want. It will only stop printing
                                          // the fraction when the input
                                          // amount is a round number (int)
                                          // already. If that's not what you
                                          // need, have a look at the options
                                          // below.
  //minimumFractionDigits: 0, // This suffices for whole numbers, but will
                              // print 2500.10 as $2,500.1
  //maximumFractionDigits: 0, // Causes 2500.99 to be printed as $2,501
});

generalInformation = {};
rentingInformation = {};
buyingInformation = {};
investingInformation = {};


class AssetValues {
    age = 0;

    fifteenYrHomeValue = 0;
    thirtyYrHomeValue = 0;

    fifteenYrInvestments = 0;
    thirtyYrInvestments = 0;
    apartmentInvestments = 0;

    constructor(){
    }

    get apartmentTotal() {
        return this.apartmentInvestments;
    }

    get fifteenYrTotal() {
        return this.fifteenYrHomeValue + this.fifteenYrInvestments;
    }

    get thirtyYrTotal() {
        return this.thirtyYrHomeValue + this.thirtyYrInvestments;
    }
}

window.onload = function() {
    form = document.querySelector("#detailsForm");
    form.addEventListener("submit", calc);

    comparativeTotalCostsTable = document.querySelector("#comparativeTotalCostsTable").getElementsByTagName("tbody")[0];
    perMonthCostsTable = document.querySelector("#perMonthCostsTable").getElementsByTagName("tbody")[0];
    perMonthInvestmentUseTable = document.querySelector("#perMonthInvestmentUseTable").getElementsByTagName("tbody")[0];
    comparativeAssetValuesTable = document.querySelector("#comparativeAssetValuesTable").getElementsByTagName("tbody")[0];
    netPositionsTable = document.querySelector("#netPositionsTable").getElementsByTagName("tbody")[0];
}

function calc(e){
    e.preventDefault();
    
    readForm();

    var mortgagePayments = 15;
    var houseValue = buyingInformation.mortgage + buyingInformation.mortgageDownPayment;
    var monthlyPayment = (((buyingInformation.mortgageRate / 12) * buyingInformation.mortgage)  / (1 - (Math.pow (1 + (buyingInformation.mortgageRate / 12), (15 * -12))))).toFixed(2);
    var fifteenYrYearlyPayment= monthlyPayment * 12;
    var fifteenYrYearlyInterest = (monthlyPayment * mortgagePayments - houseValue) / 15;
    var fifteenYrYearlyPrinciple = fifteenYrYearlyPayment - fifteenYrYearlyInterest;

    mortgagePayments = 30 * 12;
    monthlyPayment = (((buyingInformation.mortgageRate / 12) * buyingInformation.mortgage)  / (1 - (Math.pow (1 + (buyingInformation.mortgageRate / 12), (30 * -12))))).toFixed(2);
    var thirtyYrYearlyPayment = monthlyPayment * 12;
    var thirtyYrYearlyInterest = (monthlyPayment * mortgagePayments - houseValue) / 30;
    var thirtyYrYearlyPrinciple = thirtyYrYearlyPayment - thirtyYrYearlyInterest;

    var years = generalInformation.deathAge - generalInformation.currentAge;

    // First calculate the first year of costs
    var costData = [];
    var rentCost = {};
    var fifteenYrCost = {};
    var thirtyYrCost = {};

    rentCost.year = generalInformation.currentAge;
    rentCost.rentCost = rentingInformation.monthlyRent * 12;
    rentCost.insurance = rentingInformation.monthlyRentInsurance * 12;
    rentCost.total = rentCost.rentCost + rentCost.insurance;

    fifteenYrCost.year = generalInformation.currentAge;
    fifteenYrCost.mortgage = fifteenYrYearlyPayment;
    fifteenYrCost.improvements = buyingInformation.oneTimeRepairs;
    fifteenYrCost.insurance = buyingInformation.monthlyHomeInsurance * 12;
    fifteenYrCost.taxes = buyingInformation.annualTaxAssesment;
    fifteenYrCost.total = fifteenYrCost.mortgage + fifteenYrCost.improvements + fifteenYrCost.insurance + fifteenYrCost.taxes;

    thirtyYrCost.year = generalInformation.currentAge;
    thirtyYrCost.mortgage = thirtyYrYearlyPayment;
    thirtyYrCost.improvements = buyingInformation.oneTimeRepairs;
    thirtyYrCost.insurance = buyingInformation.monthlyHomeInsurance * 12;
    thirtyYrCost.taxes = buyingInformation.annualTaxAssesment;
    thirtyYrCost.total = thirtyYrCost.mortgage + thirtyYrCost.improvements + thirtyYrCost.insurance + thirtyYrCost.taxes;
    costData.push([rentCost, fifteenYrCost, thirtyYrCost]);

    comparativeTotalCostsTable.innerHTML = "";
    var costRow = comparativeTotalCostsTable.insertRow();
    costRow.insertCell(0).innerHTML = generalInformation.currentAge;
    costRow.insertCell(1).innerHTML = formatter.format(rentCost.total);
    costRow.insertCell(2).innerHTML = formatter.format(fifteenYrCost.total);
    costRow.insertCell(3).innerHTML = formatter.format(thirtyYrCost.total);

    // Next calculate the per month costs for this year
    var monthCostData = [];
    monthCostData.push([generalInformation.currentAge, rentCost.total / 12, fifteenYrCost.total / 12, thirtyYrCost.total / 12]);
    perMonthCostsTable.innerHTML = "";
    var monthCostRow = perMonthCostsTable.insertRow();
    monthCostRow.insertCell(0).innerHTML = monthCostData[0][0];
    monthCostRow.insertCell(1).innerHTML = formatter.format(monthCostData[0][1]);
    monthCostRow.insertCell(2).innerHTML = formatter.format(monthCostData[0][2]);
    monthCostRow.insertCell(3).innerHTML = formatter.format(monthCostData[0][3]);

    // Set up monthly us of investment account
    var monthInvesmentUseData = [[generalInformation.currentAge, 0, 0, 0]];
    perMonthInvestmentUseTable.innerHTML = "";
    var monthInvestRow = perMonthInvestmentUseTable.insertRow();
    monthInvestRow.insertCell(0).innerHTML = monthInvesmentUseData[0][0];
    monthInvestRow.insertCell(1).innerHTML = formatter.format(monthInvesmentUseData[0][1]);
    monthInvestRow.insertCell(2).innerHTML = formatter.format(monthInvesmentUseData[0][2]);
    monthInvestRow.insertCell(3).innerHTML = formatter.format(monthInvesmentUseData[0][3]);

    // Next calculate the first year of value
    var valueData = [];
    var value = new AssetValues();
    value.age = generalInformation.currentAge;
    value.fifteenYrHomeValue = fifteenYrYearlyPrinciple;
    value.thirtyYrHomeValue = thirtyYrYearlyPrinciple;
    value.fifteenYrInvestments = investingInformation.totalCurrentInvesments;
    value.thirtyYrInvestments = investingInformation.totalCurrentInvesments;
    value.apartmentInvestments = investingInformation.totalCurrentInvesments;
    if (investingInformation.includeDownPayment){
        value.apartmentInvestments += buyingInformation.mortgageDownPayment;
    }
    valueData.push(value);
    
    comparativeAssetValuesTable.innerHTML = "";
    var valueRow = comparativeAssetValuesTable.insertRow();
    valueRow.insertCell(0).innerHTML = value.age;
    valueRow.insertCell(1).innerHTML = formatter.format(value.apartmentTotal);
    valueRow.insertCell(2).innerHTML = formatter.format(value.fifteenYrTotal);
    valueRow.insertCell(3).innerHTML = formatter.format(value.thirtyYrTotal);

    // Finally calculate the first year net positions
    var netData = [];
    var netRent = 0;
    netRent = value.apartmentTotal - rentCost.total;
    var netFifteenYr = value.fifteenYrTotal - fifteenYrCost.total;
    var netThirtyYr  = value.thirtyYrTotal - thirtyYrCost.total;
    netData.push([netRent, netFifteenYr, netThirtyYr, generalInformation.currentAge]);

    netPositionsTable.innerHTML = "";
    var netRow = netPositionsTable.insertRow();
    netRow.insertCell(0).innerHTML = generalInformation.currentAge;
    netRow.insertCell(1).innerHTML = formatter.format(netRent);
    netRow.insertCell(2).innerHTML = formatter.format(netFifteenYr);
    netRow.insertCell(3).innerHTML = formatter.format(netThirtyYr);

    for (i = 0; i < years; i++){
        // First calculate the increase of costs
        rentCost = {};
        fifteenYrCost = {};
        thirtyYrCost = {};

        rentingInformation.monthlyRent = rentingInformation.monthlyRent * (1 + rentingInformation.rentIncrease);
        buyingInformation.homeValue = buyingInformation.homeValue * (1 + buyingInformation.annualHomeValueAppreciation);
        buyingInformation.annualHomeMaintance = buyingInformation.annualHomeMaintance * (1 + generalInformation.averageInflation);

        rentCost.year = generalInformation.currentAge + i +1;
        rentCost.rentCost = rentingInformation.monthlyRent * 12 + costData[i][0].rentCost;
        rentCost.insurance = rentingInformation.monthlyRentInsurance * 12 + costData[i][0].insurance;
        rentCost.total = rentCost.rentCost + rentCost.insurance;

        fifteenYrCost.year =  rentCost.year;
        if (i < 15) {
            fifteenYrCost.mortgage = fifteenYrYearlyPayment + costData[i][1].mortgage;
        } else {
            fifteenYrCost.mortgage = costData[i][1].mortgage;
        }
        fifteenYrCost.improvements = buyingInformation.annualHomeMaintance + costData[i][1].improvements;
        fifteenYrCost.insurance = buyingInformation.monthlyHomeInsurance * 12 + costData[i][1].insurance;
        fifteenYrCost.taxes = buyingInformation.annualTaxAssesment + costData[i][1].taxes;
        fifteenYrCost.total = fifteenYrCost.mortgage + fifteenYrCost.improvements + fifteenYrCost.insurance + fifteenYrCost.taxes;

        thirtyYrCost.year =  rentCost.year;
        if (i < 30) {
            thirtyYrCost.mortgage = thirtyYrYearlyPayment + costData[i][2].mortgage;
        } else {
            thirtyYrCost.mortgage = costData[i][2].mortgage;
        }
        thirtyYrCost.improvements = buyingInformation.annualHomeMaintance + costData[i][2].improvements;
        thirtyYrCost.insurance = buyingInformation.monthlyHomeInsurance * 12 + costData[i][2].insurance;
        thirtyYrCost.taxes = buyingInformation.annualTaxAssesment + costData[i][2].taxes;
        thirtyYrCost.total = thirtyYrCost.mortgage + thirtyYrCost.improvements + thirtyYrCost.insurance + thirtyYrCost.taxes;

        costData.push([rentCost, fifteenYrCost, thirtyYrCost]);

        costRow = comparativeTotalCostsTable.insertRow();
        costRow.insertCell(0).innerHTML = rentCost.year;
        costRow.insertCell(1).innerHTML = formatter.format(rentCost.total);
        if (i == 14) {
            costRow.insertCell(2).innerHTML = "<b>" + formatter.format(fifteenYrCost.total) + "</b>";
        } else {
            costRow.insertCell(2).innerHTML = formatter.format(fifteenYrCost.total);
        }
        if (i == 29) {
            costRow.insertCell(3).innerHTML = "<b>" + formatter.format(thirtyYrCost.total) + "</b>";
        } else {
            costRow.insertCell(3).innerHTML = formatter.format(thirtyYrCost.total);
        }

        
        // Next calculate the per month costs for this year
        monthCostData.push([rentCost.year, (rentCost.total - costData[i][0].total) / 12, (fifteenYrCost.total - costData[i][1].total) / 12, (thirtyYrCost.total - costData[i][2].total) / 12]);
        monthCostRow = perMonthCostsTable.insertRow();
        monthCostRow.insertCell(0).innerHTML = monthCostData[i+1][0];
        monthCostRow.insertCell(1).innerHTML = formatter.format(monthCostData[i+1][1]);
        monthCostRow.insertCell(2).innerHTML = formatter.format(monthCostData[i+1][2]);
        monthCostRow.insertCell(3).innerHTML = formatter.format(monthCostData[i+1][3]);

        // Next calculate the increase of values
        value = new AssetValues();
        value.age = generalInformation.currentAge + i + 1;

        if (i < 15){
            value.fifteenYrHomeValue = (valueData[i].fifteenYrHomeValue + fifteenYrYearlyPrinciple) * (1 + buyingInformation.annualHomeValueAppreciation);
        } else {
            value.fifteenYrHomeValue = valueData[i].fifteenYrHomeValue * (1 + buyingInformation.annualHomeValueAppreciation);
        }

        if (i < 30) {
            value.thirtyYrHomeValue = (valueData[i].thirtyYrHomeValue + thirtyYrYearlyPrinciple) * (1 + buyingInformation.annualHomeValueAppreciation);
        } else {
            value.thirtyYrHomeValue = valueData[i].thirtyYrHomeValue * (1 + buyingInformation.annualHomeValueAppreciation);
        }

        investmentRentContributions = 0;
        investmentFifteenYrContributions = 0;
        investmentThirtyYrContributions = 0;
        if (generalInformation.currentAge + i < generalInformation.retirmentAge) {
            investmentRentContributions = investingInformation.monthlyInvestmentContribution * 12;
            investmentFifteenYrContributions = investingInformation.monthlyInvestmentContribution * 12;
            investmentThirtyYrContributions = investingInformation.monthlyInvestmentContribution * 12;
        } else {
            investmentRentContributions = -Math.max(0, monthCostData[i+1][1] - generalInformation.monthlySocialSecurity - generalInformation.otherMonthlyRetirementSources);
            investmentFifteenYrContributions = -Math.max(0, monthCostData[i+1][2] - generalInformation.monthlySocialSecurity - generalInformation.otherMonthlyRetirementSources);
            investmentThirtyYrContributions = -Math.max(0, monthCostData[i+1][3] - generalInformation.monthlySocialSecurity - generalInformation.otherMonthlyRetirementSources);
        }

        value.apartmentInvestments = (valueData[i].apartmentInvestments + investmentRentContributions) * (1 + investingInformation.annualInvestmentAppreciation);
        value.fifteenYrInvestments = (valueData[i].fifteenYrInvestments + investmentFifteenYrContributions) * (1 + investingInformation.annualInvestmentAppreciation);
        value.thirtyYrInvestments = (valueData[i].thirtyYrInvestments + investmentThirtyYrContributions) * (1 + investingInformation.annualInvestmentAppreciation);
        valueData.push(value);
        
        valueRow = comparativeAssetValuesTable.insertRow();

        valueRow.insertCell(0).innerHTML = value.age;
        valueRow.insertCell(1).innerHTML = formatter.format(value.apartmentTotal);
        if (value.apartmentTotal < 0) {
            valueRow.cells[1].classList.add("text-danger");
        }

        valueRow.insertCell(2).innerHTML = formatter.format(value.fifteenYrTotal);
        if (value.fifteenYrTotal < 0) {
            valueRow.cells[2].classList.add("text-danger");
        }

        valueRow.insertCell(3).innerHTML = formatter.format(value.thirtyYrTotal);
        if (value.thirtyYrTotal < 0) {
            valueRow.cells[3].classList.add("text-danger");
        }


        // Calculate the monthly use of investment funds
        if (generalInformation.currentAge + i >= generalInformation.retirmentAge) {
            rentUse = Math.max(0, monthCostData[i+1][1] - generalInformation.monthlySocialSecurity - generalInformation.otherMonthlyRetirementSources);
            fifteenYrUse = Math.max(0, monthCostData[i+1][2] - generalInformation.monthlySocialSecurity - generalInformation.otherMonthlyRetirementSources);
            thirtyYrUse = Math.max(0, monthCostData[i+1][3] - generalInformation.monthlySocialSecurity - generalInformation.otherMonthlyRetirementSources);
            monthInvesmentUseData.push([generalInformation.currentAge + i, rentUse, fifteenYrUse, thirtyYrUse]);
        } else {
            monthInvesmentUseData.push([generalInformation.currentAge + i, 0, 0, 0]);
        }
        monthInvestRow = perMonthInvestmentUseTable.insertRow();
        monthInvestRow.insertCell(0).innerHTML = monthInvesmentUseData[i + 1][0];
        monthInvestRow.insertCell(1).innerHTML = formatter.format(monthInvesmentUseData[i + 1][1]);
        monthInvestRow.insertCell(2).innerHTML = formatter.format(monthInvesmentUseData[i + 1][2]);
        monthInvestRow.insertCell(3).innerHTML = formatter.format(monthInvesmentUseData[i + 1][3]);

        // Finally calculate the first year net positions
        netRent = value.apartmentTotal - rentCost.total;
        netFifteenYr = value.fifteenYrTotal - fifteenYrCost.total;
        netThirtyYr  = value.thirtyYrTotal - thirtyYrCost.total;
        netData.push([netRent, netFifteenYr, netThirtyYr, generalInformation.currentAge + i + 1]);

        netRow = netPositionsTable.insertRow();
        netRow.insertCell(0).innerHTML = generalInformation.currentAge + i + 1;
        netRow.insertCell(1).innerHTML = formatter.format(netRent);
        if (netRent < 0) {
            netRow.cells[1].classList.add("text-danger");
        }
        netRow.insertCell(2).innerHTML = formatter.format(netFifteenYr);
        if (netFifteenYr < 0){
            netRow.cells[2].classList.add("text-danger");
        }
        netRow.insertCell(3).innerHTML = formatter.format(netThirtyYr);
        if (netThirtyYr < 0){
            netRow.cells[3].classList.add("text-danger");
        }
    }

    drawTotalCosts(costData);

    drawAssetValues(valueData);

    drawNetPositions(netData);
}

function readForm(){
    generalInformation = {};
    generalInformation.currentAge = Number(document.getElementById("currentAge").value);
    generalInformation.retirmentAge =  Number(document.getElementById("retirmentAge").value);
    generalInformation.deathAge =  Number(document.getElementById("deathAge").value);
    generalInformation.averageInflation =  Number(document.getElementById("averageInflation").value) / 100;
    generalInformation.monthlySocialSecurity =  Number(document.getElementById("monthlySocialSecurity").value);
    generalInformation.otherMonthlyRetirementSources =  Number(document.getElementById("otherMonthlyRetirementSources").value);

    rentingInformation = {};
    rentingInformation.monthlyRent = Number(document.getElementById("monthlyRent").value);
    rentingInformation.rentIncrease = Number(document.getElementById("rentIncrease").value) / 100;
    rentingInformation.monthlyRentInsurance = Number(document.getElementById("monthlyRentInsurance").value);

    buyingInformation = {};
    buyingInformation.mortgage = Number(document.getElementById("mortgage").value);
    buyingInformation.mortgageDownPayment = Number(document.getElementById("mortgageDownPayment").value);
    buyingInformation.homeValue = buyingInformation.mortgage + buyingInformation.mortgageDownPayment;
    buyingInformation.mortgageRate = Number(document.getElementById("mortgageRate").value) / 100;
    buyingInformation.oneTimeRepairs = Number(document.getElementById("oneTimeRepairs").value);
    buyingInformation.annualTaxAssesment = Number(document.getElementById("annualTaxAssesment").value);
    buyingInformation.monthlyHomeInsurance = Number(document.getElementById("monthlyHomeInsurance").value);
    buyingInformation.annualHomeMaintance = Number(document.getElementById("annualHomeMaintance").value);
    buyingInformation.annualHomeValueAppreciation = Number(document.getElementById("annualHomeValueAppreciation").value) / 100;

    investingInformation = {};
    investingInformation.totalCurrentInvesments = Number(document.getElementById("totalCurrentInvesments").value);
    investingInformation.includeDownPayment = Boolean(document.getElementById("includeDownPayment").value);
    investingInformation.monthlyInvestmentContribution = Number(document.getElementById("monthlyInvestmentContribution").value);
    investingInformation.annualInvestmentAppreciation = Number(document.getElementById("annualInvestmentAppreciation").value) / 100;
}

function drawTotalCosts(costData){
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 60;
    const marginBottom = 30;
    const marginLeft = 75;

    min = Math.floor(Math.min(costData[0][0].total, costData[0][1].total, costData[0][2].total));
    max = Math.ceil(Math.max(costData[costData.length - 1][0].total, costData[costData.length - 1][1].total, costData[costData.length - 1][2].total) * 1.10);

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([generalInformation.currentAge, generalInformation.deathAge])
        .range([marginLeft, width - marginRight]);


    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - marginBottom, marginTop]);

    const rentLine = d3.line()
        .x(d => x(d[0].year))
        .y(d => y(d[0].total));

    const fiftenYearLine = d3.line()
        .x(d => x(d[1].year))
        .y(d => y(d[1].total));
        
    const thirtyYearLine = d3.line()
        .x(d => x(d[2].year))
        .y(d => y(d[2].total));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y)
            .ticks(height / 80)
            .tickFormat(d3.format("$,.0f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", rentLine(costData));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "maroon")
        .attr("stroke-width", 1.5)
        .attr("d", fiftenYearLine(costData));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", thirtyYearLine(costData));

    // Append text for rent
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (costData[costData.length - 1][0].total) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Rent");

    // Append text for 15 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (costData[costData.length - 1][1].total) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "maroon")
        .text("15 Yr");

    // Append text for 30 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (costData[costData.length - 1][2].total) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "green")
        .text("30 Yr");
    
    // Append the SVG element.
    document.getElementById("totalCostsGraph").innerHTML = "";
    document.getElementById("totalCostsGraph").append(svg.node());
}

function drawAssetValues(valueData){
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 60;
    const marginBottom = 30;
    const marginLeft = 75;

    years = generalInformation.deathAge - generalInformation.currentAge;
    min = Number.MAX_SAFE_INTEGER;
    max = Number.MIN_SAFE_INTEGER;
    for (i = 0; i < years; i++) {
        min = Math.min(valueData[i].apartmentTotal, valueData[i].fifteenYrTotal, valueData[i].thirtyYrTotal, min);
        max = Math.max(valueData[i].apartmentTotal, valueData[i].fifteenYrTotal, valueData[i].thirtyYrTotal, max);
    }

    max = Math.ceil(max * 1.10);
    min = Math.floor(min);

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([generalInformation.currentAge, generalInformation.deathAge])
        .range([marginLeft, width - marginRight]);


    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - marginBottom, marginTop]);

    const rentLine = d3.line()
        .x(d => x(d.age))
        .y(d => y(d.apartmentTotal));

    const fiftenYearLine = d3.line()
        .x(d => x(d.age))
        .y(d => y(d.fifteenYrTotal));
        
    const thirtyYearLine = d3.line()
        .x(d => x(d.age))
        .y(d => y(d.thirtyYrTotal));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y)
            .ticks(height / 80)
            .tickFormat(d3.format("$,.0f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", rentLine(valueData));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "maroon")
        .attr("stroke-width", 1.5)
        .attr("d", fiftenYearLine(valueData));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", thirtyYearLine(valueData));

    // Append text for rent
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (valueData[valueData.length - 1].apartmentTotal) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Rent");

    // Append text for 15 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (valueData[valueData.length - 1].fifteenYrTotal) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "maroon")
        .text("15 Yr");

    // Append text for 30 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (valueData[valueData.length - 1].thirtyYrTotal) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "green")
        .text("30 Yr");

    // Append the SVG element.
    document.getElementById("totalAssetsGraph").innerHTML = "";
    document.getElementById("totalAssetsGraph").append(svg.node());
}

function drawNetPositions(netData){
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 60;
    const marginBottom = 30;
    const marginLeft = 75;

    years = generalInformation.deathAge - generalInformation.currentAge;
    min = Number.MAX_SAFE_INTEGER;
    max = Number.MIN_SAFE_INTEGER;
    for (i = 0; i < years; i++) {
        min = Math.min(netData[i][0], netData[i][1], netData[i][2], netData[i][3], min);
        max = Math.max(netData[i][0], netData[i][1], netData[i][2], netData[i][3], max);
    }

    max = Math.ceil(max * 1.10);
    min = Math.floor(min);

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([generalInformation.currentAge, generalInformation.deathAge])
        .range([marginLeft, width - marginRight]);


    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - marginBottom, marginTop]);

    const rentLine = d3.line()
        .x(d => x(d[3]))
        .y(d => y(d[0]));

    const fiftenYearLine = d3.line()
        .x(d => x(d[3]))
        .y(d => y(d[1]));
        
    const thirtyYearLine = d3.line()
        .x(d => x(d[3]))
        .y(d => y(d[2]));

    // Create the SVG container.
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    // Add the x-axis.
    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    // Add the y-axis.
    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y)
            .ticks(height / 80)
            .tickFormat(d3.format("$,.0f")))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2", width - marginLeft - marginRight)
            .attr("stroke-opacity", 0.1));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", rentLine(netData));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "maroon")
        .attr("stroke-width", 1.5)
        .attr("d", fiftenYearLine(netData));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", thirtyYearLine(netData));

    // Append text for rent
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (netData[netData.length - 1][0]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Rent");

    // Append text for 15 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (netData[netData.length - 1][1]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "maroon")
        .text("15 Yr");

    // Append text for 30 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (netData[netData.length - 1][2]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "green")
        .text("30 Yr");

    // Append the SVG element.
    document.getElementById("netPositionsGraph").innerHTML = "";
    document.getElementById("netPositionsGraph").append(svg.node());
}