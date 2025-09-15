class GeneralInformation {

    constructor(startAge = 0, retirementAge = 0, lifeExpectancy = 0, inflation = 0,
                socialSecurity = 0, otherRetirementIncome = 0, monthlySpending = 0,
                retirementMonthlySpending = 0) {
        this.startAge = startAge;
        this.retirementAge = retirementAge;
        this.lifeExpectancy = lifeExpectancy;

        this.inflation = inflation;
        this.socialSecurity = socialSecurity;
        this.otherRetirementIncome = otherRetirementIncome;
        this.monthlySpending = monthlySpending;
        this.retirementMonthlySpending = retirementMonthlySpending;
    }
}

class RentingInformation {

    constructor(monthlyRent = 0, rentIncrease = 0, monthlyRentInsurance = 0) {
        this.monthlyRent = monthlyRent;
        this.rentIncrease = rentIncrease;
        this.monthlyRentInsurance = monthlyRentInsurance;
    }
}

class BuyingInformation {

    constructor(mortgage = 0, mortgageDownPayment = 0, homeValue = 0, mortgageRate = 0,
                oneTimeRepairs = 0, annualTaxAssessment = 0, monthlyHomeInsurance = 0,
                annualHomeMaintance = 0, annualHomeValueAppreciation = 0) {
        this.mortgage = mortgage;
        this.mortgageDownPayment = mortgageDownPayment;
        this.homeValue = homeValue;
        this.mortgageRate = mortgageRate;

        this.oneTimeRepairs = oneTimeRepairs;
        this.annualTaxAssessment = annualTaxAssessment;
        this.monthlyHomeInsurance = monthlyHomeInsurance;
        this.annualHomeMaintance = annualHomeMaintance;
        this.annualHomeValueAppreciation = annualHomeValueAppreciation;
    }
}

class InvestingInformation {

    constructor(totalCurrentInvesments = 0, includeDownPayment = 0,
                monthlyInvestmentContribution = 0, annualInvestmentAppreciation = 0) {
        this.totalCurrentInvesments = totalCurrentInvesments;
        this.includeDownPayment = includeDownPayment;
        this.monthlyInvestmentContribution = monthlyInvestmentContribution;
        this.annualInvestmentAppreciation = annualInvestmentAppreciation;
    }
}

class FormInformation {
    constructor(generalInformation, rentingInformation, buyingInformation, investingInformation) {
        this.generalInformation = generalInformation;
        this.rentingInformation = rentingInformation;
        this.buyingInformation = buyingInformation;
        this.investingInformation = investingInformation;
    }
}

function readForm(form) {
    var generalInformation = new GeneralInformation();
    generalInformation.startAge = Number(document.getElementById("currentAge").value);
    generalInformation.retirementAge =  Number(document.getElementById("retirementAge").value);
    generalInformation.lifeExpectancy =  Number(document.getElementById("deathAge").value);
    generalInformation.inflation =  Number(document.getElementById("averageInflation").value) / 100;
    generalInformation.socialSecurity =  Number(document.getElementById("monthlySocialSecurity").value);
    generalInformation.otherRetirementIncome =  Number(document.getElementById("otherMonthlyRetirementSources").value);
    generalInformation.monthlySpending =  Number(document.getElementById("currentMonthlySpending").value);
    generalInformation.retirementMonthlySpending =  Number(document.getElementById("expectedMonthlySpendingInRetirement").value);

    var rentingInformation = new RentingInformation();
    rentingInformation.monthlyRent = Number(document.getElementById("monthlyRent").value);
    rentingInformation.rentIncrease = Number(document.getElementById("rentIncrease").value) / 100;
    rentingInformation.monthlyRentInsurance = Number(document.getElementById("monthlyRentInsurance").value);

    var buyingInformation = new BuyingInformation();
    buyingInformation.mortgage = Number(document.getElementById("mortgage").value);
    buyingInformation.mortgageDownPayment = Number(document.getElementById("mortgageDownPayment").value);
    buyingInformation.homeValue = buyingInformation.mortgage + buyingInformation.mortgageDownPayment;
    buyingInformation.mortgageRate = Number(document.getElementById("mortgageRate").value) / 100;
    buyingInformation.oneTimeRepairs = Number(document.getElementById("oneTimeRepairs").value);
    buyingInformation.annualTaxAssessment = Number(document.getElementById("annualTaxAssesment").value);
    buyingInformation.monthlyHomeInsurance = Number(document.getElementById("monthlyHomeInsurance").value);
    buyingInformation.annualHomeMaintance = Number(document.getElementById("annualHomeMaintance").value);
    buyingInformation.annualHomeValueAppreciation = Number(document.getElementById("annualHomeValueAppreciation").value) / 100;

    var investingInformation = new InvestingInformation();
    investingInformation.totalCurrentInvesments = Number(document.getElementById("totalCurrentInvesments").value);
    investingInformation.includeDownPayment = Boolean(document.getElementById("includeDownPayment").value);
    investingInformation.monthlyInvestmentContribution = Number(document.getElementById("monthlyInvestmentContribution").value);
    investingInformation.annualInvestmentAppreciation = Number(document.getElementById("annualInvestmentAppreciation").value) / 100;

    return new FormInformation(generalInformation, rentingInformation, buyingInformation, investingInformation);
}

