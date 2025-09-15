comparativeTotalCostsTable = null;
perMonthCostsTable = null;
perMonthInvestmentUseTable = null;
investmentValueTable = null;
comparativeAssetValuesTable = null;
netPositionsTable = null;
form = null;

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger'
});

window.onload = function() {
    form = document.querySelector("#detailsForm");
    form.addEventListener("submit", calc);

    comparativeTotalCostsTable = document.querySelector("#comparativeTotalCostsTable").getElementsByTagName("tbody")[0];
    perMonthCostsTable = document.querySelector("#perMonthCostsTable").getElementsByTagName("tbody")[0];
    perMonthInvestmentUseTable = document.querySelector("#perMonthInvestmentUseTable").getElementsByTagName("tbody")[0];
    investmentValueTable = document.querySelector("#investmentValueTable").getElementsByTagName("tbody")[0];
    comparativeAssetValuesTable = document.querySelector("#comparativeAssetValuesTable").getElementsByTagName("tbody")[0];
    netPositionsTable = document.querySelector("#netPositionsTable").getElementsByTagName("tbody")[0];
}

function calc(e){
    e.preventDefault();
    
    formInformation = readForm();
    generalInformation = formInformation.generalInformation;
    rentingInformation = formInformation.rentingInformation;
    buyingInformation = formInformation.buyingInformation;
    investingInformation = formInformation.investingInformation;

    rental = new Apartment(generalInformation, rentingInformation.monthlyRentInsurance, 0,
                            rentingInformation.monthlyRent, rentingInformation.rentIncrease);
    rental.calculateData();

    house15 = new House(generalInformation, buyingInformation.monthlyHomeInsurance, 0,
                        buyingInformation.mortgage, buyingInformation.mortgageDownPayment,
                        buyingInformation.mortgageRate, 15, buyingInformation.annualTaxAssessment,
                        buyingInformation.annualHomeValueAppreciation, buyingInformation.oneTimeRepairs,
                        buyingInformation.annualHomeMaintance);
    house15.calculateData();


    house30 = new House(generalInformation, buyingInformation.monthlyHomeInsurance, 0,
                        buyingInformation.mortgage, buyingInformation.mortgageDownPayment,
                        buyingInformation.mortgageRate, 30, buyingInformation.annualTaxAssessment,
                        buyingInformation.annualHomeValueAppreciation, buyingInformation.oneTimeRepairs,
                        buyingInformation.annualHomeMaintance);
    house30.calculateData();

    livingExpenses = new LivingExpenses(generalInformation);
    livingExpenses.calculateData();

    investments = new NonTaxableInvestment(generalInformation, investingInformation.totalCurrentInvesments,
                                            investingInformation.annualInvestmentAppreciation,
                                            investingInformation.monthlyInvestmentContribution);
    investments.calculateData([rental, house15, house30], livingExpenses);
    
    var totalCosts = calculateTotalCosts([rental, house15, house30], livingExpenses);
    var assetValues = calculateCumulativeAssets([investments], [rental, house15, house30]);
    var netValues = calculateNetPositions(assetValues, [rental, house15, house30], livingExpenses);

    updateTables([investments], [rental, house15, house30], livingExpenses, assetValues, netValues,
                    comparativeTotalCostsTable, perMonthCostsTable,
                    perMonthInvestmentUseTable, investmentValueTable, comparativeAssetValuesTable, netPositionsTable);
    
    drawTotalCosts(totalCosts);

    drawAssetValues(assetValues);

    drawNetPositions(netValues);

    return;
}

function drawTotalCosts(totalCosts){
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;
    const marginTop = 20;
    const marginRight = 60;
    const marginBottom = 30;
    const marginLeft = 75;

    const years = totalCosts.length;
    var min = Number.MAX_SAFE_INTEGER;
    var max = Number.MIN_SAFE_INTEGER;
    for (i = 0; i < totalCosts.length; i++) {
        min = Math.min(...totalCosts[i][1], min);
        max = Math.max(...totalCosts[i][1], max);
    }

    max = Math.ceil(max * 1.10);
    min = Math.floor(min);

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([totalCosts[0][0], totalCosts[years - 1][0]])
        .range([marginLeft, width - marginRight]);

    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - marginBottom, marginTop]);

    const rentLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][0]));

    const fiftenYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][1]));
        
    const thirtyYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][2]));

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
        .attr("d", rentLine(totalCosts));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "maroon")
        .attr("stroke-width", 1.5)
        .attr("d", fiftenYearLine(totalCosts));

    // Append a path for the line.
    svg.append("path")
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", thirtyYearLine(totalCosts));

    // Append text for rent
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (totalCosts[years - 1][1][0]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Rent");

    // Append text for 15 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (totalCosts[years - 1][1][1]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "maroon")
        .text("15 Yr");

    // Append text for 30 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (totalCosts[years - 1][1][2]) + ")")
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

    const years = valueData.length;
    var min = Number.MAX_SAFE_INTEGER;
    var max = Number.MIN_SAFE_INTEGER;
    for (i = 0; i < valueData.length; i++) {
        min = Math.min(...valueData[i][1], min);
        max = Math.max(...valueData[i][1], max);
    }

    max = Math.ceil(max * 1.10);
    min = Math.floor(min);


    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([valueData[0][0], valueData[years - 1][0]])
        .range([marginLeft, width - marginRight]);


    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - marginBottom, marginTop]);

    const rentLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][0]));

    const fiftenYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][1]));
        
    const thirtyYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][2]));

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
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (valueData[years - 1][1][0]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Rent");

    // Append text for 15 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (valueData[years - 1][1][1]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "maroon")
        .text("15 Yr");

    // Append text for 30 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (valueData[years - 1][1][2]) + ")")
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

    var years = netData.length;
    var min = Number.MAX_SAFE_INTEGER;
    var max = Number.MIN_SAFE_INTEGER;
    for (i = 0; i < years; i++) {
        min = Math.min(...netData[i][1], min);
        max = Math.max(...netData[i][1], max);
    }


    max = Math.ceil(max * 1.10);
    min = Math.floor(min);

    // Declare the x (horizontal position) scale.
    const x = d3.scaleLinear()
        .domain([netData[0][0], netData[years - 1][0]])
        .range([marginLeft, width - marginRight]);


    // Declare the y (vertical position) scale.
    const y = d3.scaleLinear()
        .domain([min, max])
        .range([height - marginBottom, marginTop]);

    const rentLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][0]));

    const fiftenYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][1]));
        
    const thirtyYearLine = d3.line()
        .x(d => x(d[0]))
        .y(d => y(d[1][2]));

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
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (netData[years - 1][1][0]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "steelblue")
        .text("Rent");

    // Append text for 15 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (netData[years - 1][1][1]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "maroon")
        .text("15 Yr");

    // Append text for 30 yr
    svg.append("text")
        .attr("transform", "translate(" + (width - marginRight + 3) + "," + y (netData[years - 1][1][2]) + ")")
        .attr("dy", ".35em")
        .attr("text-anchor", "start")
        .style("fill", "green")
        .text("30 Yr");

    // Append the SVG element.
    document.getElementById("netPositionsGraph").innerHTML = "";
    document.getElementById("netPositionsGraph").append(svg.node());
}