function calculateTotalCosts(housing, livingExpenses) {
    var years = housing[0].housingData.length;
    var totalCosts = [];

    for (var i = 0; i < years; i++) {
        var values = [];
        for (var j = 0; j < housing.length; j++) {
            values.push(housing[j].housingData[i].totalCosts + livingExpenses.expensesData[i].totalCosts);
        }
        totalCosts.push([housing[0].housingData[i].age, values]);
    }
    return totalCosts;
}

function calculateCumulativeAssets(investments, housing) {
    var years = investments[0].investmentData.length;
    var cumulativeAssets = [];

    for (var i = 0; i < years; i++) {
        var values = [];
        for (var j = 0; j < investments[0].investmentData[i].value.length; j++) {
            var sum = 0;   
            for (var x = 0; x < investments.length; x++) {
                sum += investments[x].investmentData[i].value[j];
            }  
            values.push(sum + housing[j].housingData[i].value);
        }
        cumulativeAssets.push([investments[0].investmentData[i].age, values]);
    }
    return cumulativeAssets;
}

function calculateNetPositions(cumulativeAssets, housing, livingExpenses) {
    var years = cumulativeAssets.length;
    var netPositions = [];

    for (var i = 0; i < years; i++) {
        var values = [];
        for (var j = 0; j < cumulativeAssets[i][1].length; j++) {
            values.push(cumulativeAssets[i][1][j] - 
                            housing[j].housingData[i].totalCosts - 
                            livingExpenses.expensesData[i].totalCosts);
        }
        netPositions.push([cumulativeAssets[i][0], values]);
    }
    return netPositions;
}

function updateTables(investments, housing, livingExpenses, assetValues, netValues,
                        totalCostsTable, perMonthCostsTable,
                        perMonthInvestmentUseTable, investmentValueTable,
                        cumulativeAssetsTable, netPositionsTable) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        trailingZeroDisplay: 'stripIfInteger'
    });
    
    totalCostsTable.innerHTML = "";
    perMonthCostsTable.innerHTML = "";
    perMonthInvestmentUseTable.innerHTML = "";
    investmentValueTable.innerHTML = "";
    cumulativeAssetsTable.innerHTML = "";
    netPositionsTable.innerHTML = "";

    // Total Costs Table
    for (var i = 0; i < housing[0].housingData.length; i++) {
        var row = totalCostsTable.insertRow();
        row.insertCell(0).innerText = housing[0].housingData[i].age;
        for (var j = 0; j < housing.length; j++) {
            var cell = row.insertCell(j + 1);
            cell.innerText = formatter.format(housing[j].housingData[i].totalCosts + 
                                                                livingExpenses.expensesData[i].totalCosts);
                                                                
            if (housing[j] instanceof House &&
                 i + 1 == housing[j].mortgageTermYears) {
                cell.classList.add("fw-bold");
            }
        }
    }

    // Per Month Costs Table
    for (var i = 0; i < housing[0].housingData.length; i++) {
        var row = perMonthCostsTable.insertRow();
        row.insertCell(0).innerText = housing[0].housingData[i].age;
        for (var j = 0; j < housing.length; j++) {
            var cell = row.insertCell(j + 1);
            cell.innerText = formatter.format(housing[j].housingData[i].yearlyCosts / 12 +
                                                livingExpenses.expensesData[i].yearlySpending / 12);
        }
    }

    // Per Month Investment Use Table
    for (var i = 0; i < housing[0].housingData.length; i++) {
        var row = perMonthInvestmentUseTable.insertRow();
        row.insertCell(0).innerText = housing[0].housingData[i].age;
        for (var j = 0; j < housing.length; j++) {

            if (generalInformation.startAge + i < generalInformation.retirementAge) {
                row.insertCell(j + 1).innerText = formatter.format(0);
                continue;
            }

            var investmentUse = (housing[j].housingData[i].yearlyCosts / 12)  +
                                    livingExpenses.expensesData[i].yearlySpending / 12 - 
                                    generalInformation.socialSecurity - generalInformation.otherRetirementIncome;
            row.insertCell(j + 1).innerText = formatter.format(investmentUse > 0 ? investmentUse : 0);
        }
    }
    
    // Investment Values Table
    for (var i = 0; i < investments[0].investmentData.length; i++) {
        var row = investmentValueTable.insertRow();
        row.insertCell(0).innerText = investments[0].investmentData[i].age;
        for (var j = 0; j < investments[0].investmentData[i].value.length; j++) {
            var cell = row.insertCell(j + 1);
            cell.innerText = formatter.format(investments[0].investmentData[i].value[j]);
            if (investments[0].investmentData[i].value[j] < 0) {
                cell.classList.add("text-danger");
            }
        }
    }

    // Cumulative Assets Table
    for (var i = 0; i < assetValues.length; i++) {
        var row = cumulativeAssetsTable.insertRow();
        row.insertCell(0).innerText = assetValues[i][0];
        for (var j = 0; j < assetValues[i][1].length; j++) {
            var cell = row.insertCell(j + 1);
            cell.innerText = formatter.format(assetValues[i][1][j]);
            if (assetValues[i][1][j] < 0) {
                cell.classList.add("text-danger");
            }
        }
    }

    // Net Positions Table
    for (var i = 0; i < investments[0].investmentData.length; i++) {
        var row = netPositionsTable.insertRow();
        row.insertCell(0).innerText = netValues[i][0];
        for (var j = 0; j < netValues[i][1].length; j++) {
            var cell = row.insertCell(j + 1);
            cell.innerText = formatter.format(netValues[i][1][j]);
            if (netValues[i][1][j] < 0) {
                cell.classList.add("text-danger");
            }
        }
    }
}